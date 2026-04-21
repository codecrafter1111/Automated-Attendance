import React from 'react';
import Icon from 'components/AppIcon';

const AttendanceBreakdown = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.percentage, 0);

  // Calculate pie chart segments
  let currentAngle = 0;
  const segments = data.map((item, idx) => {
    const sliceAngle = (item.percentage / 100) * 360;
    const segment = {
      ...item,
      startAngle: currentAngle,
      angle: sliceAngle
    };
    currentAngle += sliceAngle;
    return segment;
  });

  // Create SVG path for pie chart
  const radius = 80;
  const innerRadius = 50;
  const centerX = 100;
  const centerY = 100;

  const polarToCartesian = (angle, r) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: centerX + r * Math.cos(radians - Math.PI / 2),
      y: centerY + r * Math.sin(radians - Math.PI / 2)
    };
  };

  const createArcPath = (startAngle, angle) => {
    const start = polarToCartesian(startAngle, radius);
    const end = polarToCartesian(startAngle + angle, radius);
    const innerStart = polarToCartesian(startAngle, innerRadius);
    const innerEnd = polarToCartesian(startAngle + angle, innerRadius);

    const largeArc = angle > 180 ? 1 : 0;

    return `
      M ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}
      L ${innerEnd.x} ${innerEnd.y}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}
      Z
    `;
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-xl p-6 border-2 border-slate-300 dark:border-[#1B1B1B] hover:shadow-2xl dark:hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-slate-900/50 transition-all">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Attendance Breakdown</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Distribution of attendance status
        </p>
      </div>

      {/* Chart and Legend */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Donut Chart */}
        <div className="flex-shrink-0">
          <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-md dark:drop-shadow-lg">
            {segments.map((segment, idx) => (
              <path
                key={idx}
                d={createArcPath(segment.startAngle, segment.angle)}
                fill={segment.color}
                className="transition-opacity hover:opacity-80"
                style={{ cursor: 'pointer' }}
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="space-y-3 flex-1">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {item.label}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 pt-6 border-t border-slate-300 dark:border-slate-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          {data.map((item, idx) => (
            <div key={idx}>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{item.label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{item.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceBreakdown;
