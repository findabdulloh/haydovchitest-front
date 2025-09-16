import { Play, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface TestCardProps {
  title: string;
  titleUz?: string;
  titleRu?: string;
  titleUzC?: string;
  description: string;
  descriptionUz?: string;
  descriptionRu?: string;
  descriptionUzC?: string;
  questionsCount: number;
  passed?: boolean;
  correctAnswers?: number;
  onStart: () => void;
  testNumber?: number;
}

export function TestCard({
  title,
  titleUz,
  titleRu,
  titleUzC,
  description,
  descriptionUz,
  descriptionRu,
  descriptionUzC,
  questionsCount,
  passed,
  correctAnswers,
  onStart,
  testNumber,
}: TestCardProps) {
  const { getLocalizedText } = useLanguage();
  
  const localizedTitle = getLocalizedText(
    titleUz || title, 
    titleRu || title, 
    titleUzC || title
  );
  
  const localizedDescription = getLocalizedText(
    descriptionUz || description,
    descriptionRu || description, 
    descriptionUzC || description
  );
  
  const handleStart = () => {
    console.log(`Starting test: ${localizedTitle}`);
    onStart();
  };

  return (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">
            {testNumber && `${testNumber}. `}{localizedTitle}
          </CardTitle>
          <CardDescription className="text-xs">
            {localizedDescription}
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
              {questionsCount} questions
            </p>
            {correctAnswers !== undefined && (
              <p className="text-xs text-muted-foreground">
                Correct: {correctAnswers}/{questionsCount}
              </p>
            )}
          </div>
          <Button size="sm" onClick={handleStart} data-testid={`button-start-${localizedTitle.toLowerCase().replace(/\s+/g, '-')}`}>
            <Play className="mr-2 h-4 w-4" />
            Start Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}