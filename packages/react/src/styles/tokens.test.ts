import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

const themeCss = read('./theme.css');
const globalsCss = read('./globals.css');
const inputConfig = read('../config/input.ts');
const selectConfig = read('../config/select.ts');
const buttonConfig = read('../config/button.ts');
const tabsConfig = read('../config/tabs.ts');

describe('Design-extension tokens (src)', () => {
  it('defines --font-heading in @theme with the sans stack as default', () => {
    expect(themeCss).toMatch(/--font-heading:\s*\n?\s*"IBM Plex Sans"/);
  });

  it('defines motion tokens and wires the Tailwind default transition chain', () => {
    expect(globalsCss).toMatch(/--kala-duration-fast:\s*120ms/);
    expect(globalsCss).toMatch(/--kala-duration-base:\s*150ms/);
    expect(globalsCss).toMatch(/--kala-duration-slow:\s*200ms/);
    expect(globalsCss).toMatch(/--kala-ease:\s*cubic-bezier/);
    expect(globalsCss).toMatch(/--default-transition-duration:\s*var\(--kala-duration-base\)/);
    expect(globalsCss).toMatch(/--default-transition-timing-function:\s*var\(--kala-ease\)/);
  });

  it('defines --kala-radius-input on a single declaration line falling back to the control radius', () => {
    // Single-line form: tooling greps the raw declaration, so var( must not wrap.
    expect(globalsCss).toMatch(/--kala-radius-input:\s*var\(--kala-radius-control\)/);
  });

  it('input and select use the input radius; button and tabs keep the control radius', () => {
    const inputRadius = 'rounded-[var(--kala-radius-input,var(--kala-radius-control))]';
    const controlRadius = 'rounded-[var(--kala-radius-control)]';
    expect(inputConfig).toContain(inputRadius);
    expect(selectConfig).toContain(inputRadius);
    expect(buttonConfig).toContain(controlRadius);
    expect(buttonConfig).not.toContain('--kala-radius-input');
    expect(tabsConfig).toContain(controlRadius);
    expect(tabsConfig).not.toContain('--kala-radius-input');
  });
});

const distGlobalsCss = (() => {
  try {
    return read('../../dist/styles/globals.css');
  } catch {
    return null;
  }
})();

describe.skipIf(distGlobalsCss === null)('Design-extension tokens (dist)', () => {
  const css = distGlobalsCss as string;

  it('emits the font-heading utility', () => {
    expect(css).toMatch(/\.font-heading\s*\{/);
  });

  it('chains the default transition duration to the kala duration token', () => {
    expect(css).toMatch(/--default-transition-duration:\s*var\(--kala-duration-base\)/);
  });

  it('compiled transition utilities emit the default duration var, not a literal', () => {
    const transitionUtility = css.match(/\.transition-colors\s*\{[^}]*\}/)?.[0] ?? '';
    expect(transitionUtility).toMatch(/var\(--default-transition-duration\)/);
    expect(transitionUtility).not.toMatch(/transition-duration:\s*150ms/);
  });

  it('keeps the radius-input fallback class intact (no calc wrapping)', () => {
    expect(css).toContain('border-radius: var(--kala-radius-input,var(--kala-radius-control))');
  });
});
