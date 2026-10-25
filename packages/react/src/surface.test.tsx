// @vitest-environment jsdom
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { createTheme, resolveSurfaceRecipe } from '@tactile-ui/theme';
import { Surface, surfaceToCSS } from './surface';
import { TactileProvider } from './provider';
afterEach(cleanup);
describe('DOM Surface', () => {
  it('renders deterministic SSR without adding interactive semantics', () => {
    const tree = (
      <TactileProvider preference="light">
        <Surface preset="porcelain">Material</Surface>
      </TactileProvider>
    );
    const html = renderToString(tree);
    expect(html).toBe(renderToString(tree));
    expect(html).toContain('data-tactile-surface="porcelain"');
    expect(html).toContain('linear-gradient');
    expect(html).not.toMatch(/tabindex|role=|disabled=/);
  });
  it('forwards the ref and host attributes, allows style overrides, and keeps state visual', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <TactileProvider preference="light">
        <Surface
          ref={ref}
          state="disabled"
          aria-label="Sample material"
          style={{ padding: 20, borderRadius: 12 }}
        >
          Child
        </Surface>
      </TactileProvider>,
    );
    const element = screen.getByLabelText('Sample material');
    expect(ref.current).toBe(element);
    expect(element.style.padding).toBe('20px');
    expect(element.style.borderRadius).toBe('12px');
    expect(element.getAttribute('data-surface-state')).toBe('disabled');
    expect(element.hasAttribute('aria-disabled')).toBe(false);
    expect(element.style.opacity).toBe('0.5');
    expect(element.textContent).toBe('Child');
  });
  it('uses the nearest provider for token radius and maps contact and ambient shadows', () => {
    const theme = createTheme({ radius: { md: 23 } });
    render(
      <TactileProvider theme={theme}>
        <Surface radius="md" data-testid="outer" />
        <TactileProvider theme={createTheme()}>
          <Surface radius="md" data-testid="inner" />
        </TactileProvider>
      </TactileProvider>,
    );
    expect(screen.getByTestId('outer').style.borderRadius).toBe('23px');
    expect(screen.getByTestId('inner').style.borderRadius).toBe('12px');
    const recipe = resolveSurfaceRecipe(theme);
    expect(surfaceToCSS(recipe).boxShadow).toContain('0 5px 10px');
    expect(surfaceToCSS(recipe).boxShadow).toContain('inset');
  });
});
