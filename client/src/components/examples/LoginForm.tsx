import { LoginForm } from '../LoginForm';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '../ThemeProvider';

export default function LoginFormExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="h-[500px]">
          <LoginForm />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}