# @tactile-ui/tokens

Platform-neutral design tokens. No React, CSS, Expo, or React Native dependency.

```ts
import { tokens } from '@tactile-ui/tokens';
const gap = tokens.space[4]; // 16: CSS px or native dp
```

Exports `tokens` and `buttonSizes` plus `Tokens`, `SpaceToken`, `RadiusToken`, `DepthToken`, and `ButtonSize` types. Typography sizes are numeric; platform adapters choose units. Depth is a shared semantic model, not a guarantee of pixel-identical shadows. Treat tokens as immutable.

Name and npm scope are provisional. No package has been published.

## Shared Button sizes

```ts
import { buttonSizes } from '@tactile-ui/tokens';
import type { ButtonSize } from '@tactile-ui/tokens';

const size: ButtonSize = 'md';
const minimumHeight = buttonSizes[size].minHeight; // 56
```

Each size derives from the existing spacing, typography, and accessibility tokens. Fields are numeric CSS px/native dp, except `fontSize`, which web converts to rem and native uses as a scalable font size.

| Size | `minHeight` | `paddingX` | `gap` | `icon` | `fontSize` |
| ---- | ----------- | ---------- | ----- | ------ | ---------- |
| `sm` | 48          | 16         | 8     | 16     | 14         |
| `md` | 56          | 24         | 8     | 20     | 17         |
| `lg` | 64          | 32         | 12    | 24     | 24         |

These are content/host minimums; Surface borders add to visual dimensions, and wrapping or font scaling can increase height. Button uses the theme's full radius and medium weight. Material recipes remain in `@tactile-ui/theme`, rather than being duplicated in size tokens. See [the Button guide](../../docs/BUTTONS.md).
