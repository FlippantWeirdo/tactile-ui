import { createContext, useContext, useSyncExternalStore } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { darkTheme, lightTheme, resolveColorMode } from '@tactile-ui/theme';
import type { ColorMode, Theme, ThemePreference } from '@tactile-ui/theme';
import { themeToCSSVariables } from './styles';

const ThemeContext = createContext<Theme | null>(null);
const noSubscription = () => () => {};
function readAppearance(): ColorMode {
  return typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}
function subscribeToAppearance(onChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {};
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
export interface TactileProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  preference?: ThemePreference;
  /** Server and first client render use the same mode to avoid hydration mismatches. */
  initialMode?: ColorMode;
  theme?: Theme;
}

export function TactileProvider({
  children,
  preference = 'system',
  initialMode = 'light',
  theme,
  style,
  ...rest
}: TactileProviderProps) {
  const followSystem = preference === 'system' && !theme;
  const systemMode = useSyncExternalStore(
    followSystem ? subscribeToAppearance : noSubscription,
    readAppearance,
    () => initialMode,
  );
  const mode = resolveColorMode(preference, systemMode);
  const resolved = theme ?? (mode === 'dark' ? darkTheme : lightTheme);
  return (
    <ThemeContext.Provider value={resolved}>
      <div
        {...rest}
        data-tactile-theme={resolved.mode}
        style={{ ...themeToCSSVariables(resolved), ...style }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTactileTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTactileTheme must be used within TactileProvider.');
  return theme;
}
