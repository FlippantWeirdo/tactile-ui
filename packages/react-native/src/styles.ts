import { StyleSheet } from 'react-native';
import type { Theme } from '@tactile-ui/theme';

/** Native primitives only. Each consumer decides how to apply surface and text roles. */
export function createNativeThemeStyles(theme: Theme) {
  return StyleSheet.create({
    canvas: { flex: 1, backgroundColor: theme.colors.canvas },
    surface: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md },
    text: { color: theme.colors.text, fontSize: theme.typography.size.body },
    textMuted: { color: theme.colors.textMuted, fontSize: theme.typography.size.label },
    raised: {
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: theme.depth.raised.offsetY },
      shadowOpacity: theme.depth.raised.opacity,
      shadowRadius: theme.depth.raised.blur / 2,
      elevation: theme.depth.raised.elevation,
    },
  });
}
