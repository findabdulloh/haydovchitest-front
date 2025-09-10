import { Play, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TestCardProps {
  title: string;
  description: string;
  questionCount: number;
  passed?: boolean;
  correctAnswers?: number;
  onStart: () => void;
  testNumber?: number;
}

export function TestCard({
  title,
  description,
  questionCount,
  passed,
  correctAnswers,
  onStart,
  testNumber,
}: TestCardProps) {
  const handleStart = () => {
    console.log(`Starting test: ${title}`);
    onStart();
  };

  return (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">
            {testNumber && `${testNumber}. `}{title}
          </CardTitle>
          <CardDescription className="text-xs">
            {description}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          {passed !== undefined && (
            <Badge variant={passed ? 'default' : 'secondary'}>
              {passed ? (
                <CheckCircle className="mr-1 h-3 w-3" />
              ) : (
                <XCircle className="mr-1 h-3 w-3" />
              )}
              {passed ? 'Passed' : 'Not Passed'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {questionCount} questions
            </p>
            {correctAnswers !== undefined && (
              <p className="text-xs text-muted-foreground">
                Correct: {correctAnswers}/{questionCount}
              </p>
            )}
          </div>
          <Button size="sm" onClick={handleStart} data-testid={`button-start-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            <Play className="mr-2 h-4 w-4" />
            Start Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}