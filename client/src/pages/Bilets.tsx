import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { TestCard } from '@/components/TestCard';
import { apiClient } from '@/lib/apiClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function Bilets() {
  const [, setLocation] = useLocation();
  
  const { data: bilets, isLoading, error } = useQuery({
    queryKey: ['/api/bilets'],
    queryFn: () => apiClient.getBilets(),
  });

  const handleStartTest = (biletId: string) => {
    setLocation(`/test/bilet/${biletId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !bilets) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Bilets</h1>
          <p className="text-muted-foreground">
            Practice with standardized test bilets.
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Failed to load bilets. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Bilets</h1>
        <p className="text-muted-foreground">
          Practice with 58 standardized test bilets. Each bilet contains 20 questions covering various topics.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bilets.map((bilet) => (
          <TestCard
            key={bilet.id}
            title={`Bilet ${bilet.number}`}
            description={`Standard test bilet with ${bilet.questionCount} questions`}
            questionCount={bilet.questionCount}
            passed={bilet.passed}
            correctAnswers={bilet.correctAnswers}
            onStart={() => handleStartTest(bilet.id)}
            testNumber={bilet.number}
          />
        ))}
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>Showing {bilets.length} bilets. Complete all bilets to master the test format.</p>
      </div>
    </div>
  );
}