import { registerRootComponent } from 'expo';
import App from './App';
import { NativeLayoutChecks } from './NativeLayoutChecks';
registerRootComponent(
  process.env.EXPO_PUBLIC_NATIVE_LAYOUT_CHECKS === '1' ? NativeLayoutChecks : App,
);
