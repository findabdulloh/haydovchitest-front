import { BarChart3, BookOpen, Target, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Skeleton } from '@/components/ui/skeleton';

const dashboardCards = [
  {
    title: 'Results',
    description: 'View your test performance and analytics with detailed charts and statistics.',
    icon: BarChart3,
    href: '/results',
    color: 'text-chart-1',
  },
  {
    title: 'Bilets',
    description: 'Practice with 58 standardized test bilets, each containing 20 questions.',
    icon: BookOpen,
    href: '/bilets',
    color: 'text-chart-2',
  },
  {
    title: 'Test by Topics',
    description: 'Focus on specific topics with customized question sets and targeted practice.',
    icon: Target,
    href: '/topics',
    color: 'text-chart-3',
  },
  {
    title: 'Real Test',
    description: 'Take the official 25-minute exam with 20 questions and strict scoring rules.',
    icon: Trophy,
    href: '/real-test',
    color: 'text-chart-4',
  },
];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: () => apiClient.getUserStats(),
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Haydovchi Test. Choose your study path and track your progress.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card key={card.title} className="hover-elevate">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">{card.title}</CardTitle>
                <IconComponent className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mb-4">
                  {card.description}
                </CardDescription>
                <Button asChild size="sm">
                  <Link href={card.href} data-testid={`button-${card.title.toLowerCase().replace(' ', '-')}`}>
                    Get Started
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Tests Taken</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold" data-testid="text-total-tests">
                {stats?.totalTests || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {stats?.totalTests === 0 ? 'Take your first test!' : 'Keep practicing!'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold" data-testid="text-average-score">
                {stats?.averageScore || 0}%
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {(stats?.averageScore || 0) >= 80 ? 'Excellent work!' : 'Room for improvement'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold" data-testid="text-study-streak">
                {stats?.studyStreak || 0} days
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {(stats?.studyStreak || 0) === 0 ? 'Start your streak today!' : 'Keep it up!'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}