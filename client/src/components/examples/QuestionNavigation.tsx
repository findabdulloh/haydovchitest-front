import { QuestionNavigation } from '../QuestionNavigation';
import { useState } from 'react';

export default function QuestionNavigationExample() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answeredQuestions] = useState(new Set([1, 3, 5, 7, 9]));

  return (
    <div className="p-4 max-w-md">
      <QuestionNavigation
        totalQuestions={20}
        currentQuestion={currentQuestion}
        answeredQuestions={answeredQuestions}
        onQuestionSelect={setCurrentQuestion}
      />
    </div>
  );
}