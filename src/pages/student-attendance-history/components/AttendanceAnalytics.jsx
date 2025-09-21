import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';


const AttendanceAnalytics = ({ analyticsData }) => {
  const [activeTab, setActiveTab] = useState('subjects');

  const tabs = [
    { id: 'subjects', label: 'Subject-wise', icon: 'BookOpen' },
    { id: 'trends', label: 'Monthly Trends', icon: 'TrendingUp' },
    { id: 'patterns', label: 'Patterns', icon: 'BarChart3' }
  ];

  const COLORS = ['#1E40AF', '#7C3AED', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

  const renderSubjectAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject-wise Bar Chart */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-4">Subject-wise Attendance</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData?.subjectWise}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="subject" 
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="percentage" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance Pie Chart */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-4">Performance Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData?.performanceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {analyticsData?.performanceDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {analyticsData?.performanceDistribution?.map((entry, index) => (
              <div key={entry?.category} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                />
                <span className="text-xs text-muted-foreground">
                  {entry?.category} ({entry?.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Details List */}
      <div className="space-y-3">
        {analyticsData?.subjectWise?.map((subject, index) => (
          <div key={subject?.subject} className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-foreground">{subject?.subject}</h5>
              <span className={`text-sm font-medium ${
                subject?.percentage >= 75 ? 'text-success' : 
                subject?.percentage >= 60 ? 'text-warning' : 'text-error'
              }`}>
                {subject?.percentage}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Faculty: {subject?.faculty}</span>
              <span>{subject?.present}/{subject?.total} classes</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  subject?.percentage >= 75 ? 'bg-success' : 
                  subject?.percentage >= 60 ? 'bg-warning' : 'bg-error'
                }`}
                style={{ width: `${subject?.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrendAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-4">Monthly Attendance Trend</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData?.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <Icon name="TrendingUp" size={24} className="text-success mx-auto mb-2" />
          <div className="text-lg font-bold text-success">+5.2%</div>
          <div className="text-sm text-muted-foreground">Improvement this month</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <Icon name="Calendar" size={24} className="text-primary mx-auto mb-2" />
          <div className="text-lg font-bold text-foreground">18</div>
          <div className="text-sm text-muted-foreground">Classes this month</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <Icon name="Target" size={24} className="text-warning mx-auto mb-2" />
          <div className="text-lg font-bold text-foreground">82%</div>
          <div className="text-sm text-muted-foreground">Target achievement</div>
        </div>
      </div>
    </div>
  );

  const renderPatternAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-4">Day-wise Pattern</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData?.dayWisePattern}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="attendance" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-4">Time-wise Pattern</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData?.timeWisePattern}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="attendance" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-4">Insights & Recommendations</h4>
        <div className="space-y-3">
          {analyticsData?.insights?.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-card rounded-lg">
              <Icon 
                name={insight?.type === 'positive' ? 'CheckCircle' : insight?.type === 'warning' ? 'AlertTriangle' : 'Info'} 
                size={20} 
                className={
                  insight?.type === 'positive' ? 'text-success' : 
                  insight?.type === 'warning' ? 'text-warning' : 'text-primary'
                } 
              />
              <div>
                <h5 className="font-medium text-foreground">{insight?.title}</h5>
                <p className="text-sm text-muted-foreground">{insight?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-lg shadow-card border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Attendance Analytics</h3>
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                activeTab === tab?.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="hidden sm:inline">{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {activeTab === 'subjects' && renderSubjectAnalytics()}
        {activeTab === 'trends' && renderTrendAnalytics()}
        {activeTab === 'patterns' && renderPatternAnalytics()}
      </div>
    </div>
  );
};

export default AttendanceAnalytics;