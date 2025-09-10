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
    <Card className="compact">
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-medium">Questions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[120px]">
          <div className="grid grid-cols-6 gap-1">
            {questions.map((questionNumber) => (
              <Button
                key={questionNumber}
                variant={getButtonVariant(questionNumber)}
                size="sm"
                className="text-xs"
                onClick={() => handleQuestionClick(questionNumber)}
                data-testid={`button-question-${questionNumber}`}
              >
                {questionNumber}
              </Button>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs">Current</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
            <span className="text-xs">Done</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-1.5 w-1.5 rounded-full border border-border" />
            <span className="text-xs">Todo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}