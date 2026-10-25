import type { CSSProperties } from 'react';
import type { Theme } from '@tactile-ui/theme';

export type ThemeCSSVariables = CSSProperties & Record<`--tactile-${string}`, string | number>;
const kebab = (value: string) => value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

/** Pure, SSR-safe mapping. Consumers choose the scope of the returned variables. */
export function themeToCSSVariables(theme: Theme): ThemeCSSVariables {
  const variables: ThemeCSSVariables = { colorScheme: theme.mode };
  for (const [name, value] of Object.entries(theme.colors))
    variables[`--tactile-color-${kebab(name)}`] = value;
  for (const [name, value] of Object.entries(theme.space))
    variables[`--tactile-space-${name}`] = `${value}px`;
  for (const [name, value] of Object.entries(theme.radius))
    variables[`--tactile-radius-${name}`] = `${value}px`;
  for (const [name, value] of Object.entries(theme.typography.size))
    variables[`--tactile-font-${name}`] = `${value / 16}rem`;
  for (const [name, value] of Object.entries(theme.motion.duration))
    variables[`--tactile-duration-${name}`] = `${value}ms`;
  return variables;
}
