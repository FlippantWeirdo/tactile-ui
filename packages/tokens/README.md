# @tactile-ui/tokens

Platform-neutral design tokens. No React, CSS, Expo, or React Native dependency.

```ts
import { tokens } from '@tactile-ui/tokens';
const gap = tokens.space[4]; // 16: CSS px or native dp
```

Exports `tokens` plus `Tokens`, `SpaceToken`, `RadiusToken`, and `DepthToken` types. Typography sizes are numeric; platform adapters choose units. Depth is a shared semantic model, not a guarantee of pixel-identical shadows. Treat tokens as immutable.

Name and npm scope are provisional. No package has been published.
