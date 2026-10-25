import type { Metadata } from 'next';
import { ButtonLab } from './button-lab';
export const metadata: Metadata = { title: 'Button Lab — Tactile UI' };
export default function Page() {
  return <ButtonLab />;
}
