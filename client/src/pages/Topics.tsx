import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { TestCard } from '@/components/TestCard';
import { apiClient } from '@/lib/apiClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function Topics() {
  const [, setLocation] = useLocation();
  
  const { data: topics, isLoading, error } = useQuery({
    queryKey: ['/api/topics'],
    queryFn: () => apiClient.getTopics(),
  });

  const handleStartTest = (topicId: string) => {
    setLocation(`/test/topic/${topicId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !topics) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Test by Topics</h1>
          <p className="text-muted-foreground">
            Focus on specific topics to improve your skills.
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Failed to load topics. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Test by Topics</h1>
        <p className="text-muted-foreground">
          Focus on specific topics with targeted practice. Each topic contains a variable number of questions based on complexity.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <TestCard
            key={topic.id}
            title={topic.name}
            description={`Targeted practice for ${topic.name.toLowerCase()} concepts`}
            questionCount={topic.questionCount}
            passed={topic.passed}
            correctAnswers={topic.correctAnswers}
            onStart={() => handleStartTest(topic.id)}
          />
        ))}
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>Showing {topics.length} topics. Master individual topics to improve your overall performance.</p>
      </div>
    </div>
  );
}