// @vitest-environment jsdom
import { act, cleanup, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTheme } from '@tactile-ui/theme';
import { TactileProvider, useTactileTheme } from './provider';
import { themeToCSSVariables } from './styles';
afterEach(cleanup);
function Reader() {
  return <span>{useTactileTheme().mode}</span>;
}
describe('React DOM foundation', () => {
  it('scopes variables, forwards HTML attributes, and preserves consumer styles', () => {
    const theme = createTheme({ colors: { accent: '#286143' } });
    const { container } = render(
      <TactileProvider theme={theme} id="scope" style={{ padding: 12 }}>
        <Reader />
      </TactileProvider>,
    );
    expect(container.querySelector('#scope')?.getAttribute('data-tactile-theme')).toBe('light');
    expect(
      container
        .querySelector<HTMLElement>('#scope')
        ?.style.getPropertyValue('--tactile-color-accent'),
    ).toBe('#286143');
    expect(container.querySelector<HTMLElement>('#scope')?.style.padding).toBe('12px');
    expect(themeToCSSVariables(theme)['--tactile-space-4']).toBe('16px');
  });
  it('renders a deterministic initial mode on the server', () => {
    expect(
      renderToString(
        <TactileProvider initialMode="dark">
          <Reader />
        </TactileProvider>,
      ),
    ).toContain('data-tactile-theme="dark"');
  });
  it('subscribes to system preference and cleans up the listener', () => {
    let onChange: (() => void) | undefined;
    const remove = vi.fn();
    const query = {
      matches: true,
      addEventListener: vi.fn((_event: string, callback: () => void) => {
        onChange = callback;
      }),
      removeEventListener: remove,
    };
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => query),
    );
    const { unmount } = render(
      <TactileProvider>
        <Reader />
      </TactileProvider>,
    );
    expect(screen.getByText('dark')).toBeTruthy();
    act(() => {
      query.matches = false;
      onChange?.();
    });
    expect(screen.getByText('light')).toBeTruthy();
    unmount();
    expect(remove).toHaveBeenCalledWith('change', onChange);
    vi.unstubAllGlobals();
  });
  it('hydrates the server fallback before applying the system appearance', async () => {
    const element = (
      <TactileProvider initialMode="light">
        <Reader />
      </TactileProvider>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(element);
    document.body.append(container);
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );
    const recoverable = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;
    try {
      await act(async () => {
        root = hydrateRoot(container, element, { onRecoverableError: recoverable });
      });
      expect(container.textContent).toBe('dark');
      expect(recoverable).not.toHaveBeenCalled();
    } finally {
      act(() => root?.unmount());
      container.remove();
      vi.unstubAllGlobals();
    }
  });
  it('supports independently nested themes', () => {
    render(
      <TactileProvider preference="light">
        <Reader />
        <TactileProvider preference="dark">
          <Reader />
        </TactileProvider>
      </TactileProvider>,
    );
    expect(screen.getByText('light')).toBeTruthy();
    expect(screen.getByText('dark')).toBeTruthy();
  });
  it('explains a missing provider', () => {
    const silence = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Reader />)).toThrow('within TactileProvider');
    silence.mockRestore();
  });
});
