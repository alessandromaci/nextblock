// =============================================================================
// Contract ABIs -- Placeholder definitions matching the contract interfaces.
// Replace with real ABIs from Foundry `out/` directory after contract build.
// =============================================================================

export const VAULT_FACTORY_ABI = [
  {
    type: 'function',
    name: 'getVaults',
    inputs: [],
    outputs: [{ name: '', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getVaultCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isVault',
    inputs: [{ name: 'vault', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'createVault',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'vaultName', type: 'string' },
      { name: 'vaultManager', type: 'address' },
      { name: 'bufferRatioBps', type: 'uint256' },
      { name: 'managementFeeBps', type: 'uint256' },
    ],
    outputs: [{ name: 'vault', type: 'address' }],
    stateMutability: 'nonpayable',
  },
] as const;

export const INSURANCE_VAULT_ABI = [
  // ---- ERC-4626 standard views ----
  {
    type: 'function',
    name: 'totalAssets',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'maxWithdraw',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'maxRedeem',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'previewDeposit',
    inputs: [{ name: 'assets', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'previewWithdraw',
    inputs: [{ name: 'assets', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'convertToShares',
    inputs: [{ name: 'assets', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'convertToAssets',
    inputs: [{ name: 'shares', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'asset',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  // ---- Custom vault views ----
  {
    type: 'function',
    name: 'getVaultInfo',
    inputs: [],
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'manager', type: 'address' },
      { name: 'assets', type: 'uint256' },
      { name: 'shares', type: 'uint256' },
      { name: 'sharePrice', type: 'uint256' },
      { name: 'bufferBps', type: 'uint256' },
      { name: 'feeBps', type: 'uint256' },
      { name: 'availableBuffer', type: 'uint256' },
      { name: 'deployedCapital', type: 'uint256' },
      { name: 'policyCount', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPolicyIds',
    inputs: [],
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getVaultPolicy',
    inputs: [{ name: 'policyId', type: 'uint256' }],
    outputs: [
      { name: 'allocationWeight', type: 'uint256' },
      { name: 'premium', type: 'uint256' },
      { name: 'earnedPremium', type: 'uint256' },
      { name: 'coverage', type: 'uint256' },
      { name: 'duration', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
      { name: 'timeRemaining', type: 'uint256' },
      { name: 'claimed', type: 'bool' },
      { name: 'expired', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'vaultName',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'vaultManager',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'bufferRatioBps',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'managementFeeBps',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalPendingClaims',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalDeployedCapital',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  // ---- ERC-4626 writes ----
  {
    type: 'function',
    name: 'deposit',
    inputs: [
      { name: 'assets', type: 'uint256' },
      { name: 'receiver', type: 'address' },
    ],
    outputs: [{ name: 'shares', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdraw',
    inputs: [
      { name: 'assets', type: 'uint256' },
      { name: 'receiver', type: 'address' },
      { name: 'owner', type: 'address' },
    ],
    outputs: [{ name: 'shares', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  // ---- Claim triggers ----
  {
    type: 'function',
    name: 'checkClaim',
    inputs: [{ name: 'policyId', type: 'uint256' }],
    outputs: [{ name: 'receiptId', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'reportEvent',
    inputs: [{ name: 'policyId', type: 'uint256' }],
    outputs: [{ name: 'receiptId', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'submitClaim',
    inputs: [
      { name: 'policyId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: 'receiptId', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'exerciseClaim',
    inputs: [{ name: 'receiptId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  // ---- Events ----
  {
    type: 'event',
    name: 'ClaimTriggered',
    inputs: [
      { name: 'policyId', type: 'uint256', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'insurer', type: 'address', indexed: false },
      { name: 'receiptId', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'ClaimExercised',
    inputs: [
      { name: 'receiptId', type: 'uint256', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'insurer', type: 'address', indexed: false },
    ],
  },
] as const;

export const POLICY_REGISTRY_ABI = [
  {
    type: 'function',
    name: 'getPolicy',
    inputs: [{ name: 'policyId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'name', type: 'string' },
          { name: 'verificationType', type: 'uint8' },
          { name: 'coverageAmount', type: 'uint256' },
          { name: 'premiumAmount', type: 'uint256' },
          { name: 'duration', type: 'uint256' },
          { name: 'startTime', type: 'uint256' },
          { name: 'insurer', type: 'address' },
          { name: 'triggerThreshold', type: 'int256' },
          { name: 'status', type: 'uint8' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPolicyCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'currentTime',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'timeOffset',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'advanceTime',
    inputs: [{ name: 'secondsToAdd', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'TimeAdvanced',
    inputs: [
      { name: 'newTimestamp', type: 'uint256', indexed: false },
      { name: 'secondsAdded', type: 'uint256', indexed: false },
    ],
  },
] as const;

export const MOCK_USDC_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'mint',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

export const MOCK_ORACLE_ABI = [
  {
    type: 'function',
    name: 'btcPrice',
    inputs: [],
    outputs: [{ name: '', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'flightDelayed',
    inputs: [],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getBtcPrice',
    inputs: [],
    outputs: [
      { name: 'price', type: 'int256' },
      { name: 'updatedAt', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getFlightStatus',
    inputs: [],
    outputs: [
      { name: 'delayed', type: 'bool' },
      { name: 'updatedAt', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setBtcPrice',
    inputs: [{ name: 'price', type: 'int256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setFlightStatus',
    inputs: [{ name: 'delayed', type: 'bool' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

export const CLAIM_RECEIPT_ABI = [
  {
    type: 'function',
    name: 'getReceipt',
    inputs: [{ name: 'receiptId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'policyId', type: 'uint256' },
          { name: 'claimAmount', type: 'uint256' },
          { name: 'vault', type: 'address' },
          { name: 'insurer', type: 'address' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'exercised', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nextReceiptId',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

// =============================================================================
// Deployed contract addresses.
// Update these after deployment (forge script output).
// =============================================================================

export const ADDRESSES = {
  vaultFactory: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  policyRegistry: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  mockUSDC: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  mockOracle: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  claimReceipt: '0x0000000000000000000000000000000000000000' as `0x${string}`,
} as const;
