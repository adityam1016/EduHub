import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './ProgressChart.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const ProgressChart = ({ data, color, height = 200 }) => {
  const gradientId = `chartGrad-${Math.random().toString(36).slice(2)}`;

  return (
    <div className="progress-chart">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color || '#7B5EA7'} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color || '#7B5EA7'} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#5A5A7A', fontSize: 11, fontWeight: 500 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            stroke={color || '#7B5EA7'}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={{ r: 4, fill: color || '#7B5EA7', stroke: '#0D0D1A', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: color || '#7B5EA7', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
