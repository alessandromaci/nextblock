import { defineChain } from 'viem';
import { baseSepolia } from 'viem/chains';

/**
 * Local Anvil chain for development.
 * Default Anvil chain-id is 31337.
 */
export const anvil = defineChain({
  id: 31337,
  name: 'Anvil Local',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
  testnet: true,
});

/**
 * Supported chains for the app.
 * Anvil first for local dev, Base Sepolia for testnet deployment.
 */
export const supportedChains = [anvil, baseSepolia] as const;

/**
 * Default chain used when no wallet is connected.
 */
export const defaultChain = anvil;
