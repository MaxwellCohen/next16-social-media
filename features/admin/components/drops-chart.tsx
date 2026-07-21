'use client';

import { useState } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Tile } from '@/features/admin/components/tile';
import { useAdmin } from '@/features/admin/providers/admin-provider';
import { cn } from '@/lib/utils';

const W = 600;
const H = 160;
const PAD = 10;
const RANGES = [15, 30, 60];

function RangeChips({ range, onChange }: { range: number; onChange: (value: number) => void }) {
  return (
    <div className="flex gap-1">
      {RANGES.map(value => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          aria-pressed={range === value}
          className={cn(
            'rounded-full px-2 py-0.5 font-mono text-xs transition-colors',
            range === value ? 'bg-accent text-white' : 'text-gray hover:text-black dark:hover:text-white',
          )}
        >
          {value === 60 ? '1h' : `${value}m`}
        </button>
      ))}
    </div>
  );
}

export function DropsChart() {
  const { snapshot } = useAdmin();
  const [range, setRange] = useState(30);
  const [hover, setHover] = useState<number | null>(null);

  if (!snapshot) {
    return (
      <Boundary label="DropsChart">
        <Tile title="Drops over time">
          <ChartSkeleton />
        </Tile>
      </Boundary>
    );
  }

  const series = snapshot.series.slice(-range);
  const n = series.length;
  const max = Math.max(1, ...series.map(point => point.count));

  const x = (i: number) => PAD + (i * (W - 2 * PAD)) / Math.max(1, n - 1);
  const y = (count: number) => H - PAD - (count / max) * (H - 2 * PAD);

  const line = series.map((point, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(point.count).toFixed(1)}`).join(' ');
  const area = n > 0 ? `${line} L${x(n - 1).toFixed(1)},${H - PAD} L${x(0).toFixed(1)},${H - PAD} Z` : '';
  const last = series[n - 1];

  return (
    <Boundary label="DropsChart">
      <Tile title="Drops over time" action={<RangeChips range={range} onChange={setRange} />}>
        <div className="px-4 pb-4">
          <div className="relative">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="text-accent w-full"
              role="img"
              aria-label={`Drops per minute over the last ${n} minutes`}
            >
              <line
                x1={PAD}
                y1={H - PAD}
                x2={W - PAD}
                y2={H - PAD}
                className="stroke-divider dark:stroke-divider-dark"
                strokeWidth={1}
              />
              {area ? <path d={area} fill="currentColor" fillOpacity={0.12} /> : null}
              {line ? (
                <path d={line} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              ) : null}
              {hover !== null && series[hover] ? (
                <>
                  <line
                    x1={x(hover)}
                    y1={PAD}
                    x2={x(hover)}
                    y2={H - PAD}
                    className="stroke-divider dark:stroke-divider-dark"
                    strokeWidth={1}
                  />
                  <circle cx={x(hover)} cy={y(series[hover].count)} r={4} fill="currentColor" />
                </>
              ) : null}
            </svg>
            {last ? (
              <span
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(x(n - 1) / W) * 100}%`, top: `${(y(last.count) / H) * 100}%` }}
              >
                <span className="relative flex size-2.5">
                  <span className="bg-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
                  <span className="bg-accent relative inline-flex size-2.5 rounded-full" />
                </span>
              </span>
            ) : null}
            <div className="absolute inset-0 flex">
              {series.map((point, i) => (
                <button
                  type="button"
                  key={point.t}
                  className="h-full flex-1"
                  aria-label={`${point.count} drops`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                />
              ))}
            </div>
            {hover !== null && series[hover] ? (
              <div
                className="border-divider dark:border-divider-dark pointer-events-none absolute top-0 -translate-x-1/2 rounded-md border bg-white px-2 py-1 text-xs shadow-sm dark:bg-black"
                style={{ left: `${(x(hover) / W) * 100}%` }}
              >
                <span className="font-mono font-bold">{series[hover].count}</span> drops
              </div>
            ) : null}
          </div>
        </div>
      </Tile>
    </Boundary>
  );
}

function ChartSkeleton() {
  return (
    <div className="px-4 pb-4" aria-hidden>
      <div className="bg-card dark:bg-card-dark animate-pending aspect-15/4 w-full rounded-lg" />
    </div>
  );
}
