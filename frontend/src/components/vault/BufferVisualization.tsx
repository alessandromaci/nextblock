'use client';

import { formatUSDC, formatBufferRatio } from '@/lib/formatting';

interface BufferVisualizationProps {
  totalAssets: bigint;
  deployedCapital: bigint;
  availableBuffer: bigint;
  pendingClaims: bigint;
  bufferBps: bigint;
}

export function BufferVisualization({
  totalAssets,
  deployedCapital,
  availableBuffer,
  pendingClaims,
  bufferBps,
}: BufferVisualizationProps) {
  const total = Number(deployedCapital) + Number(availableBuffer) + Number(pendingClaims);
  const deployedPct = total > 0 ? (Number(deployedCapital) / total) * 100 : 0;
  const bufferPct = total > 0 ? (Number(availableBuffer) / total) * 100 : 0;
  const claimsPct = total > 0 ? (Number(pendingClaims) / total) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Capital Deployment</h3>
        <span className="text-xs text-gray-400">
          Target buffer: {formatBufferRatio(bufferBps)}
        </span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-gray-100">
        {deployedPct > 0 && (
          <div
            className="bg-blue-400 transition-all duration-500"
            style={{ width: `${deployedPct}%` }}
            title={`Deployed: ${formatUSDC(deployedCapital)}`}
          />
        )}
        {claimsPct > 0 && (
          <div
            className="bg-red-400 transition-all duration-500"
            style={{ width: `${claimsPct}%` }}
            title={`Pending Claims: ${formatUSDC(pendingClaims)}`}
          />
        )}
        {bufferPct > 0 && (
          <div
            className="bg-emerald-400 transition-all duration-500"
            style={{ width: `${bufferPct}%` }}
            title={`Buffer: ${formatUSDC(availableBuffer)}`}
          />
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-400" />
          <span className="text-xs text-gray-600">
            Deployed{' '}
            <span className="font-mono-num font-medium">
              {formatUSDC(deployedCapital)}
            </span>
          </span>
        </div>
        {pendingClaims > 0n && (
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-red-400" />
            <span className="text-xs text-gray-600">
              Pending Claims{' '}
              <span className="font-mono-num font-medium">
                {formatUSDC(pendingClaims)}
              </span>
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" />
          <span className="text-xs text-gray-600">
            Buffer{' '}
            <span className="font-mono-num font-medium">
              {formatUSDC(availableBuffer)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
