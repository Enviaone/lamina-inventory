import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, ChevronDown, Mail, Smartphone, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAuthStore } from '@/store/auth-store';
import { MOCK_CREDENTIALS } from '@/constants/mock-credentials';
import type { UserRole } from '@/types/auth';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  emailLoginSchema,
  otpLoginSchema,
  phoneLoginSchema,
  type EmailLoginSchema,
  type OtpLoginSchema,
  type PhoneLoginSchema,
} from '@/schema/login.schema';
import { Form } from '@/components/ui/form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

type LoginMode = 'email' | 'phone' | 'otp';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [mode, setMode] = useState<LoginMode>('email');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const form = useForm<EmailLoginSchema>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const phoneForm = useForm<PhoneLoginSchema>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: {
      phone: '',
    },
  });

  const otpForm = useForm<OtpLoginSchema>({
    resolver: zodResolver(otpLoginSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleEmailSubmit = async (data: EmailLoginSchema) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // simulate latency

    const result = login(data.email, data.password);
    setIsLoading(false);

    if (!result.success) {
      toast.error(result.error ?? 'Login failed.');
      return;
    }
    toast.success('Welcome back!');
    navigate('/', { replace: true });
  };

  const handleSendOtp = (data: PhoneLoginSchema) => {
    if (data.phone.length >= 10) setMode('otp');
  };

  const handleVerifyOtp = (data: OtpLoginSchema) => {
    console.log(data);
    // TODO: wire real OTP verification
    toast.info('OTP verification is not yet connected.');
  };

  const handleQuickLogin = (role: UserRole) => {
    const cred = MOCK_CREDENTIALS.find((c) => c.stage === role);
    if (!cred) return;
    form.setValue('email', cred.email);
    form.setValue('password', cred.password);
    setMode('email');
    setSelectedRole(cred.stageName);
    toast.info(
      `Credentials filled for ${cred.stageName}. Click Sign in to continue.`,
    );
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* ── Header ── */}
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
              <span className="font-medium text-foreground">
                {phoneForm.getValues().phone}
              </span>
            </>
          )}
        </p>
      </div>
      {/* ── Dev Quick Login ── */}
      <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">
              Dev Quick Login
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-amber-300 text-amber-700 hover:bg-amber-100 gap-1 max-w-36 truncate"
              >
                <span className="truncate">
                  {selectedRole ?? 'Select Role'}
                </span>
                <ChevronDown className="h-3 w-3 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 max-h-72 overflow-y-auto"
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Manufacturing Roles
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {MOCK_CREDENTIALS.map((cred) => (
                <DropdownMenuItem
                  key={cred.stage}
                  className="gap-2 cursor-pointer text-sm"
                  onClick={() => handleQuickLogin(cred.stage as UserRole)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{cred.stageName}</span>
                    <span className="text-xs text-muted-foreground">
                      {cred.name}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* ── Login method tabs ── */}
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
      {mode === 'email' && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEmailSubmit)}
            className="space-y-5"
          >
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="gap-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email" className="text-gray-800">
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="gap-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password" className="text-gray-800">
                    Password
                  </FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              className="w-full h-11 font-semibold"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Form>
      )}

      {mode === 'phone' && (
        <Form {...phoneForm}>
          <form
            onSubmit={phoneForm.handleSubmit(handleSendOtp)}
            className="space-y-5"
          >
            <Controller
              name="phone"
              control={phoneForm.control}
              render={({ field, fieldState }) => (
                <Field className="gap-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone" className="text-gray-800">
                    Phone number
                  </FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll send you a one-time verification code via WhatsApp
                  </p>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button className="w-full h-11 font-semibold" size="lg">
              Send verification code
            </Button>
          </form>
        </Form>
      )}

      {mode === 'otp' && (
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
            className="space-y-5"
          >
            <Controller
              name="otp"
              control={otpForm.control}
              render={({ field, fieldState }) => (
                <Field className="gap-2">
                  <FieldLabel htmlFor="otp">
                    OTP <span className="text-destructive">*</span>
                  </FieldLabel>

                  <InputOTP
                    maxLength={6}
                    containerClassName="w-full"
                    {...field}
                    onChange={(val) => {
                      field.onChange(val);
                      setOtp(val);
                    }}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              size="lg"
              disabled={otp.length < 6}
            >
              Verify &amp; sign in
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
        </Form>
      )}
    </div>
  );
}
