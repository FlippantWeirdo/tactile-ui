const { getDefaultConfig } = require('expo/metro-config');
// Expo handles pnpm workspaces automatically. Keep platform resolution at its defaults.
module.exports = getDefaultConfig(__dirname);
