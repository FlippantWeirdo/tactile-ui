import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  TactileProvider,
  createNativeThemeStyles,
  useTactileTheme,
} from '@tactile-ui/react-native';
import { createTheme } from '@tactile-ui/theme';
import type { ThemePreference } from '@tactile-ui/theme';
import { tokens } from '@tactile-ui/tokens';

export default function App() {
  const [preference, setPreference] = useState<ThemePreference>('system');
  return (
    <SafeAreaProvider>
      <TactileProvider preference={preference}>
        <Showcase preference={preference} onPreferenceChange={setPreference} />
      </TactileProvider>
    </SafeAreaProvider>
  );
}
function Showcase({
  preference,
  onPreferenceChange,
}: {
  preference: ThemePreference;
  onPreferenceChange: (value: ThemePreference) => void;
}) {
  const theme = useTactileTheme();
  const themed = useMemo(() => createNativeThemeStyles(theme), [theme]);
  const [forest, setForest] = useState(false);
  const preview = useMemo(
    () =>
      createTheme({
        mode: theme.mode,
        ...(forest
          ? {
              colors: {
                accent: theme.mode === 'dark' ? '#a4d7b1' : '#286143',
                onAccent: theme.mode === 'dark' ? '#181c18' : '#ffffff',
              },
            }
          : {}),
      }),
    [theme.mode, forest],
  );
  return (
    <SafeAreaView style={themed.canvas}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={[themed.text, styles.title]}>
          Tactile UI
        </Text>
        <Text style={[themed.textMuted, styles.subtitle]}>Native foundations</Text>
        <Text style={[themed.text, styles.body]}>
          Shared tokens and themes, rendered with native views. This showcase contains no catalog
          components yet.
        </Text>
        <View style={[styles.rule, { backgroundColor: theme.colors.border }]} />
        <Text accessibilityRole="header" style={[themed.text, styles.heading]}>
          Appearance
        </Text>
        <View style={styles.setting}>
          <Text style={[themed.text, styles.settingLabel]}>Follow system</Text>
          <Switch
            hitSlop={8}
            accessibilityLabel="Follow system appearance"
            value={preference === 'system'}
            onValueChange={(value) => onPreferenceChange(value ? 'system' : theme.mode)}
          />
        </View>
        <View style={styles.setting}>
          <Text style={[themed.text, styles.settingLabel]}>Dark theme</Text>
          <Switch
            hitSlop={8}
            accessibilityLabel="Dark theme"
            disabled={preference === 'system'}
            value={theme.mode === 'dark'}
            onValueChange={(value) => onPreferenceChange(value ? 'dark' : 'light')}
          />
        </View>
        <Text style={themed.textMuted}>Turn off “Follow system” to choose the theme manually.</Text>
        <View style={styles.setting}>
          <Text style={[themed.text, styles.settingLabel]}>Forest accent preview</Text>
          <Switch
            hitSlop={8}
            accessibilityLabel="Forest accent preview"
            value={forest}
            onValueChange={setForest}
          />
        </View>
        <View style={[styles.material, themed.surface, themed.raised]}>
          <Text style={[themed.text, styles.heading]}>Native material study</Text>
          <Text style={[themed.textMuted, styles.body]}>
            A View with platform shadow and elevation. Inset shadows and advanced materials are
            reserved for optional rendering packages.
          </Text>
          <View style={[styles.accent, { backgroundColor: preview.colors.accent }]}>
            <Text style={{ color: preview.colors.onAccent }}>Accent / {preview.colors.accent}</Text>
          </View>
        </View>
        <Text accessibilityRole="header" style={[themed.text, styles.heading]}>
          Semantic colors
        </Text>
        {(['canvas', 'surface', 'text', 'accent', 'border'] as const).map((role) => (
          <View key={role} style={styles.tokenRow}>
            <View
              accessible={false}
              style={[
                styles.swatch,
                { backgroundColor: preview.colors[role], borderColor: theme.colors.border },
              ]}
            />
            <Text style={[themed.text, styles.settingLabel]}>{role}</Text>
            <Text style={themed.textMuted}>{preview.colors[role]}</Text>
          </View>
        ))}
        <Text style={[themed.textMuted, styles.footer]}>
          Phase 1 · Expo-first · npm packages first{'\n'}Name and scope are provisional.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  content: {
    padding: tokens.space[6],
    paddingBottom: tokens.space[12],
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: tokens.typography.size.heading,
    fontWeight: tokens.typography.weight.semibold,
    marginTop: tokens.space[4],
  },
  subtitle: { marginTop: tokens.space[2], marginBottom: tokens.space[6] },
  body: { lineHeight: 26, marginTop: tokens.space[3] },
  heading: {
    fontSize: tokens.typography.size.title,
    fontWeight: tokens.typography.weight.semibold,
    marginBottom: tokens.space[2],
  },
  rule: { height: StyleSheet.hairlineWidth, marginVertical: tokens.space[8] },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.space[4],
    minHeight: tokens.accessibility.minTouchTarget,
    marginVertical: tokens.space[2],
  },
  settingLabel: { flex: 1, flexShrink: 1 },
  material: { padding: tokens.space[6], marginVertical: tokens.space[8] },
  accent: { padding: tokens.space[4], borderRadius: tokens.radius.sm, marginTop: tokens.space[4] },
  tokenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.space[3],
    paddingVertical: tokens.space[3],
  },
  swatch: {
    width: 32,
    height: 32,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: tokens.radius.sm,
  },
  footer: { marginTop: tokens.space[8], lineHeight: 22 },
});
