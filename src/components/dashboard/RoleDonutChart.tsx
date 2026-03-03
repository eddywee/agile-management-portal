// © Edmund Wallner
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { RoleDistribution } from '@/types';

interface RoleDonutChartProps {
  dist: RoleDistribution;
}

const COLORS = ['#00adef', '#f59e0b', '#8b5cf6'];

export function RoleDonutChart({ dist }: RoleDonutChartProps) {
  const data = [
    { name: 'Delivery', value: dist.delivery },
    { name: 'ART Leadership', value: dist.art_leadership },
    { name: 'Solution Leadership', value: dist.solution_leadership },
  ].filter(d => d.value > 0);

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
            contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 12 }}
            formatter={(value: number | undefined) => `${(value ?? 0).toFixed(1)} FTE`}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: 11, color: '#a0a0a8' }}
            formatter={(value, entry) => {
              const pct = dist.total > 0 ? ((entry.payload?.value ?? 0) / dist.total * 100).toFixed(0) : '0';
              return `${value} (${pct}%)`;
            }}
          />
          {/* Center text */}
          <text x="40%" y="48%" textAnchor="middle" fill="#f0f0f2" fontFamily="Playfair Display" fontWeight="600" fontSize="22">
            {dist.total.toFixed(1)}
          </text>
          <text x="40%" y="60%" textAnchor="middle" fill="#a0a0a8" fontSize="10">
            TOTAL FTE
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
