import type { TestRunnerConfig } from '@storybook/test-runner';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Storybook test-runner harness.
 *
 * Every story gets the test-runner's built-in smoke coverage: it must render
 * without errors, run its play function, and match its committed DOM snapshot.
 *
 * Stories of the core components below additionally get deterministic
 * *visual* regression coverage: a curated set of computed CSS properties is
 * captured for every element of the story in BOTH light and dark themes and
 * compared against committed JSON baselines. Computed styles are used instead
 * of pixel screenshots on purpose — they are stable across operating systems
 * and font rasterizers (no flaky baselines), while still catching every
 * token, color, spacing, and layout-mode regression the themes can produce.
 * Intrinsic text-derived geometry (width/height) is excluded for the same
 * reason; specified paddings/margins/borders are font-independent and kept.
 * `font-family` is also excluded: Chromium expands `system-ui` into the
 * host OS's system font list, so the computed value differs between macOS
 * and the Linux CI runners even for identical CSS.
 *
 * Baselines live in `.storybook/visual-baselines/<story>.<theme>.json`.
 * Regenerate deliberately with: UPDATE_SNAPSHOTS=1 pnpm run test-storybook
 */

// Core components: the high-traffic primitives that every app touches.
const CORE_VISUAL_STORIES = new Set([
	'Buttons/Button',
	'Buttons/ButtonGroup',
	'Data Display/Accordion',
	'Data Display/Avatar',
	'Data Display/Badge',
	'Data Display/Card',
	'Data Display/List',
	'Data Display/Table',
	'Display/Tag',
	'Feedback/Alert',
	'Feedback/Banner',
	'Feedback/Progress',
	'Feedback/Spinner',
	'Forms/Checkbox',
	'Forms/Input',
	'Forms/Label',
	'Forms/MultiSelect',
	'Forms/NumberInput',
	'Forms/RadioGroup',
	'Forms/Select',
	'Forms/Slider',
	'Forms/Switch',
	'Forms/Textarea',
	'Forms/Toggle',
	'Navigation/Tabs',
	'Overlay/Dialog',
	'Overlay/DropdownMenu',
	'Overlay/Popover',
	'Overlay/Tooltip',
	'Components/Pagination',
	'Components/SegmentedControl',
]);

const THEMES = ['light', 'dark'] as const;

const BASELINE_DIR = join(
	fileURLToPath(new URL('.', import.meta.url)),
	'visual-baselines',
);
const MAX_CAPTURED_ELEMENTS = 200;

// Curated visual properties: everything that paints, minus intrinsic
// text-derived geometry. Must stay in sync with the browser-side collector.
const VISUAL_PROPS = [
	'display',
	'position',
	'visibility',
	'opacity',
	'color',
	'background-color',
	'background-image',
	'border-top-color',
	'border-top-width',
	'border-top-style',
	'border-right-color',
	'border-right-width',
	'border-right-style',
	'border-bottom-color',
	'border-bottom-width',
	'border-bottom-style',
	'border-left-color',
	'border-left-width',
	'border-left-style',
	'border-top-left-radius',
	'border-top-right-radius',
	'border-bottom-left-radius',
	'border-bottom-right-radius',
	'box-shadow',
	'outline-color',
	'outline-width',
	'outline-style',
	'font-size',
	'font-weight',
	'font-style',
	'line-height',
	'letter-spacing',
	'text-transform',
	'text-decoration-line',
	'text-align',
	'flex-direction',
	'flex-wrap',
	'align-items',
	'justify-content',
	'gap',
	'grid-template-columns',
	'padding-top',
	'padding-right',
	'padding-bottom',
	'padding-left',
	'margin-top',
	'margin-right',
	'margin-bottom',
	'margin-left',
	'overflow',
	'overflow-x',
	'overflow-y',
	'z-index',
	'transform',
	'cursor',
	'pointer-events',
] as const;

type CapturedNode = {
	path: string;
	tag: string;
	classes: string;
	slot: string;
	styles: Record<(typeof VISUAL_PROPS)[number], string>;
};

const FREEZE_STYLE_ID = 'kala-visual-freeze';

async function applyTheme(
	page: import('playwright').Page,
	theme: (typeof THEMES)[number],
) {
	await page.evaluate((themeName) => {
		const root = document.documentElement;
		root.classList.remove(
			'dark',
			'neutral',
			'accent',
			'high-contrast-light',
			'high-contrast-dark',
		);
		if (themeName !== 'light') root.classList.add(themeName);
		root.style.colorScheme = themeName === 'dark' ? 'dark' : 'light';
	}, theme);
}

async function captureStyles(page: import('playwright').Page) {	const props = VISUAL_PROPS as unknown as string[];
	return page.evaluate(
		({ props, maxNodes }) => {
			const root = document.getElementById('storybook-root');
			if (!root) return [];
			const elements = [root, ...Array.from(root.querySelectorAll('*'))].slice(
				0,
				maxNodes,
			);
			const pathOf = (el: Element, depth: number) => {
				const parent = el.parentElement;
				const index = parent
					? Array.prototype.indexOf.call(parent.children, el)
					: 0;
				return `${depth}:${index}`;
			};
			return elements.map((el, i) => {
				const computed = window.getComputedStyle(el);
				const styles: Record<string, string> = {};
				for (const prop of props) styles[prop] = computed.getPropertyValue(prop);
				return {
					path: pathOf(el, i),
					tag: el.tagName.toLowerCase(),
					classes: el.getAttribute('class') ?? '',
					slot: el.getAttribute('data-slot') ?? '',
					styles,
				};
			});
		},
		{ props, maxNodes: MAX_CAPTURED_ELEMENTS },
	) as Promise<CapturedNode[]>;
}

function baselinePath(storyId: string, theme: string) {
	const safe = storyId.toLowerCase().replace(/[^a-z0-9]+/g, '-');
	return join(BASELINE_DIR, `${safe}.${theme}.json`);
}

// Compare captures against the baseline and report a bounded list of precise,
// per-property diffs. A deep-equality dump of the whole JSON crashes CI
// runners instead of reporting (Node's stdout write fails with EINVAL on the
// multi-megabyte jest diff), and is unreadable anyway.
const MAX_REPORTED_DIFFS = 20;

function diffCaptures(
	captured: CapturedNode[],
	baseline: CapturedNode[],
): string[] {
	const diffs: string[] = [];
	const count = Math.max(captured.length, baseline.length);
	for (let i = 0; i < count && diffs.length < MAX_REPORTED_DIFFS; i++) {
		const got = captured[i];
		const want = baseline[i];
		if (!got || !want) {
			diffs.push(
				`node[${i}]: ${got ? 'unexpected extra node' : 'missing node'} vs baseline`,
			);
			continue;
		}
		if (got.tag !== want.tag || got.slot !== want.slot || got.classes !== want.classes) {
			diffs.push(
				`node[${i}]: structure <${want.tag} slot="${want.slot}" class="${want.classes}"> -> <${got.tag} slot="${got.slot}" class="${got.classes}">`,
			);
		}
		for (const prop of VISUAL_PROPS) {
			if (got.styles[prop] !== want.styles[prop]) {
				diffs.push(
					`node[${i}] <${want.tag}> ${prop}: expected ${JSON.stringify(want.styles[prop])}, received ${JSON.stringify(got.styles[prop])}`,
				);
			}
		}
	}
	return diffs;
}

// The CSS freeze stops keyframe/transition animations, but framer-motion and
// friends drive inline styles from requestAnimationFrame and the Web
// Animations API. Finish those, then keep sampling until two consecutive
// captures are identical AND a minimum observation window has elapsed — the
// window covers stories that switch state on their own timers (e.g. a
// progress story that advances 500ms after mount). The preview also wraps
// stories in MotionConfig reducedMotion="user", which this harness pairs
// with an emulated reduced-motion preference so framer jumps to final state
// instead of animating.
const MIN_OBSERVATION_MS = 750;

async function captureStable(page: import('playwright').Page) {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.evaluate(() => {
		for (const animation of document.getAnimations()) {
			try {
				animation.finish();
			} catch {
				// infinite animations cannot finish — the CSS freeze holds them
			}
		}
	});
	const start = Date.now();
	let previous = await captureStyles(page);
	while (true) {
		await page.waitForTimeout(120);
		const next = await captureStyles(page);
		const stable = JSON.stringify(next) === JSON.stringify(previous);
		const elapsed = Date.now() - start;
		if (stable && elapsed >= MIN_OBSERVATION_MS) return next;
		if (elapsed >= MIN_OBSERVATION_MS + 20_000) return next;
		previous = next;
	}
}

const config: TestRunnerConfig = {
	async postVisit(page, context) {
		if (!CORE_VISUAL_STORIES.has(context.title)) return;

		// Freeze animations and carets so timing never leaks into a capture.
		await page.addStyleTag({
			id: FREEZE_STYLE_ID,
			content: `*, *::before, *::after {
				animation: none !important;
				transition: none !important;
				caret-color: transparent !important;
				scroll-behavior: auto !important;
			}`,
		});
		await page.evaluate(() => document.fonts.ready);
		await page.waitForTimeout(50);

		for (const theme of THEMES) {
			await applyTheme(page, theme);
			// One frame for the new theme classes to take effect.
			await page.waitForTimeout(50);
			const captured = await captureStable(page);

			const file = baselinePath(context.id, theme);
			const hasBaseline = existsSync(file);
			if (hasBaseline && !process.env.UPDATE_SNAPSHOTS) {
				const baseline = JSON.parse(await readFile(file, 'utf8')) as CapturedNode[];
				const diffs = diffCaptures(captured, baseline);
				if (diffs.length > 0) {
					throw new Error(
						`visual baseline mismatch (${diffs.length}${diffs.length >= MAX_REPORTED_DIFFS ? '+' : ''} diffs shown):\n  ${diffs.join('\n  ')}`,
					);
				}
			} else {
				await mkdir(dirname(file), { recursive: true });
				await writeFile(file, `${JSON.stringify(captured, null, 1)}\n`, 'utf8');
				console.log(
					`[visual] ${hasBaseline ? 'updated' : 'wrote new'} baseline ${context.id} (${theme})`,
				);
			}
		}

		// Leave the story in its default state for the DOM snapshot.
		await applyTheme(page, 'light');
	},
};

export default config;
