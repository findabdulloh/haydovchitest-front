import { ProfileDropdown } from '../ProfileDropdown';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '../ThemeProvider';

// Mock AuthProvider for demo
function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const mockValue = {
    user: { id: '1', name: 'John Doe', email: 'john@example.com' },
    loading: false,
    login: async () => {},
    logout: async () => console.log('Logout clicked'),
    updateProfile: async (name: string) => console.log('Update profile:', name),
  };

  return (
    <AuthProvider>{children}</AuthProvider>
  );
}

export default function ProfileDropdownExample() {
  return (
    <ThemeProvider>
      <MockAuthProvider>
        <div className="p-4">
          <ProfileDropdown />
        </div>
      </MockAuthProvider>
    </ThemeProvider>
  );
}