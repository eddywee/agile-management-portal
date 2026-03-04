// © Edmund Wallner
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SolutionFTEBreakdown } from '@/types';
import { getCSSVar } from '@/utils/themeColors';
import { useThemeStore } from '@/store/themeStore';

interface SolutionBarChartProps {
  data: SolutionFTEBreakdown[];
}

export function SolutionBarChart({ data }: SolutionBarChartProps) {
  const resolved = useThemeStore((s) => s.resolved);

  const silver = getCSSVar('--silver');
  const card = getCSSVar('--card');
  const border = getCSSVar('--border');
  const white = getCSSVar('--white');
  // Force re-read when resolved changes
  void resolved;

  const chartData = data.map((d) => ({
    name: d.name.length > 14 ? d.name.substring(0, 13) + '…' : d.name,
    Delivery: d.delivery,
    'ART Overhead': d.art_overhead,
    'Solution Overhead': d.sol_overhead,
  }));

  return (
    <div className="chart-card">
      <div className="chart-card__title">Investment by Solution</div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <XAxis dataKey="name" tick={{ fill: silver, fontSize: 11 }} />
          <YAxis tick={{ fill: silver, fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: card,
              border: `1px solid ${border}`,
              borderRadius: 6,
              fontSize: 12,
            }}
            labelStyle={{ color: white }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: silver }} />
          <Bar dataKey="Delivery" stackId="a" fill="#00adef" radius={[0, 0, 0, 0]} />
          <Bar dataKey="ART Overhead" stackId="a" fill="#f59e0b" />
          <Bar dataKey="Solution Overhead" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
