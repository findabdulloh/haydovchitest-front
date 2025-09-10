import Topics from '../../pages/Topics';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function TopicsExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6">
        <Topics />
      </div>
    </QueryClientProvider>
  );
}