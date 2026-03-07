import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Mail, Smartphone, ArrowLeft } from 'lucide-react';

type LoginMode = 'email' | 'phone' | 'otp';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [mode, setMode] = useState<LoginMode>('email');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up auth service
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setMode('otp');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up OTP verification
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {mode === 'otp' ? 'Verify your phone' : 'Welcome back'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === 'email' && 'Sign in to your inventory management dashboard'}
          {mode === 'phone' &&
            'Enter your phone number to receive a verification code'}
          {mode === 'otp' && (
            <>
              We sent a 6-digit code to{' '}
              <span className="font-medium text-foreground">{phone}</span>
            </>
          )}
        </p>
      </div>

      {/* Login method tabs */}
      {mode !== 'otp' && (
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => setMode('email')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              mode === 'email'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="h-4 w-4" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setMode('phone')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              mode === 'phone'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            Phone
          </button>
        </div>
      )}

      {/* Email form */}
      {mode === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </Label>
              <a
                href="#"
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>

          <Button type="submit" className="w-full h-11 font-semibold" size="lg">
            Sign in
          </Button>
        </form>
      )}

      {/* Phone form */}
      {mode === 'phone' && (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-foreground"
            >
              Phone number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              We'll send you a one-time verification code via SMS
            </p>
          </div>

          <Button type="submit" className="w-full h-11 font-semibold" size="lg">
            Send verification code
          </Button>
        </form>
      )}

      {/* OTP verification form */}
      {mode === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              Enter OTP
            </Label>
            <div className="flex w-full">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                containerClassName="w-full"
              >
                <InputOTPGroup className="w-full">
                  <InputOTPSlot index={0} className="flex-1 h-12" />
                  <InputOTPSlot index={1} className="flex-1 h-12" />
                  <InputOTPSlot index={2} className="flex-1 h-12" />
                  <InputOTPSlot index={3} className="flex-1 h-12" />
                  <InputOTPSlot index={4} className="flex-1 h-12" />
                  <InputOTPSlot index={5} className="flex-1 h-12" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Didn't receive the code?{' '}
              <button
                type="button"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Resend
              </button>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-11 font-semibold"
            size="lg"
            disabled={otp.length < 6}
          >
            Verify & sign in
          </Button>

          <button
            type="button"
            onClick={() => {
              setMode('phone');
              setOtp('');
            }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to phone number
          </button>
        </form>
      )}
    </div>
  );
}
