import { TestResultChart } from '../TestResultChart';

export default function TestResultChartExample() {
  const mockResults = {
    correct: 68,
    incorrect: 22,
    notSubmitted: 10,
    correctnessPercentage: 76,
    completionPercentage: 90,
  };

  return (
    <div className="p-4 max-w-4xl">
      <TestResultChart results={mockResults} />
    </div>
  );
}