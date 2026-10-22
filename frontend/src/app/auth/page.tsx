'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { PhoneStep } from '@/components/auth/phone-step';
import { OtpStep } from '@/components/auth/otp-step';
import { ReferralStep } from '@/components/auth/referral-step';
import { ProfileStep } from '@/components/auth/profile-step';
import { WelcomeStep } from '@/components/auth/welcome-step';
import { authService, toEnglishDigits } from '@/services/auth.service';
import { referralService } from '@/services/referral.service';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';
import { safeReturnPath } from '@/lib/access';

type AuthStep = 0 | 1 | 2 | 3 | 4;

function AuthFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = safeReturnPath(searchParams.get('redirect'));

  const [step, setStep] = useState<AuthStep>(0);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState<string | undefined>();
  const [referralCode, setReferralCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, user, refreshProfile, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (step === 0 && !authLoading && isAuthenticated) router.replace(redirectUrl);
  }, [step, authLoading, isAuthenticated, router, redirectUrl]);

  // Send OTP handler
  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await authService.sendOtp(phone);
      setDevCode(res.devCode);
      if (res.phone) {
        setPhone(res.phone);
      }
      if (res.devCode) {
        toast.info(`کد تأیید تستی (توسعه): ${res.devCode}`, { duration: 6000 });
      } else {
        toast.success('کد تأیید به شماره شما ارسال شد.');
      }
      setStep(1);
    } catch (err: any) {
      toast.error(err.message || 'خطا در ارسال کد تأیید');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const finalCode = codeToVerify || code;
    if (!finalCode || finalCode.length < 4) return;

    setIsLoading(true);
    try {
      const res = await authService.verifyOtp(phone, finalCode);
      await login(res.user, res.token);

      if (res.isNewUser) {
        toast.success('شماره شما با موفقیت تأیید شد.');
        setStep(2); // Go to referral step
      } else {
        toast.success(`${res.user.firstName || 'کاربر گرامی'}، خوش آمدید!`);
        router.replace(redirectUrl);
      }
    } catch (err: any) {
      toast.error(err.message || 'کد وارد شده نامعتبر است');
    } finally {
      setIsLoading(false);
    }
  };

  // Referral step handlers
  const handleBindReferral = async (submittedReferral: string) => {
    setIsLoading(true);
    try {
      if (submittedReferral) {
        const bindRes = await referralService.bindReferral(submittedReferral);
        if (bindRes.success) {
          toast.success('کد معرف با موفقیت اعمال شد.');
        }
      }
    } catch {
      // Ignore referral bind error to not block user registration
    } finally {
      setIsLoading(false);
      setStep(3); // Go to profile step
    }
  };

  // Profile completion handler
  const handleCompleteProfile = async () => {
    setIsLoading(true);
    try {
      await authService.updateProfile({
        firstName,
        lastName,
        nationalId: nationalId ? toEnglishDigits(nationalId) : undefined,
        birthDate: birthDate || undefined,
      });
      await refreshProfile();
      toast.success('اطلاعات کاربری با موفقیت ذخیره شد.');
      setStep(4); // Welcome screen
    } catch (err: any) {
      toast.error(err.message || 'خطا در ذخیره مشخصات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    router.replace(redirectUrl);
  };

  const stepCount = 5;

  return (
    <div className="flex flex-col min-h-[90vh]">
      {/* Top Bar (back button on sub-steps) */}
      {step > 0 && step < 4 ? (
        <div className="h-[44px] flex items-center justify-end px-1 mb-2">
          <button
            type="button"
            onClick={() => setStep((prev) => Math.max(0, prev - 1) as AuthStep)}
            className="w-[32px] h-[32px] rounded-[9px] border border-[#dfe6e2] bg-white text-[#50635a] flex items-center justify-center hover:bg-slate-50 transition-colors"
            aria-label="بازگشت"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="h-2" />
      )}

      {/* Stepper Progress Bar */}
      {step < 4 && (
        <div className="flex items-center gap-1.5 px-1 mb-5" dir="ltr">
          {Array.from({ length: stepCount - 1 }).map((_, i) => (
            <span
              key={i}
              className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-sn-green' : 'bg-[#e8eeeb]'
              }`}
            />
          ))}
        </div>
      )}

      {/* Main Step Content */}
      <div className="flex-1 pb-6">
        {step === 0 && (
          <PhoneStep
            phone={phone}
            onChangePhone={setPhone}
            onSubmit={handleSendOtp}
            isLoading={isLoading}
          />
        )}

        {step === 1 && (
          <OtpStep
            phone={phone}
            code={code}
            devCode={devCode}
            onChangeCode={setCode}
            onSubmit={handleVerifyOtp}
            onResend={handleSendOtp}
            onBack={() => setStep(0)}
            isLoading={isLoading}
          />
        )}

        {step === 2 && (
          <ReferralStep
            referralCode={referralCode}
            onChangeReferralCode={setReferralCode}
            onSubmit={handleBindReferral}
            onSkip={() => setStep(3)}
            isLoading={isLoading}
          />
        )}

        {step === 3 && (
          <ProfileStep
            firstName={firstName}
            lastName={lastName}
            birthDate={birthDate}
            nationalId={nationalId}
            onChangeFirstName={setFirstName}
            onChangeLastName={setLastName}
            onChangeBirthDate={setBirthDate}
            onChangeNationalId={setNationalId}
            onSubmit={handleCompleteProfile}
            onSkip={() => setStep(4)}
            isLoading={isLoading}
          />
        )}

        {step === 4 && (
          <WelcomeStep
            userName={firstName || user?.firstName}
            onFinish={handleFinish}
          />
        )}
      </div>

      {/* Footer link to Support */}
      {step !== 4 && (
        <footer className="pt-4 pb-2 text-center text-[11px] text-[#89948e] select-none">
          مشکلی دارید؟{' '}
          <Link
            href="/support"
            className="text-sn-green font-extrabold hover:underline"
          >
            ارتباط با پشتیبانی
          </Link>
        </footer>
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <AppShell hasBottomNav={false} className="pt-1">
      <TopPromo />
      <div className="pt-2">
        <Suspense fallback={<div className="p-8 text-center text-sn-muted text-xs">در حال بارگذاری...</div>}>
          <AuthFlow />
        </Suspense>
      </div>
    </AppShell>
  );
}
