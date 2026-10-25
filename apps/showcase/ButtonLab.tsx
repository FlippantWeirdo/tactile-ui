import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Button, useTactileTheme } from '@tactile-ui/react-native';
import type { ButtonSize } from '@tactile-ui/react-native';
function Arrow({ color }: { color: string }) {
  return (
    <View accessible={false} style={{ width: 24, height: 24 }}>
      <View
        style={{
          position: 'absolute',
          width: 21,
          height: 2,
          backgroundColor: color,
          left: 1,
          top: 12,
          transform: [{ rotate: '-45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 13,
          height: 13,
          borderTopWidth: 2,
          borderRightWidth: 2,
          borderColor: color,
          top: 3,
          right: 3,
        }}
      />
    </View>
  );
}
function WarmAccent() {
  const colors = [
    '#ffdf71',
    '#ffd561',
    '#ffca4e',
    '#ffc151',
    '#ffb655',
    '#fca568',
    '#f38e89',
    '#ec79a5',
  ];
  return (
    <View
      accessible={false}
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={StyleSheet.absoluteFill}>
        {colors.map((color, i) => (
          <View
            key={color}
            style={{
              backgroundColor: color,
              height: 6.1,
              position: 'absolute',
              top: i * 6,
              left: 0,
              right: 0,
            }}
          />
        ))}
      </View>
      <Arrow color="#1d1b18" />
    </View>
  );
}
export function ButtonLab() {
  const theme = useTactileTheme();
  const text = { color: theme.colors.text, fontSize: theme.typography.size.body };
  const [porcelain, setPorcelain] = useState(false);
  const [size, setSize] = useState<ButtonSize>('md');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!saving) return;
    const timer = setTimeout(() => setSaving(false), 1500);
    return () => clearTimeout(timer);
  }, [saving]);
  const activate = () => setClicks((c) => c + 1);
  return (
    <View style={styles.lab}>
      <Text accessibilityRole="header" style={[text, styles.heading]}>
        Button Lab
      </Text>
      <Text style={text}>
        Real presses, the approved surfaces, and scalable system text. Appearance follows the
        controls above.
      </Text>
      {[
        { label: 'Porcelain variant', value: porcelain, set: setPorcelain },
        { label: 'Disabled', value: disabled, set: setDisabled },
        { label: 'Loading', value: loading, set: setLoading },
        { label: 'Full width', value: fullWidth, set: setFullWidth },
      ].map((s) => (
        <View key={s.label} style={styles.setting}>
          <Text style={[text, { flex: 1 }]}>{s.label}</Text>
          <Switch accessibilityLabel={s.label} value={s.value} onValueChange={s.set} />
        </View>
      ))}
      <View style={styles.row}>
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <Button
            key={s}
            size="sm"
            variant="porcelain"
            accessibilityState={{ selected: size === s }}
            onPress={() => setSize(s)}
          >
            {s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}
          </Button>
        ))}
      </View>
      <Button
        variant={porcelain ? 'porcelain' : 'polished'}
        size={size}
        disabled={disabled}
        loading={loading}
        fullWidth={fullWidth}
        onPress={activate}
      >
        Continue
      </Button>
      <Text accessibilityLiveRegion="polite" style={text}>
        Activated {clicks} times.
      </Text>
      {(['polished', 'porcelain'] as const).map((material) => (
        <View key={material} style={{ gap: 20 }}>
          <Text style={text}>{material}</Text>
          <View style={styles.row}>
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <Button key={s} variant={material} size={s} onPress={activate}>
                {s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}
              </Button>
            ))}
          </View>
          <View style={styles.row}>
            <Button variant={material} disabled>
              Unavailable
            </Button>
            <Button variant={material} loading>
              Saving changes
            </Button>
          </View>
          <View style={styles.row}>
            <Button
              variant={material}
              leadingIcon={<Arrow color={material === 'polished' ? '#fff' : '#18191b'} />}
              onPress={activate}
            >
              Open
            </Button>
            <Button
              variant={material}
              trailingIcon={<Arrow color={material === 'polished' ? '#fff' : '#18191b'} />}
              onPress={activate}
            >
              Explore
            </Button>
          </View>
        </View>
      ))}
      <Button fullWidth variant="porcelain" onPress={activate}>
        Continue to the next step
      </Button>
      <Button loading={saving} onPress={() => setSaving(true)}>
        Save changes
      </Button>
      <Text accessibilityLiveRegion="polite" style={text}>
        {saving ? 'Saving…' : 'Ready to save.'}
      </Text>
      <Text accessibilityRole="header" style={[text, styles.heading]}>
        Optional accent
      </Text>
      <Button size="lg" trailingIcon={<WarmAccent />} onPress={activate}>
        Download Resume
      </Button>
      <Text style={[text, styles.note]}>
        Native Views approximate the optional warm gradient in eight bands. Reduce Motion uses
        instant press translation and a static loading indicator.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  lab: { marginVertical: 32, gap: 20 },
  heading: { fontSize: 24, fontWeight: '600' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'center' },
  setting: { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 48 },
  note: { fontSize: 14, lineHeight: 22 },
});
