import { useState } from 'react';
import { Image, StyleSheet, Switch, Text, View, Button as NativeButton } from 'react-native';
import { Surface, useTactileTheme, resolveSurfaceRecipe } from '@tactile-ui/react-native';
import type { SurfacePreset, SurfaceState } from '@tactile-ui/react-native';

export function SurfaceLab() {
  const theme = useTactileTheme();
  const [preset, setPreset] = useState<SurfacePreset>('polished');
  const [state, setState] = useState<SurfaceState>('rest');
  const [depth, setDepth] = useState(1);
  const [pill, setPill] = useState(true);
  const recipe = resolveSurfaceRecipe(theme, {
    preset,
    state,
    depth,
    radius: pill ? 'full' : 'lg',
  });
  const text = { color: theme.colors.text, fontSize: theme.typography.size.body };
  return (
    <View style={styles.lab}>
      <Text accessibilityRole="header" style={[text, styles.heading]}>
        Surface Lab
      </Text>
      <Text style={text}>
        Polished charcoal and white porcelain. Native views approximate the reference light and
        edge.
      </Text>
      <View style={styles.setting}>
        <Text style={[text, styles.label]}>Porcelain material</Text>
        <Switch
          accessibilityLabel="Porcelain material"
          value={preset === 'porcelain'}
          onValueChange={(value) => setPreset(value ? 'porcelain' : 'polished')}
        />
      </View>
      <View style={styles.setting}>
        <Text style={[text, styles.label]}>Pill radius</Text>
        <Switch accessibilityLabel="Pill radius" value={pill} onValueChange={setPill} />
      </View>
      <Text style={text}>Visual state: {state}</Text>
      <View style={styles.actions}>
        {(['rest', 'hovered', 'pressed', 'disabled'] as const).map((value) => (
          <NativeButton
            key={value}
            title={value}
            accessibilityLabel={`Preview ${value} state`}
            onPress={() => setState(value)}
            disabled={state === value}
            color={theme.colors.accent}
          />
        ))}
      </View>
      <View style={styles.setting}>
        <Text style={[text, styles.label]}>Depth: {depth.toFixed(2)}×</Text>
        <NativeButton
          title="Less"
          disabled={depth <= 0}
          onPress={() => setDepth(Math.max(0, depth - 0.25))}
        />
        <NativeButton
          title="More"
          disabled={depth >= 2}
          onPress={() => setDepth(Math.min(2, depth + 0.25))}
        />
      </View>
      <View style={[styles.stage, { backgroundColor: theme.colors.surface }]}>
        <Surface preset={preset} state={state} depth={depth} radius={pill ? 'full' : 'lg'}>
          <Text style={[styles.specimen, { color: recipe.foreground }]}>A tactile surface</Text>
        </Surface>
      </View>
      <Text style={[text, styles.note]}>
        Static material study; no click action. The disabled preview changes appearance only.
      </Text>
      <Text accessibilityRole="header" style={[text, styles.heading]}>
        Original reference
      </Text>
      <Image
        // Metro requires a static asset require; kept inside the app.
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require('../../references/primary-button-reference.png')}
        accessibilityLabel="Reference charcoal and white pill buttons"
        style={styles.reference}
        resizeMode="contain"
      />
      <Text style={text}>Native reconstruction</Text>
      <View style={styles.reconstruction}>
        {(['polished', 'porcelain'] as const).map((material) => (
          <Surface
            key={material}
            preset={material}
            state={state}
            depth={depth}
            radius={pill ? 'full' : 'lg'}
          >
            <Text
              style={[
                styles.specimen,
                { color: resolveSurfaceRecipe(theme, { preset: material }).foreground },
              ]}
            >
              {material === 'polished' ? 'Download Resume' : 'More About Me'}
            </Text>
          </Surface>
        ))}
      </View>
      <Text accessibilityRole="header" style={[text, styles.heading]}>
        Across dimensions
      </Text>
      <Text style={text}>Small, medium, large, and custom-width containers on a white canvas.</Text>
      <View style={styles.reconstruction}>
        {(['polished', 'porcelain'] as const).map((material) => (
          <View key={material} style={{ width: '100%', alignItems: 'center', gap: 24 }}>
            {[
              { name: 'Small', width: 160, height: 40 },
              { name: 'Medium', width: 240, height: 56 },
              { name: 'Large', width: 320, height: 80 },
              { name: 'Custom width', width: 400, height: 56 },
            ].map(({ name, width, height }) => (
              <Surface
                key={name}
                preset={material}
                state={state}
                depth={depth}
                radius={pill ? 'full' : 'lg'}
                style={{ width, maxWidth: '100%' }}
              >
                <View style={{ minHeight: height, justifyContent: 'center' }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '400',
                      textAlign: 'center',
                      color: resolveSurfaceRecipe(theme, { preset: material }).foreground,
                    }}
                  >
                    {name}
                  </Text>
                </View>
              </Surface>
            ))}
          </View>
        ))}
      </View>
      <NativeButton
        title="Reset calibration"
        onPress={() => {
          setPreset('polished');
          setState('rest');
          setDepth(1);
          setPill(true);
        }}
      />
      <Text style={[text, styles.note]}>
        24 clipped fill bands, solid rim layers, iOS shadows and Android elevation. No inset blur,
        continuous gradient, or warm medallion parity is claimed. No advanced renderer is required.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  lab: { marginVertical: 32, gap: 16 },
  heading: { fontSize: 24, fontWeight: '600', marginTop: 8 },
  setting: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 16, minHeight: 48 },
  label: { flex: 1, flexShrink: 1 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  stage: { paddingVertical: 48, paddingHorizontal: 12, alignItems: 'center', borderRadius: 12 },
  specimen: {
    fontSize: 22,
    fontWeight: '500',
    paddingHorizontal: 24,
    paddingTop: 17,
    paddingBottom: 21,
    textAlign: 'center',
  },
  reference: { width: '100%', aspectRatio: 916 / 166, backgroundColor: '#ffffff' },
  reconstruction: { alignItems: 'center', gap: 24, backgroundColor: '#ffffff', padding: 24 },
  note: { fontSize: 14, lineHeight: 22 },
});
