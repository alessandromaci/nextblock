'use client';

import { useVaultAddresses } from '@/hooks/useVaultData';
import { VaultCard } from '@/components/vault/VaultCard';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { VerificationType } from '@/config/constants';

export default function VaultDiscoveryPage() {
  const { data: vaultAddresses, isLoading, error } = useVaultAddresses();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Insurance-Backed Yield Vaults
        </h1>
        <p className="mt-2 max-w-2xl text-base text-gray-600">
          Diversified vaults backed by tokenized insurance policies. Earn
          premiums as yield while your capital provides underwriting capacity.
        </p>
      </div>

      {/* Verification legend */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
          Verification types:
        </span>
        <VerificationBadge type={VerificationType.ON_CHAIN} />
        <VerificationBadge type={VerificationType.ORACLE_DEPENDENT} />
        <VerificationBadge type={VerificationType.OFF_CHAIN} />
      </div>

      {/* Vault grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <VaultCardSkeleton />
          <VaultCardSkeleton />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-800">
            Failed to load vaults
          </p>
          <p className="mt-1 text-xs text-red-600">
            Make sure contracts are deployed and addresses are configured.
          </p>
        </div>
      ) : !vaultAddresses || vaultAddresses.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900">No vaults found</h3>
          <p className="mt-1 text-xs text-gray-500">
            Deploy contracts and run the setup script to create vaults.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {vaultAddresses.map((address) => (
            <VaultCard key={address} vaultAddress={address} />
          ))}
        </div>
      )}

      {/* Platform info */}
      <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          How It Works
        </h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div>
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <span className="text-sm font-bold text-slate-600">1</span>
            </div>
            <h3 className="text-sm font-medium text-gray-900">
              Tokenized Policies
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Insurance policies are tokenized on-chain with transparent terms,
              coverage, and verification methods.
            </p>
          </div>
          <div>
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <span className="text-sm font-bold text-slate-600">2</span>
            </div>
            <h3 className="text-sm font-medium text-gray-900">
              Curated Vaults
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Vault managers build diversified portfolios from tokenized
              policies. Different strategies for different risk appetites.
            </p>
          </div>
          <div>
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <span className="text-sm font-bold text-slate-600">3</span>
            </div>
            <h3 className="text-sm font-medium text-gray-900">
              Earn Premiums
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Your deposit provides underwriting capacity. Premiums accrue as
              yield over time. Withdraw anytime from the liquidity buffer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VaultCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="h-5 w-32 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-24 rounded bg-gray-100" />
        </div>
        <div className="h-5 w-16 rounded-full bg-gray-100" />
      </div>
      <div className="mb-4 h-4 w-48 rounded bg-gray-100" />
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <div className="h-3 w-16 rounded bg-gray-100" />
          <div className="mt-2 h-6 w-20 rounded bg-gray-200" />
        </div>
        <div>
          <div className="h-3 w-16 rounded bg-gray-100" />
          <div className="mt-2 h-6 w-20 rounded bg-gray-200" />
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4">
        <div className="h-4 w-full rounded bg-gray-100" />
      </div>
    </div>
  );
}
