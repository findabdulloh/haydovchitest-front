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
import { useLanguage } from '@/contexts/LanguageContext';

export default function Test() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { getLocalizedText } = useLanguage();
  
  const testType = params.type as string;
  const testId = params.id as string;
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [mistakes, setMistakes] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, { index: number; isCorrect: boolean }>>({});
  
  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['/api/test', testType, testId],
    queryFn: () => apiClient.getTestQuestions(testType, testId),
  });
  
  useEffect(() => {
    if (questions && questions.length > 0 && !testStarted) {
      setTestStarted(true);
      setStartTime(Date.now());
    }
  }, [questions, testStarted]);
  
  const currentQuestionData = questions?.[currentQuestion - 1];
  const answeredQuestions = new Set(
    Object.keys(answers)
      .filter(questionId => questions?.some(q => q.id === questionId))
      .map(questionId => {
        const questionIndex = questions?.findIndex(q => q.id === questionId);
        return questionIndex !== undefined ? questionIndex + 1 : 0;
      })
      .filter(questionNumber => questionNumber > 0)
  );
  const isRealTest = testType === 'real';
  
  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    
    // Immediate feedback - show if answer is correct
    const question = questions?.find(q => q.id === questionId);
    if (question) {
      const isCorrect = answerIndex === question.correctAnswer;
      setSelectedAnswers(prev => ({ ...prev, [questionId]: { index: answerIndex, isCorrect } }));
    }
    
    // Check if this was the last unanswered question and auto-submit if enabled
    if (questions) {
      const newAnswers = { ...answers, [questionId]: answerIndex };
      const answeredCount = Object.keys(newAnswers).filter(id => 
        questions.some(q => q.id === id)
      ).length;
      
      if (answeredCount === questions.length) {
        // All questions answered - auto submit
        setTimeout(() => {
          handleSubmit();
        }, 1000); // Give user 1 second to see their last answer
      }
    }
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
      const timeSpent = Math.floor((Date.now() - startTime) / 1000); // in seconds
      const result = await apiClient.submitTest(testType, testId, answers, timeSpent);
      toast({
        title: 'Test submitted!',
        description: `Score: ${result.score}% (${result.correctAnswers}/${result.totalQuestions})`,
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
                {currentQuestionData ? getLocalizedText(
                  currentQuestionData.questionTextUz || currentQuestionData.questionText,
                  currentQuestionData.questionTextRu || currentQuestionData.questionText,
                  currentQuestionData.questionTextUzC || currentQuestionData.questionText
                ) : ''}
              </p>
              
              <RadioGroup
                value={answers[currentQuestionData?.id || '']?.toString()}
                onValueChange={(value) => 
                  handleAnswerChange(currentQuestionData!.id, parseInt(value))
                }
                className="space-y-3"
              >
                {(currentQuestionData ? getLocalizedText(
                  currentQuestionData.optionsUz || currentQuestionData.options,
                  currentQuestionData.optionsRu || currentQuestionData.options,
                  currentQuestionData.optionsUzC || currentQuestionData.options
                ) : []).map((option, index) => {
                  const selectedAnswer = selectedAnswers[currentQuestionData?.id || ''];
                  const isSelected = selectedAnswer && selectedAnswer.index === index;
                  const isCorrect = currentQuestionData?.correctAnswer === index;
                  
                  let optionClassName = "flex items-center space-x-2 p-2 rounded-md transition-colors";
                  if (isSelected) {
                    optionClassName += selectedAnswer.isCorrect ? " bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-700" : " bg-red-100 border-red-300 dark:bg-red-900/20 dark:border-red-700";
                  }
                  
                  return (
                    <div key={index} className={optionClassName}>
                      <RadioGroupItem 
                        value={index.toString()} 
                        id={`option-${index}`}
                        data-testid={`option-${index}`}
                        className={isSelected ? (selectedAnswer.isCorrect ? "border-green-500 text-green-600" : "border-red-500 text-red-600") : ""}
                      />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className={`flex-1 cursor-pointer ${isSelected ? (selectedAnswer.isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300") : ""}`}
                      >
                        {option}
                      </Label>
                    </div>
                  );
                })}
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