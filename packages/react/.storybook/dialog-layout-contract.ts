/**
 * Geometry contract for the dialog scroll fix; the pinned stories render
 * open via defaultOpen so postVisit can measure real layout in Chromium.
 */

export const LAYOUT_CONTRACT_STORIES: Record<string, { scrollable: boolean }> =
	{
		'overlay-dialog--pinned-footer': { scrollable: true },
		'overlay-dialog--form-composition': { scrollable: true },
		'overlay-dialog--short-content': { scrollable: false },
	};

type DialogLayoutMeasurement = {
	viewport: { width: number; height: number };
	contentOverflow: string;
	card: {
		top: number;
		left: number;
		right: number;
		bottom: number;
		height: number;
	};
	scroll: { scrollHeight: number; clientHeight: number; overflowY: string };
	footerBottom: number;
	headerBottom: number;
	offenders: string[];
};

async function measureDialogLayout(
	page: import('playwright').Page,
): Promise<DialogLayoutMeasurement> {
	return page.evaluate(() => {
		const content = document.querySelector('[data-slot="dialog-content"]');
		const scrollRegion = document.querySelector(
			'[data-slot="dialog-body"], [data-testid="form-scroll-region"]',
		);
		const footer = document.querySelector('[data-slot="dialog-footer"]');
		const header = document.querySelector('[data-slot="dialog-header"]');
		if (!content || !scrollRegion || !footer || !header) {
			throw new Error('dialog layout contract: required slots missing');
		}
		const card = content.getBoundingClientRect();
		const offenders: string[] = [];
		for (const el of Array.from(content.querySelectorAll('*'))) {
			if (scrollRegion.contains(el)) continue;
			const r = el.getBoundingClientRect();
			if (r.width === 0 || r.height === 0) continue;
			if (
				r.top < card.top - 0.5 ||
				r.left < card.left - 0.5 ||
				r.bottom > card.bottom + 0.5 ||
				r.right > card.right + 0.5
			) {
				offenders.push(
					`${el.tagName.toLowerCase()}[${el.getAttribute('data-slot') ?? el.getAttribute('data-testid') ?? ''}]`,
				);
			}
		}
		return {
			viewport: { width: window.innerWidth, height: window.innerHeight },
			contentOverflow: getComputedStyle(content).overflow,
			card: {
				top: card.top,
				left: card.left,
				right: card.right,
				bottom: card.bottom,
				height: card.height,
			},
			scroll: {
				scrollHeight: scrollRegion.scrollHeight,
				clientHeight: scrollRegion.clientHeight,
				overflowY: getComputedStyle(scrollRegion).overflowY,
			},
			footerBottom: footer.getBoundingClientRect().bottom,
			headerBottom: header.getBoundingClientRect().bottom,
			offenders,
		};
	});
}

export async function assertDialogLayoutContract(
	page: import('playwright').Page,
	scrollable: boolean,
) {
	const failures: string[] = [];
	for (const viewport of [
		{ width: 1280, height: 900 },
		{ width: 375, height: 812 },
	]) {
		await page.setViewportSize(viewport);
		await page.waitForTimeout(120);
		const m = await measureDialogLayout(page);
		const label = `${viewport.width}x${viewport.height}`;
		if (m.contentOverflow !== 'hidden') {
			failures.push(
				`${label}: content overflow is ${m.contentOverflow}, expected hidden`,
			);
		}
		if (m.scroll.overflowY !== 'auto') {
			failures.push(
				`${label}: scroll region overflow-y is ${m.scroll.overflowY}, expected auto`,
			);
		}
		if (scrollable && m.scroll.scrollHeight <= m.scroll.clientHeight) {
			failures.push(
				`${label}: scroll region never engages (scrollHeight ${m.scroll.scrollHeight} <= clientHeight ${m.scroll.clientHeight})`,
			);
		}
		if (!scrollable && m.scroll.scrollHeight !== m.scroll.clientHeight) {
			failures.push(
				`${label}: short content shows a scrollbar (scrollHeight ${m.scroll.scrollHeight} > clientHeight ${m.scroll.clientHeight})`,
			);
		}
		if (
			m.footerBottom > m.viewport.height + 0.5 ||
			m.footerBottom > m.card.bottom + 0.5
		) {
			failures.push(
				`${label}: footer not fully visible (bottom ${m.footerBottom}, viewport ${m.viewport.height}, card ${m.card.bottom})`,
			);
		}
		if (m.headerBottom > m.card.bottom + 0.5) {
			failures.push(
				`${label}: header escapes the card (bottom ${m.headerBottom} > card ${m.card.bottom})`,
			);
		}
		if (m.offenders.length > 0) {
			failures.push(
				`${label}: elements render outside the card: ${m.offenders.slice(0, 5).join(', ')}`,
			);
		}
		if (viewport.width === 375) {
			if (
				m.card.top > 0.5 ||
				m.card.left > 0.5 ||
				m.card.bottom < m.viewport.height - 0.5 ||
				m.card.right < m.viewport.width - 0.5
			) {
				failures.push(`${label}: mobile card no longer fills the viewport`);
			}
		} else if (
			m.card.bottom > m.viewport.height + 0.5 ||
			m.card.height > m.viewport.height * 0.9 + 1
		) {
			failures.push(
				`${label}: card exceeds the 90vh cap (height ${m.card.height}, viewport ${m.viewport.height})`,
			);
		}
	}
	if (failures.length > 0) {
		throw new Error(
			`dialog layout contract failed:\n  ${failures.join('\n  ')}`,
		);
	}
}
