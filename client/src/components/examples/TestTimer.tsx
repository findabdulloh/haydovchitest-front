import { TestTimer } from '../TestTimer';

export default function TestTimerExample() {
  return (
    <div className="p-4">
      <TestTimer
        duration={25}
        onTimeUp={() => console.log('Time is up!')}
        isActive={true}
      />
    </div>
  );
}