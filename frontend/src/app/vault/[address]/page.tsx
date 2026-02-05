'use client';

import { use } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useVaultInfo, useUserShares, useMaxWithdraw } from '@/hooks/useVaultData';
import { useVaultPolicies } from '@/hooks/useVaultPolicies';
import { useCurrentTime } from '@/hooks/usePolicyRegistry';
import { PolicyRow } from '@/components/vault/PolicyRow';
import { AllocationBar } from '@/components/vault/AllocationBar';
import { BufferVisualization } from '@/components/vault/BufferVisualization';
import { YieldTicker } from '@/components/vault/YieldTicker';
import { DepositSidebar } from '@/components/deposit/DepositSidebar';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import {
  formatUSDC,
  formatFeeBps,
  formatBufferRatio,
  shortenAddress,
  getSharePriceNumber,
} from '@/lib/formatting';

// Static display metadata
const VAULT_DISPLAY: Record<string, {
  manager: string;
  strategy: string;
  riskLevel: string;
  targetApy: string;
}> = {
  'Balanced Core': {
    manager: 'NextBlock Core Team',
    strategy: 'Full-spectrum insurance diversification, steady yield',
    riskLevel: 'Moderate',
    targetApy: '8-12%',
  },
  'DeFi Alpha': {
    manager: 'AlphaRe Capital',
    strategy: 'Only automated claims. No human in the loop.',
    riskLevel: 'Higher',
    targetApy: '10-14%',
  },
};

function getVaultDisplay(name: string) {
  for (const [key, value] of Object.entries(VAULT_DISPLAY)) {
    if (name.includes(key)) return value;
  }
  return {
    manager: 'Vault Manager',
    strategy: 'Custom strategy',
    riskLevel: 'Moderate',
    targetApy: '8-14%',
  };
}

export default function VaultDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const resolvedParams = use(params);
  const vaultAddress = resolvedParams.address as `0x${string}`;
  const { address: userAddress, isConnected } = useAccount();

  const { data: vaultInfo, isLoading: vaultLoading } = useVaultInfo(vaultAddress);
  const { policies, isLoading: policiesLoading } = useVaultPolicies(vaultAddress);
  const { data: currentTime } = useCurrentTime();
  const { data: userShares } = useUserShares(vaultAddress, userAddress);
  const { data: maxWithdraw } = useMaxWithdraw(vaultAddress, userAddress);

  if (vaultLoading) {
    return <VaultDetailSkeleton />;
  }

  if (!vaultInfo) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">Vault not found</h1>
          <p className="mt-2 text-sm text-gray-500">
            Could not load vault at address {shortenAddress(vaultAddress)}
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Back to vaults
          </Link>
        </div>
      </div>
    );
  }

  const [name, manager, assets, shares, , bufferBps, feeBps, availableBuffer, deployedCapital, policyCount] =
    vaultInfo as unknown as [string, `0x${string}`, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint];

  const display = getVaultDisplay(name);
  const sharePrice = getSharePriceNumber(assets, shares);
  const hasPosition = userShares !== undefined && userShares > 0n;
  const userValue = hasPosition && userShares
    ? Number(userShares) * sharePrice / 1e18
    : 0;

  // Pending claims: totalAssets is already net, but we need the raw pending for display
  // We do not have a direct read for totalPendingClaims in getVaultInfo output,
  // so we approximate or set to 0. The BufferVisualization uses raw values.
  // For now, infer from the data available.
  const pendingClaims = 0n; // Will be replaced when we add the dedicated read

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          Vaults
        </Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-900">{name}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: vault details (2/3 width) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Vault header */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Managed by{' '}
                  <span className="font-medium text-gray-700">
                    {display.manager}
                  </span>
                </p>
                <p className="mt-1 text-sm italic text-gray-400">
                  &quot;{display.strategy}&quot;
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Target APY
                </p>
                <p className="font-mono-num text-2xl font-bold text-gray-900">
                  {display.targetApy}
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-6 grid grid-cols-4 gap-4 border-t border-gray-100 pt-4">
              <div>
                <p className="text-xs text-gray-400">TVL</p>
                <p className="font-mono-num text-sm font-semibold text-gray-900">
                  {formatUSDC(assets)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Share Price</p>
                <p className="font-mono-num text-sm font-semibold text-gray-900">
                  ${sharePrice.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Mgmt Fee</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatFeeBps(feeBps)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Buffer Ratio</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatBufferRatio(bufferBps)}
                </p>
              </div>
            </div>
          </div>

          {/* NAV Ticker */}
          <YieldTicker totalAssets={assets} totalSupply={shares} />

          {/* User position */}
          {isConnected && hasPosition && userShares && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <h3 className="mb-2 text-sm font-medium text-blue-800">
                Your Position
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-blue-600">Shares</p>
                  <p className="font-mono-num text-sm font-semibold text-blue-900">
                    {(Number(userShares) / 1e18).toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Value</p>
                  <p className="font-mono-num text-sm font-semibold text-blue-900">
                    ${userValue.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Max Withdraw</p>
                  <p className="font-mono-num text-sm font-semibold text-blue-900">
                    {maxWithdraw !== undefined ? formatUSDC(maxWithdraw) : '--'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Allocation bar */}
          {policies.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <AllocationBar policies={policies} />
            </div>
          )}

          {/* Buffer visualization */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <BufferVisualization
              totalAssets={assets}
              deployedCapital={deployedCapital}
              availableBuffer={availableBuffer}
              pendingClaims={pendingClaims}
              bufferBps={bufferBps}
            />
          </div>

          {/* Policy table */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                Policies ({Number(policyCount)})
              </h3>
              <div className="flex items-center gap-2">
                {policies.map((p) => (
                  <VerificationBadge
                    key={Number(p.policyId)}
                    type={p.global.verificationType}
                  />
                ))}
              </div>
            </div>

            {policiesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-lg bg-gray-50"
                  />
                ))}
              </div>
            ) : policies.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                No policies in this vault.
              </p>
            ) : (
              <div className="space-y-3">
                {policies.map((policy) => (
                  <PolicyRow
                    key={Number(policy.policyId)}
                    policy={policy}
                    currentTime={currentTime ?? 0n}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: deposit/withdraw sidebar (1/3 width) */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <DepositSidebar
            vaultAddress={vaultAddress}
            totalAssets={assets}
            totalSupply={shares}
            policyCount={Number(policyCount)}
          />
        </div>
      </div>
    </div>
  );
}

function VaultDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-4 w-40 rounded bg-gray-200" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="h-48 animate-pulse rounded-xl border border-gray-200 bg-white" />
          <div className="h-24 animate-pulse rounded-xl border border-gray-200 bg-white" />
          <div className="h-32 animate-pulse rounded-xl border border-gray-200 bg-white" />
          <div className="h-64 animate-pulse rounded-xl border border-gray-200 bg-white" />
        </div>
        <div className="h-80 animate-pulse rounded-xl border border-gray-200 bg-white" />
      </div>
    </div>
  );
}
