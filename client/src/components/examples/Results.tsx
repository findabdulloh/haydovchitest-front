import Results from '../../pages/Results';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function ResultsExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6">
        <Results />
      </div>
    </QueryClientProvider>
  );
}