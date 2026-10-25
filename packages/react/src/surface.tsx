import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { resolveSurfaceRecipe } from '@tactile-ui/theme';
import type { SurfaceOptions, SurfaceRecipe } from '@tactile-ui/theme';
import { useTactileTheme } from './provider';

/** CSS lives with the adapter: no global stylesheet, browser reads, or injected styles required. */
export function surfaceToCSS(recipe: SurfaceRecipe): CSSProperties {
  const shadows = recipe.shadows.map(
    (shadow) => `0 ${shadow.offsetY}px ${shadow.blur}px rgb(0 0 0 / ${shadow.opacity})`,
  );
  return {
    color: recipe.foreground,
    backgroundColor: recipe.fill.middle,
    backgroundImage: `linear-gradient(180deg, ${recipe.fill.top}, ${recipe.fill.middle} 55%, ${recipe.fill.bottom})`,
    border: `1.5px solid ${recipe.edge}`,
    borderRadius: recipe.radius,
    boxShadow: [
      `inset 0 1.5px 1px ${recipe.highlight}`,
      ...(recipe.lip > 0
        ? [`inset 0 -${recipe.lip}px ${Math.max(1, recipe.lip / 2)}px ${recipe.shade}`]
        : []),
      ...shadows,
    ].join(', '),
    transform: `translateY(${recipe.translateY}px)`,
    opacity: recipe.opacity,
  };
}
export interface SurfaceProps extends HTMLAttributes<HTMLDivElement>, SurfaceOptions {}

/** Non-interactive material container. Does not invent a role, focus stop, gesture, or padding. */
export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
  { preset, state, radius, depth, style, ...props },
  ref,
) {
  const theme = useTactileTheme();
  const recipe = resolveSurfaceRecipe(theme, {
    ...(preset !== undefined ? { preset } : {}),
    ...(state !== undefined ? { state } : {}),
    ...(radius !== undefined ? { radius } : {}),
    ...(depth !== undefined ? { depth } : {}),
  });
  return (
    <div
      {...props}
      ref={ref}
      data-tactile-surface={recipe.preset}
      data-surface-state={recipe.state}
      style={{ ...surfaceToCSS(recipe), ...style }}
    />
  );
});
