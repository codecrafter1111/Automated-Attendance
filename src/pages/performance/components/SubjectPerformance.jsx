import React from 'react';
import Icon from 'components/AppIcon';

const SubjectPerformance = ({ subjects }) => {
  const getGradeColor = (grade) => {
    if (grade.includes('A')) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
    if (grade.includes('B')) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
    if (grade.includes('C')) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';
    return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-emerald-600 dark:text-emerald-400';
    if (trend === 'down') return 'text-red-600 dark:text-red-400';
    return 'text-slate-600 dark:text-slate-400';
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-xl p-6 border-2 border-slate-300 dark:border-[#1A1A1A] hover:shadow-2xl dark:hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-slate-900/50 transition-all">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Subject Performance</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Detailed breakdown by subject
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A1A1A]">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Instructor
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Attendance
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Assignments
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Grade
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Trend
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Last Class
              </th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, idx) => (
              <tr
                key={idx}
                className="border-b-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td className="px-4 py-4 text-sm font-semibold text-white dark:text-white">
                  {subject.subject}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {subject.instructor}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-300 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-400 dark:bg-blue-400 h-2 rounded-full"
                        style={{ width: `${subject.attendance}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {subject.attendance}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">
                  {subject.assignments}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getGradeColor(subject.grade)}`}>
                    {subject.grade}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <Icon
                    name={getTrendIcon(subject.trend)}
                    size={18}
                    className={getTrendColor(subject.trend)}
                  />
                </td>
                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {subject.lastClass}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
        <p>Total Subjects: {subjects.length} | Average Attendance: {(subjects.reduce((sum, s) => sum + s.attendance, 0) / subjects.length).toFixed(1)}%</p>
      </div>
    </div>
  );
};

export default SubjectPerformance;
