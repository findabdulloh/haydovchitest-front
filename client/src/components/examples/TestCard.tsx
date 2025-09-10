import { TestCard } from '../TestCard';

export default function TestCardExample() {
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TestCard
          title="Grammar Basics"
          description="Test your understanding of basic grammar rules"
          questionCount={20}
          passed={true}
          correctAnswers={18}
          onStart={() => console.log('Starting Grammar Basics test')}
          testNumber={1}
        />
        <TestCard
          title="Advanced Writing"
          description="Challenge your writing and composition skills"
          questionCount={15}
          passed={false}
          correctAnswers={8}
          onStart={() => console.log('Starting Advanced Writing test')}
          testNumber={2}
        />
        <TestCard
          title="Vocabulary Test"
          description="Expand your word knowledge and usage"
          questionCount={25}
          onStart={() => console.log('Starting Vocabulary test')}
        />
      </div>
    </div>
  );
}