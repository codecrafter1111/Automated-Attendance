import React from 'react';

const PerformanceTrends = ({ data }) => {
  // Find min and max for scaling
  const values = data.map(d => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 100;

  // Calculate bar heights
  const bars = data.map(d => ({
    ...d,
    height: ((d.value - minValue) / range) * 100 || 50
  }));

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-xl p-6 border-2 border-slate-300 dark:border-[#1B1B1B] hover:shadow-2xl dark:hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-slate-900/50 transition-all">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Performance Trends</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Monthly performance across different metrics
        </p>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between h-64 gap-2 px-2 relative bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-800/30 rounded-lg">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none rounded-lg">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-b border-slate-300 dark:border-slate-700/50" />
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="flex flex-col justify-between text-xs text-slate-600 dark:text-slate-400 pr-2 relative z-10">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>

        {/* Bars */}
        <div className="flex-1 flex items-end justify-between gap-1 relative z-10">
          {bars.map((bar, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center group relative"
            >
              {/* Bar */}
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500 dark:hover:from-blue-700 dark:hover:to-blue-600 cursor-pointer shadow-sm dark:shadow-md"
                style={{ height: `${bar.height}%` }}
                title={`${bar.month}: ${bar.value}%`}
              />
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 absolute bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs px-2 py-1 rounded mt-2 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {bar.value}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mt-4 pl-14">
        {data.map((d, idx) => (
          <div key={idx} className="flex-1 text-center">{d.month}</div>
        ))}
      </div>

      {/* Grid lines */}
      <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
        <p>Note: Based on quiz scores, assignment grades, and attendance metrics</p>
      </div>
    </div>
  );
};

export default PerformanceTrends;
