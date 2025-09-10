import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TestTimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
  isActive: boolean;
}

export function TestTimer({ duration, onTimeUp, isActive }: TestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert to seconds

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const formatTime = (time: number) => time.toString().padStart(2, '0');
  
  const getTimerColor = () => {
    const percentage = (timeLeft / (duration * 60)) * 100;
    if (percentage > 50) return 'text-chart-1';
    if (percentage > 20) return 'text-chart-2';
    return 'text-destructive';
  };

  return (
    <Card className="border-2">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">Time Remaining:</span>
          <span className={`text-lg font-bold ${getTimerColor()}`} data-testid="text-timer">
            {formatTime(minutes)}:{formatTime(seconds)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}