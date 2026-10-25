import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, resolveColorMode } from '@tactile-ui/theme';
import type { Theme, ThemePreference } from '@tactile-ui/theme';

const ThemeContext = createContext<Theme | null>(null);
export interface TactileProviderProps {
  children: ReactNode;
  preference?: ThemePreference;
  theme?: Theme;
}
/** Context only: no wrapper View, Expo dependency, animation runtime, or native module. */
export function TactileProvider({ children, preference = 'system', theme }: TactileProviderProps) {
  const scheme = useColorScheme();
  const mode = resolveColorMode(preference, scheme === 'dark' ? 'dark' : 'light');
  const resolved = theme ?? (mode === 'dark' ? darkTheme : lightTheme);
  return <ThemeContext.Provider value={resolved}>{children}</ThemeContext.Provider>;
}
export function useTactileTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTactileTheme must be used within TactileProvider.');
  return theme;
}
