---
'@tactile-ui/react-native': patch
---

Fix native Surface and Button height inflation in scrolling layouts by keeping decorative material and shadow layers out of content measurement. Preserve explicit, minimum and flex dimensions; content owns overflow while material decoration remains clipped.
