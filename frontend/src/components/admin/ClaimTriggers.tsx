'use client';

import { useState } from 'react';
import { useCheckClaim, useReportEvent, useSubmitClaim } from '@/hooks/useClaimTrigger';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { VerificationType } from '@/config/constants';
import { parseUSDC } from '@/lib/formatting';

interface ClaimTriggersProps {
  vaultAddresses: readonly `0x${string}`[];
  vaultNames: string[];
}

export function ClaimTriggers({ vaultAddresses, vaultNames }: ClaimTriggersProps) {
  const [selectedVaultIdx, setSelectedVaultIdx] = useState(0);
  const [p3Amount, setP3Amount] = useState('');

  const checkClaim = useCheckClaim();
  const reportEvent = useReportEvent();
  const submitClaim = useSubmitClaim();

  const selectedVault = vaultAddresses[selectedVaultIdx];

  const handleP1Trigger = () => {
    if (selectedVault) {
      checkClaim.trigger(selectedVault, 0n);
    }
  };

  const handleP1TriggerAll = () => {
    for (const vault of vaultAddresses) {
      checkClaim.trigger(vault, 0n);
    }
  };

  const handleP2Trigger = () => {
    if (selectedVault) {
      reportEvent.trigger(selectedVault, 1n);
    }
  };

  const handleP3Trigger = () => {
    if (selectedVault) {
      const amount = parseUSDC(p3Amount);
      if (amount > 0n) {
        submitClaim.trigger(selectedVault, 2n, amount);
        setP3Amount('');
      }
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-1 text-sm font-semibold text-gray-900">
        Claim Triggers
      </h3>
      <p className="mb-4 text-xs text-gray-500">
        Trigger claims on policies. Claims auto-settle when the vault has
        sufficient funds. Each type has a different verification path.
      </p>

      {/* Vault selector */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-700">
          Target Vault
        </label>
        <div className="flex gap-2">
          {vaultAddresses.map((addr, idx) => (
            <button
              key={addr}
              type="button"
              onClick={() => setSelectedVaultIdx(idx)}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                selectedVaultIdx === idx
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {vaultNames[idx] || `Vault ${idx + 1}`}
            </button>
          ))}
        </div>
      </div>

      {/* P1: BTC Protection (On-chain, permissionless) */}
      <div className="mb-3 rounded-lg border border-gray-100 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              P1: BTC Protection
            </span>
            <VerificationBadge type={VerificationType.ON_CHAIN} />
          </div>
        </div>
        <p className="mb-2 text-xs text-gray-500">
          Permissionless. Anyone can trigger if BTC price is below threshold.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleP1Trigger}
            disabled={checkClaim.isPending}
            className="flex-1 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-50"
          >
            {checkClaim.isPending ? 'Triggering...' : 'Trigger & Settle'}
          </button>
          {vaultAddresses.length > 1 && (
            <button
              type="button"
              onClick={handleP1TriggerAll}
              disabled={checkClaim.isPending}
              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              Trigger All Vaults
            </button>
          )}
        </div>
        {checkClaim.isSuccess && (
          <p className="mt-2 text-xs text-emerald-600">
            Claim triggered and auto-settled.
          </p>
        )}
        {checkClaim.error && (
          <p className="mt-2 text-xs text-red-600">
            {(checkClaim.error as Error).message?.split('\n')[0] || 'Transaction failed'}
          </p>
        )}
      </div>

      {/* P2: Flight Delay (Oracle-dependent) */}
      <div className="mb-3 rounded-lg border border-gray-100 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              P2: Flight Delay
            </span>
            <VerificationBadge type={VerificationType.ORACLE_DEPENDENT} />
          </div>
        </div>
        <p className="mb-2 text-xs text-gray-500">
          Oracle reporter only. Set flight status to &quot;Delayed&quot; first.
        </p>
        <button
          type="button"
          onClick={handleP2Trigger}
          disabled={reportEvent.isPending}
          className="w-full rounded-lg border border-amber-200 px-3 py-2 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-50 disabled:opacity-50"
        >
          {reportEvent.isPending ? 'Triggering...' : 'Trigger & Settle'}
        </button>
        {reportEvent.isSuccess && (
          <p className="mt-2 text-xs text-emerald-600">
            Claim triggered and auto-settled.
          </p>
        )}
        {reportEvent.error && (
          <p className="mt-2 text-xs text-red-600">
            {(reportEvent.error as Error).message?.split('\n')[0] || 'Transaction failed'}
          </p>
        )}
      </div>

      {/* P3: Commercial Fire (Off-chain, insurer admin) */}
      <div className="rounded-lg border border-gray-100 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              P3: Commercial Fire
            </span>
            <VerificationBadge type={VerificationType.OFF_CHAIN} />
          </div>
        </div>
        <p className="mb-2 text-xs text-gray-500">
          Insurer admin only. Partial claims allowed (up to $40K coverage).
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Claim amount (USDC)"
            value={p3Amount}
            onChange={(e) => setP3Amount(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-300 focus:border-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleP3Trigger}
            disabled={submitClaim.isPending || !p3Amount}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            {submitClaim.isPending ? '...' : 'Submit & Settle'}
          </button>
        </div>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setP3Amount('35000')}
            className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
          >
            $35K (partial)
          </button>
          <button
            type="button"
            onClick={() => setP3Amount('40000')}
            className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
          >
            $40K (full)
          </button>
        </div>
        {submitClaim.isSuccess && (
          <p className="mt-2 text-xs text-emerald-600">
            Claim triggered and auto-settled.
          </p>
        )}
        {submitClaim.error && (
          <p className="mt-2 text-xs text-red-600">
            {(submitClaim.error as Error).message?.split('\n')[0] || 'Transaction failed'}
          </p>
        )}
      </div>
    </div>
  );
}
