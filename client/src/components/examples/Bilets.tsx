import Bilets from '../../pages/Bilets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function BiletsExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6">
        <Bilets />
      </div>
    </QueryClientProvider>
  );
}