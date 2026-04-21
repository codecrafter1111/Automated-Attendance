import React from 'react';
import Icon from 'components/AppIcon';

const SubjectPerformance = ({ subjects }) => {
  const getGradeColor = (grade) => {
    if (grade.includes('A')) return 'text-success bg-success/20';
    if (grade.includes('B')) return 'text-primary bg-primary/20';
    if (grade.includes('C')) return 'text-warning bg-warning/20';
    return 'text-muted-foreground bg-muted';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-card hover:shadow-card-hover transition-all">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">Subject Performance</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed breakdown by subject
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Instructor
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Attendance
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Assignments
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Grade
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-foreground uppercase tracking-wide">
                Trend
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Last Class
              </th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, idx) => (
              <tr
                key={idx}
                className="border-b border-border hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <td className="px-4 py-4 text-sm font-semibold text-foreground">
                  {subject.subject}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {subject.instructor}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${subject.attendance}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {subject.attendance}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-medium text-foreground">
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
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {subject.lastClass}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
        <p>Total Subjects: {subjects.length} | Average Attendance: {(subjects.reduce((sum, s) => sum + s.attendance, 0) / subjects.length).toFixed(1)}%</p>
      </div>
    </div>
  );
};

export default SubjectPerformance;
