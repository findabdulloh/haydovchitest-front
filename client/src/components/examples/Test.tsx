import Test from '../../pages/Test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock params for demo
function MockRouterProvider({ children }: { children: React.ReactNode }) {
  // This would normally be provided by wouter, but for demo we mock it
  return <>{children}</>;
}

export default function TestExample() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <MockRouterProvider>
          <div className="p-6">
            <Test />
          </div>
        </MockRouterProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}