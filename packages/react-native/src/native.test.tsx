// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTheme } from '@tactile-ui/theme';
const native = vi.hoisted(() => ({ scheme: 'dark' as 'light' | 'dark' | null }));
// Focused adapter tests. Real native rendering is exercised by Metro export, not this mock.
vi.mock('react-native', () => ({
  useColorScheme: () => native.scheme,
  StyleSheet: { create: <T,>(styles: T) => styles },
}));
import { TactileProvider, useTactileTheme } from './provider';
import { createNativeThemeStyles } from './styles';
afterEach(() => {
  cleanup();
  native.scheme = 'dark';
});
function Reader() {
  const theme = useTactileTheme();
  return (
    <span>
      {theme.mode}/{theme.colors.accent}
    </span>
  );
}
describe('native adapter', () => {
  it('follows the device and explicit preferences without a wrapper View', () => {
    const { container, rerender } = render(
      <TactileProvider>
        <Reader />
      </TactileProvider>,
    );
    expect(container.firstElementChild?.tagName).toBe('SPAN');
    expect(screen.getByText(/^dark\//)).toBeTruthy();
    rerender(
      <TactileProvider preference="light">
        <Reader />
      </TactileProvider>,
    );
    expect(screen.getByText(/^light\//)).toBeTruthy();
  });
  it('uses a light fallback when the device has no preference', () => {
    native.scheme = null;
    render(
      <TactileProvider>
        <Reader />
      </TactileProvider>,
    );
    expect(screen.getByText(/^light\//)).toBeTruthy();
  });
  it('gives a custom theme priority and maps native shadow/elevation separately', () => {
    const theme = createTheme({ mode: 'light', colors: { accent: '#286143' } });
    render(
      <TactileProvider theme={theme}>
        <Reader />
      </TactileProvider>,
    );
    expect(screen.getByText('light/#286143')).toBeTruthy();
    const styles = createNativeThemeStyles(theme);
    expect(styles.text.color).toBe(theme.colors.text);
    expect(styles.raised.shadowOffset.height).toBeGreaterThan(0);
    expect(styles.raised.elevation).toBe(theme.depth.raised.elevation);
    expect(styles.raised.shadowRadius).toBe(theme.depth.raised.blur / 2);
  });
  it('explains a missing provider', () => {
    const silence = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Reader />)).toThrow('within TactileProvider');
    silence.mockRestore();
  });
});
