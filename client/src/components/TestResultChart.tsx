import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { TestResult } from '@/lib/apiClient';

interface TestResultChartProps {
  results: TestResult;
}

const COLORS = {
  correct: 'hsl(var(--chart-1))',
  incorrect: 'hsl(var(--chart-2))',
  notSubmitted: 'hsl(var(--chart-3))',
};

export function TestResultChart({ results }: TestResultChartProps) {
  const data = [
    {
      name: 'Correct',
      value: results.correct,
      color: COLORS.correct,
    },
    {
      name: 'Incorrect',
      value: results.incorrect,
      color: COLORS.incorrect,
    },
    {
      name: 'Not Submitted',
      value: results.notSubmitted,
      color: COLORS.notSubmitted,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Results Overview</CardTitle>
        <CardDescription>
          Your performance across all completed tests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Correctness</span>
              <span className="text-2xl font-bold" data-testid="text-correctness-percentage">
                {results.correctnessPercentage}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-chart-1 h-2 rounded-full transition-all"
                style={{ width: `${results.correctnessPercentage}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completion</span>
              <span className="text-2xl font-bold" data-testid="text-completion-percentage">
                {results.completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-chart-3 h-2 rounded-full transition-all"
                style={{ width: `${results.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}