import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { LayoutChangeEvent, ViewInstance } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button, Surface, TactileProvider } from '@tactile-ui/react-native';

interface Measurement {
  width: number;
  height: number;
  pass: boolean;
}
const names = [
  'intrinsic polished',
  'intrinsic porcelain',
  'fixed height',
  'minimum height',
  'flex height',
  'finite radius',
  'custom width',
  'wrapped text',
  'polished sm',
  'polished md',
  'polished lg',
  'porcelain sm',
  'porcelain md',
  'porcelain lg',
  'full width',
  'loading baseline',
  'loading stable',
];
/** Native integration harness: measurements come from Yoga/onLayout and native refs, never DOM mocks. */
export function NativeLayoutChecks() {
  const [results, setResults] = useState<Record<string, Measurement>>({});
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef<ViewInstance>(null);
  const record = (name: string, width: number, height: number, pass: boolean) =>
    setResults((previous) => {
      const old = previous[name];
      if (
        old &&
        Math.abs(old.width - width) < 0.01 &&
        Math.abs(old.height - height) < 0.01 &&
        old.pass === pass
      )
        return previous;
      return { ...previous, [name]: { width, height, pass } };
    });
  const measure = (name: string, height: number, width?: number) => (event: LayoutChangeEvent) => {
    const frame = event.nativeEvent.layout;
    record(
      name,
      frame.width,
      frame.height,
      Math.abs(frame.height - height) < 0.5 &&
        (width === undefined || Math.abs(frame.width - width) < 0.5),
    );
  };
  useEffect(() => {
    if (loading || !results['loading baseline']) return;
    const frame = requestAnimationFrame(() => setLoading(true));
    return () => cancelAnimationFrame(frame);
  }, [loading, results]);
  useEffect(() => {
    if (!loading) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        loadingRef.current?.measure((_x, _y, width, height) => {
          const before = results['loading baseline'];
          if (before)
            record(
              'loading stable',
              width,
              height,
              Math.abs(width - before.width) < 0.5 && Math.abs(height - before.height) < 0.5,
            );
        });
      });
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
    // The initial baseline is immutable once loading starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
  const complete = names.every((name) => results[name]);
  const failed = names.filter((name) => results[name] && !results[name].pass);
  useEffect(() => {
    const url = process.env.EXPO_PUBLIC_NATIVE_LAYOUT_REPORT_URL;
    if (!url || !complete) return;
    void fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nativeLayoutChecks: { total: names.length, failed, results } }),
    }).catch(() => {});
  }, [complete, results, failed]);
  const row = (name: string, content: React.ReactNode) => (
    <View key={name} style={{ gap: 10, paddingVertical: 14 }}>
      <Text style={{ fontSize: 16, color: '#252820' }}>
        {name}:{' '}
        {results[name]
          ? `${results[name].pass ? 'PASS' : 'FAIL'} ${results[name].width.toFixed(1)} × ${results[name].height.toFixed(1)}`
          : 'measuring'}
      </Text>
      {content}
    </View>
  );
  const block = <View style={{ width: 120, height: 32 }} />;
  return (
    <SafeAreaProvider>
      <TactileProvider preference="light">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f3ed' }}>
          <View style={{ padding: 24, borderBottomWidth: 1, borderColor: '#d1d1c5' }}>
            <Text
              accessibilityRole="header"
              style={{ fontSize: 24, fontWeight: '600', color: '#252820' }}
            >
              Native layout regression
            </Text>
            <Text
              testID="native-layout-result"
              style={{ fontSize: 17, color: failed.length ? '#a12430' : '#286143' }}
            >
              {complete
                ? failed.length
                  ? `${failed.length} checks failed`
                  : `All ${names.length} checks passed`
                : `${Object.keys(results).length} / ${names.length} measured`}
            </Text>
          </View>
          <ScrollView contentContainerStyle={{ padding: 24, gap: 8 }}>
            {row(
              'intrinsic polished',
              <Surface
                onLayout={measure('intrinsic polished', 35, 123)}
                style={{ alignSelf: 'flex-start' }}
              >
                {block}
              </Surface>,
            )}
            {row(
              'intrinsic porcelain',
              <Surface
                preset="porcelain"
                onLayout={measure('intrinsic porcelain', 35, 123)}
                style={{ alignSelf: 'flex-start' }}
              >
                {block}
              </Surface>,
            )}
            {row(
              'fixed height',
              <Surface
                preset="porcelain"
                style={{ width: 240, height: 96 }}
                onLayout={measure('fixed height', 96, 240)}
              >
                <Text style={{ padding: 12 }}>Fixed 96</Text>
              </Surface>,
            )}
            {row(
              'minimum height',
              <Surface
                style={{ width: 240, minHeight: 96 }}
                onLayout={measure('minimum height', 96, 240)}
              >
                {block}
              </Surface>,
            )}
            {row(
              'flex height',
              <View style={{ width: 240, height: 96 }}>
                <Surface style={{ flex: 1 }} onLayout={measure('flex height', 96, 240)}>
                  {block}
                </Surface>
              </View>,
            )}
            {row(
              'finite radius',
              <Surface
                radius={16}
                style={{ alignSelf: 'flex-start' }}
                onLayout={measure('finite radius', 35, 123)}
              >
                {block}
              </Surface>,
            )}
            {row(
              'custom width',
              <Surface style={{ width: 300 }} onLayout={measure('custom width', 35, 300)}>
                {block}
              </Surface>,
            )}
            {row(
              'wrapped text',
              <Surface
                preset="porcelain"
                style={{ width: 180 }}
                onLayout={(event) => {
                  const { width, height } = event.nativeEvent.layout;
                  record('wrapped text', width, height, height > 50 && height < 220);
                }}
              >
                <Text style={{ fontSize: 17, lineHeight: 24, padding: 12 }}>
                  A wrapped label must size the container naturally without stretching the page.
                </Text>
              </Surface>,
            )}
            {(['polished', 'porcelain'] as const).flatMap((variant) =>
              (['sm', 'md', 'lg'] as const).map((size, index) =>
                row(
                  `${variant} ${size}`,
                  <Button
                    variant={variant}
                    size={size}
                    onLayout={measure(`${variant} ${size}`, [51, 59, 67][index]!)}
                  >
                    Continue
                  </Button>,
                ),
              ),
            )}
            {row(
              'full width',
              <View style={{ width: 300 }}>
                <Button fullWidth onLayout={measure('full width', 59, 300)}>
                  Continue
                </Button>
              </View>,
            )}
            {row(
              'loading baseline',
              <Button
                ref={loadingRef}
                loading={loading}
                leadingIcon={<View style={{ width: 20, height: 20 }} />}
                onLayout={!loading ? measure('loading baseline', 59) : undefined}
              >
                Save changes
              </Button>,
            )}
            <Text style={{ fontSize: 14, color: '#606257' }}>
              Run this screen on a real native host. A mocked View test cannot verify these
              measurements.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </TactileProvider>
    </SafeAreaProvider>
  );
}
