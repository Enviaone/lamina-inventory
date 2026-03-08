import InventoryIllustration from '@/components/InventoryIllustration';
import { LoginForm } from '@/features/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side — Illustration */}
      <div className="hidden lg:flex lg:w-[55%] items-center justify-center bg-secondary p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(240,60%,96%),hsl(230,25%,97%))]" />
        <div className="relative z-10 w-full h-full">
          <InventoryIllustration />

          {/* Add Powered by EnviaOne */}
          <span className="absolute bottom-0 right-0 text-xs text-muted-foreground">
            Powered by EnviaOne
          </span>
        </div>
      </div>

      {/* Right side — Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
        <div className="border border-gray-200 rounded-lg p-6 w-full max-w-md space-y-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
