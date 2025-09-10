import { useQuery } from '@tanstack/react-query';
import { TestResultChart } from '@/components/TestResultChart';
import { apiClient } from '@/lib/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Target, Trophy } from 'lucide-react';

export default function Results() {
  const { data: chartData, isLoading: chartLoading, error: chartError } = useQuery({
    queryKey: ['/api/results/chart'],
    queryFn: () => apiClient.getTestResultsChart(),
  });

  const { data: results, isLoading: resultsLoading, error: resultsError } = useQuery({
    queryKey: ['/api/results'],
    queryFn: () => apiClient.getTestResults(),
  });

  if (chartLoading || resultsLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-[400px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
      </div>
    );
  }

  if (chartError || resultsError) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Results</h1>
          <p className="text-muted-foreground">
            Track your test performance and identify areas for improvement.
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Failed to load results. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Results</h1>
        <p className="text-muted-foreground">
          Track your test performance and identify areas for improvement.
        </p>
      </div>
      
      {chartData && <TestResultChart results={chartData} />}
      
      {chartData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-answered">
                {chartData.correct + chartData.incorrect}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of {chartData.correct + chartData.incorrect + chartData.notSubmitted} total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Correct Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-1" data-testid="text-correct-answers">
                {chartData.correct}
              </div>
              <p className="text-xs text-muted-foreground">
                {chartData.correctnessPercentage}% accuracy rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Incorrect Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-2" data-testid="text-incorrect-answers">
                {chartData.incorrect}
              </div>
              <p className="text-xs text-muted-foreground">
                Areas for improvement
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3" data-testid="text-not-submitted">
                {chartData.notSubmitted}
              </div>
              <p className="text-xs text-muted-foreground">
                Questions skipped
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Test Results</CardTitle>
          <CardDescription>
            Your latest test performance and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results && results.length > 0 ? (
              results.slice(0, 10).map((result) => {
                const date = new Date(result.completedAt).toLocaleDateString();
                const timeMinutes = Math.floor(result.timeSpent / 60);
                const timeSeconds = result.timeSpent % 60;
                const timeSpent = `${timeMinutes}:${timeSeconds.toString().padStart(2, '0')}`;
                
                return (
                  <Card key={result.id} className="hover-elevate">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold" data-testid={`text-test-name-${result.id}`}>
                              {result.testName}
                            </h3>
                            <Badge 
                              variant={result.passed ? 'default' : 'destructive'}
                              data-testid={`badge-result-${result.id}`}
                            >
                              {result.passed ? 'Passed' : 'Failed'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{timeSpent}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {result.testType === 'real' ? (
                                <Trophy className="h-4 w-4" />
                              ) : (
                                <Target className="h-4 w-4" />
                              )}
                              <span className="capitalize">{result.testType}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" data-testid={`text-score-${result.id}`}>
                            {result.score}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {result.correctAnswers}/{result.totalQuestions}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No test results yet. Take your first test to see your progress!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}