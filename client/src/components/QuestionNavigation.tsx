import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuestionNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Set<number>;
  onQuestionSelect: (questionNumber: number) => void;
}

export function QuestionNavigation({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onQuestionSelect,
}: QuestionNavigationProps) {
  const questions = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  const getQuestionStatus = (questionNumber: number) => {
    if (questionNumber === currentQuestion) return 'current';
    if (answeredQuestions.has(questionNumber)) return 'answered';
    return 'unanswered';
  };

  const getButtonVariant = (questionNumber: number) => {
    const status = getQuestionStatus(questionNumber);
    if (status === 'current') return 'default';
    if (status === 'answered') return 'secondary';
    return 'outline';
  };

  const handleQuestionClick = (questionNumber: number) => {
    console.log(`Navigate to question ${questionNumber}`);
    onQuestionSelect(questionNumber);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Question Navigation</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="grid grid-cols-5 gap-2">
            {questions.map((questionNumber) => (
              <Button
                key={questionNumber}
                variant={getButtonVariant(questionNumber)}
                size="sm"
                className="h-8 w-8 p-0 text-xs"
                onClick={() => handleQuestionClick(questionNumber)}
                data-testid={`button-question-${questionNumber}`}
              >
                {questionNumber}
              </Button>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span>Current</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-secondary" />
            <span>Answered</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full border border-border" />
            <span>Unanswered</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}