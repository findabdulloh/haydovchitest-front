import { useState } from 'react';
import { useLocation } from 'wouter';
import { Clock, AlertTriangle, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RealTest() {
  const [, setLocation] = useLocation();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartRealTest = async () => {
    setIsStarting(true);
    // Simulate loading
    setTimeout(() => {
      setLocation('/test/real/1');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Real Test</h1>
        <p className="text-muted-foreground">
          Take the official examination under real test conditions.
        </p>
      </div>
      
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          This is a timed test with strict rules. Make sure you're ready before starting.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Test Information
            </CardTitle>
            <CardDescription>
              Official examination format and requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Questions</p>
                <p className="text-2xl font-bold" data-testid="text-question-count">20</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Time Limit</p>
                <p className="text-2xl font-bold flex items-center gap-1" data-testid="text-time-limit">
                  <Clock className="h-4 w-4" />
                  25 min
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Passing Requirements</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Minimum 12/20 correct</Badge>
                <Badge variant="outline">Maximum 3 mistakes</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Rules</CardTitle>
            <CardDescription>
              Important guidelines you must follow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>You have exactly 25 minutes to complete all 20 questions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>The test will automatically end if you make 3 incorrect answers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>You can navigate between questions and change your answers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Submit your test before time runs out</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Once started, the test cannot be paused or restarted</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold">Ready to Begin?</h3>
              <p className="text-sm text-muted-foreground">
                Make sure you have a stable internet connection and won't be interrupted.
              </p>
            </div>
            <Button 
              size="lg" 
              onClick={handleStartRealTest}
              disabled={isStarting}
              data-testid="button-start-real-test"
            >
              {isStarting ? 'Starting Test...' : 'Start Real Test'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}