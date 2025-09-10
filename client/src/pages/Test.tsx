import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TestTimer } from '@/components/TestTimer';
import { QuestionNavigation } from '@/components/QuestionNavigation';
import { apiClient, type TestQuestion } from '@/lib/apiClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function Test() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const testType = params.type as string;
  const testId = params.id as string;
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [mistakes, setMistakes] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  
  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['/api/test', testType, testId],
    queryFn: () => apiClient.getTestQuestions(testType, testId),
  });
  
  useEffect(() => {
    if (questions && questions.length > 0) {
      setTestStarted(true);
    }
  }, [questions]);
  
  const currentQuestionData = questions?.[currentQuestion - 1];
  const answeredQuestions = new Set(Object.keys(answers).map(q => parseInt(q)));
  const isRealTest = testType === 'real';
  
  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: answerIndex }));
    console.log(`Question ${currentQuestion} answered with option ${answerIndex}`);
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleNext = () => {
    if (questions && currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handleQuestionSelect = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
  };
  
  const handleTimeUp = () => {
    toast({
      title: 'Time\'s up!',
      description: 'Your test has been automatically submitted.',
      variant: 'destructive',
    });
    handleSubmit();
  };
  
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await apiClient.submitTest(testType, testId, answers);
      toast({
        title: 'Test submitted!',
        description: 'Your answers have been saved successfully.',
      });
      setLocation('/results');
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: 'Failed to submit your test. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !questions || questions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Test</h1>
          <p className="text-muted-foreground">Failed to load test questions.</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Unable to load the test. Please try again later.</p>
            <Button onClick={() => setLocation('/')} className="mt-4">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {testType === 'real' ? 'Real Test' : 
             testType === 'bilet' ? `Bilet ${testId}` : 
             `Topic Test`}
          </h1>
          <p className="text-muted-foreground">
            Question {currentQuestion} of {questions.length}
            {isRealTest && ` • Mistakes: ${mistakes}/3`}
          </p>
        </div>
        
        {isRealTest && (
          <TestTimer
            duration={25}
            onTimeUp={handleTimeUp}
            isActive={testStarted}
          />
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question {currentQuestion}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-base leading-relaxed" data-testid="text-question">
                {currentQuestionData?.text}
              </p>
              
              <RadioGroup
                value={answers[currentQuestion]?.toString()}
                onValueChange={(value) => 
                  handleAnswerChange(currentQuestionData!.id, parseInt(value))
                }
                className="space-y-3"
              >
                {currentQuestionData?.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={index.toString()} 
                      id={`option-${index}`}
                      data-testid={`option-${index}`}
                    />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 1}
              data-testid="button-previous"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {currentQuestion === questions.length ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  data-testid="button-submit"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Test'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  data-testid="button-next"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <QuestionNavigation
            totalQuestions={questions.length}
            currentQuestion={currentQuestion}
            answeredQuestions={answeredQuestions}
            onQuestionSelect={handleQuestionSelect}
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Answered</span>
                  <span data-testid="text-progress">{answeredQuestions.size}/{questions.length}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(answeredQuestions.size / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}