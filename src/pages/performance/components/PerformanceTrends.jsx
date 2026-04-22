import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const PerformanceTrends = ({ data }) => {
  const safeData = Array.isArray(data)
    ? data
        .filter((item) => item && item.month)
        .map((item) => ({
          month: item.month,
          value: Number(item.value) || 0,
        }))
    : [];

  if (safeData.length === 0) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border hover:shadow-card hover:shadow-card-hover transition-all">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground">Performance Trends</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Monthly performance across different metrics
          </p>
        </div>
        <div className="h-64 rounded-lg border border-dashed border-border bg-muted/20 flex items-center justify-center text-sm text-muted-foreground">
          No trend data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...safeData.map((d) => d.value), 100);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-card border border-border rounded-md px-3 py-2 shadow-card">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{payload[0].value}%</p>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-card hover:shadow-card-hover transition-all">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">Performance Trends</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Monthly performance across different metrics
        </p>
      </div>

      {/* Chart */}
      <div className="h-64 bg-muted/20 rounded-lg border border-border/50 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={safeData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              domain={[0, Math.ceil(maxValue / 10) * 10]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.35)' }} />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Grid lines */}
      <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
        <p>Note: Based on quiz scores, assignment grades, and attendance metrics</p>
      </div>
    </div>
  );
};

export default PerformanceTrends;
