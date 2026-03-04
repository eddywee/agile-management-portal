// © Edmund Wallner
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { RoleDistribution } from '@/types';
import { getCSSVar } from '@/utils/themeColors';
import { useThemeStore } from '@/store/themeStore';

interface RoleDonutChartProps {
  dist: RoleDistribution;
}

const COLORS = ['#00adef', '#f59e0b', '#8b5cf6'];

export function RoleDonutChart({ dist }: RoleDonutChartProps) {
  const resolved = useThemeStore((s) => s.resolved);

  const silver = getCSSVar('--silver');
  const card = getCSSVar('--card');
  const border = getCSSVar('--border');
  const white = getCSSVar('--white');
  void resolved;

  const data = [
    { name: 'Delivery', value: dist.delivery },
    { name: 'ART Leadership', value: dist.art_leadership },
    { name: 'Solution Leadership', value: dist.solution_leadership },
  ].filter((d) => d.value > 0);

  return (
    <div className="chart-card">
      <div className="chart-card__title">FTE Distribution by Role Type</div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="40%"
            cy="50%"
            innerRadius={42}
            outerRadius={70}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: card,
              border: `1px solid ${border}`,
              borderRadius: 6,
              fontSize: 12,
            }}
            formatter={(value: number | undefined) => `${(value ?? 0).toFixed(1)} FTE`}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: 11, color: silver }}
            formatter={(value, entry) => {
              const pct = dist.total > 0 ? (((entry.payload?.value ?? 0) / dist.total) * 100).toFixed(0) : '0';
              return `${value} (${pct}%)`;
            }}
          />
          <text
            x="40%"
            y="48%"
            textAnchor="middle"
            fill={white}
            fontFamily="var(--font-display)"
            fontWeight="600"
            fontSize="22"
          >
            {dist.total.toFixed(1)}
          </text>
          <text x="40%" y="60%" textAnchor="middle" fill={silver} fontSize="10">
            TOTAL FTE
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
