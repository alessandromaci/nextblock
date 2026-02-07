import { baseSepolia as baseSepoliaChain } from "viem/chains";

export const baseSepolia = baseSepoliaChain;

/**
 * Supported chains for the app.
 */
export const supportedChains = [baseSepoliaChain] as const;

/**
 * Default chain used when no wallet is connected.
 */
export const defaultChain = baseSepoliaChain;
