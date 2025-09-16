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
        {topics.map((topic) => {
          // Derive passed status and correct answers from lastUserScore
          const passed = topic.lastUserScore?.passed;
          const correctAnswers = topic.lastUserScore?.score;
          const totalQuestions = topic.lastUserScore?.totalQuestions ?? topic.questionsCount;
          const hasAttempted = topic.lastUserScore != null && 
                               typeof correctAnswers === 'number' && 
                               typeof totalQuestions === 'number';
          
          return (
            <TestCard
              key={topic.id}
              title={topic.nameUz} // Required prop - use nameUz as primary title
              titleUz={topic.nameUz}
              titleRu={topic.nameRu}
              titleUzC={topic.nameUzC}
              description={hasAttempted 
                ? `Oxirgi urinish: ${correctAnswers}/${totalQuestions} savol`
                : `${topic.questionsCount} ta savolli mavzuga oid test`
              }
              descriptionUz={hasAttempted 
                ? `Oxirgi urinish: ${correctAnswers}/${totalQuestions} savol`
                : `${topic.questionsCount} ta savolli mavzuga oid test`
              }
              descriptionUzC={hasAttempted 
                ? `Охирги уриниш: ${correctAnswers}/${totalQuestions} савол`
                : `${topic.questionsCount} та саволли мавзуга оид тест`
              }
              descriptionRu={hasAttempted 
                ? `Послетная попытка: ${correctAnswers}/${totalQuestions} вопрос`
                : `Тест по тему из ${topic.questionsCount} вопросов`
              }
              questionsCount={totalQuestions}
              passed={passed}
              correctAnswers={correctAnswers}
              onStart={() => handleStartTest(topic.id)}
            />
          );
        })}
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>Showing {topics.length} topics. Master individual topics to improve your overall performance.</p>
      </div>
    </div>
  );
}