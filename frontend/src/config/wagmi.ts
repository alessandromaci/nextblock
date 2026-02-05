'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { anvil, baseSepolia } from './chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'NextBlock',
  projectId: 'nextblock-hackathon-prototype',
  chains: [anvil, baseSepolia],
  ssr: true,
});
