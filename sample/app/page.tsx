'use client';

import { ChangeEvent, ClipboardEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faArrowLeft,
  faCheck,
  faChevronLeft,
  faCircleCheck,
  faCircleExclamation,
  faClock,
  faGift,
  faLock,
  faMobileScreenButton,
  faShieldHalved,
  faTicket,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

type Step = 'phone' | 'otp' | 'referral' | 'profile' | 'complete';

const persianDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));

const formatPhone = (value: string) => {
  const digits = persianDigits(value).replace(/\D/g, '').slice(0, 11);
  return digits.replace(/(\d{4})(\d{3})(\d{0,4})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '));
};

const isValidIranPhone = (value: string) => /^09\d{9}$/.test(value.replace(/\s/g, ''));

function BrandMark() {
  return (
    <div className="brand" aria-label="سودانه">
      <span className="brand-mark"><i /><b /><em /></span>
      <span className="brand-name">سودانه</span>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const index = ({ phone: 1, otp: 2, referral: 3, profile: 4, complete: 4 } as Record<Step, number>)[step];
  return (
    <div className="stepper" aria-label={`مرحله ${index} از ۴`}>
      {[1, 2, 3, 4].map((item) => <span className={item <= index ? 'active' : ''} key={item} />)}
    </div>
  );
}

function BackButton({ onClick, label = 'بازگشت' }: { onClick: () => void; label?: string }) {
  return <button className="back-button" onClick={onClick} aria-label={label}><FontAwesomeIcon icon={faArrowRight} /></button>;
}

export default function AuthenticationFlow() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [seconds, setSeconds] = useState(61);
  const [resendStatus, setResendStatus] = useState('');
  const [hasReferral, setHasReferral] = useState<boolean | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [profile, setProfile] = useState({ firstName: '', lastName: '', birthDate: '', nationalId: '' });
  const [profileError, setProfileError] = useState('');
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (step !== 'otp' || seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, step]);

  useEffect(() => {
    if (step === 'otp') window.setTimeout(() => inputRefs.current[0]?.focus(), 180);
  }, [step]);

  const phoneDigits = phone.replace(/\s/g, '');
  const phoneInvalid = phoneTouched && phoneDigits.length > 0 && !isValidIranPhone(phone);

  const sendOtp = (event: FormEvent) => {
    event.preventDefault();
    setPhoneTouched(true);
    if (isValidIranPhone(phone)) {
      setOtp(['', '', '', '', '']);
      setOtpError('');
      setSeconds(61);
      setStep('otp');
    }
  };

  const updateOtp = (value: string, index: number) => {
    const digit = persianDigits(value).replace(/\D/g, '').slice(-1);
    const copy = [...otp];
    copy[index] = digit;
    setOtp(copy);
    setOtpError('');
    if (digit && index < 4) inputRefs.current[index + 1]?.focus();
  };

  const pasteOtp = (event: ClipboardEvent<HTMLInputElement>) => {
    const digits = persianDigits(event.clipboardData.getData('text')).replace(/\D/g, '').slice(0, 5).split('');
    if (!digits.length) return;
    event.preventDefault();
    setOtp([...digits, ...Array(5).fill('')].slice(0, 5));
    setOtpError('');
    inputRefs.current[Math.min(digits.length, 4)]?.focus();
  };

  const keyDownOtp = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const verifyOtp = (event: FormEvent) => {
    event.preventDefault();
    if (otp.join('').length < 5) {
      setOtpError('کد تأیید ۵ رقمی را کامل وارد کنید.');
      return;
    }
    setOtpError('');
    setStep('referral');
  };

  const resendOtp = () => {
    setOtp(['', '', '', '', '']);
    setOtpError('');
    setSeconds(61);
    setResendStatus('کد تأیید جدید برای شما ارسال شد.');
    window.setTimeout(() => setResendStatus(''), 3600);
    window.setTimeout(() => inputRefs.current[0]?.focus(), 60);
  };

  const submitProfile = (event: FormEvent) => {
    event.preventDefault();
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      setProfileError('نام و نام خانوادگی را وارد کنید.');
      return;
    }
    if (profile.nationalId && !/^\d{10}$/.test(persianDigits(profile.nationalId))) {
      setProfileError('کد ملی باید ۱۰ رقم باشد.');
      return;
    }
    setProfileError('');
    setStep('complete');
  };

  const updateProfile = (field: keyof typeof profile) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = field === 'nationalId' ? persianDigits(event.target.value).replace(/\D/g, '').slice(0, 10) : event.target.value;
    setProfile((current) => ({ ...current, [field]: value }));
    setProfileError('');
  };

  return (
    <main className="auth-page">
      <section className="mobile-frame">
        <header className="topbar">
          {step !== 'phone' && step !== 'complete' ? <BackButton onClick={() => setStep(step === 'otp' ? 'phone' : step === 'referral' ? 'otp' : 'referral')} /> : <span className="topbar-space" />}
          <BrandMark />
          <span className="topbar-space" />
        </header>

        {step !== 'complete' && <Stepper step={step} />}

        <div className={`screen-content screen-${step}`}>
          {step === 'phone' && (
            <section className="intro-screen">
              <div className="hero-illustration" aria-hidden="true">
                <span className="orbit orbit-one" /><span className="orbit orbit-two" />
                <div className="phone-orb"><FontAwesomeIcon icon={faMobileScreenButton} /></div>
                <div className="reward-orb"><FontAwesomeIcon icon={faGift} /></div>
                <span className="spark spark-one">✦</span><span className="spark spark-two">✦</span>
              </div>
              <div className="heading-group">
                <p className="eyebrow">به سودانه خوش آمدید</p>
                <h1>خرید کنید، پاداش بگیرید</h1>
                <p className="lead">برای ورود یا ساخت حساب، شماره موبایل‌تان را وارد کنید.</p>
              </div>
              <form className="form-stack" onSubmit={sendOtp} noValidate>
                <label className="field-label" htmlFor="phone">شماره موبایل</label>
                <div className={`phone-field ${phoneInvalid ? 'has-error' : ''}`}>
                  <span className="country-code">+۹۸</span>
                  <input
                    id="phone"
                    aria-describedby="phone-help"
                    className="ltr-input"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="۰۹۱۲ ۱۲۳ ۴۵۶۷"
                    value={phone}
                    onChange={(event) => setPhone(formatPhone(event.target.value))}
                    onBlur={() => setPhoneTouched(true)}
                  />
                </div>
                <div id="phone-help" className={phoneInvalid ? 'hint error' : 'hint'}>
                  {phoneInvalid ? <><FontAwesomeIcon icon={faCircleExclamation} /> شماره موبایل را به‌درستی وارد کنید.</> : 'شماره‌ای که به نام خودتان است را وارد کنید.'}
                </div>
                <button className="primary-button" type="submit" disabled={!isValidIranPhone(phone)}>
                  دریافت کد تأیید <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              </form>
              <p className="privacy-copy"><FontAwesomeIcon icon={faShieldHalved} /> با ادامه، قوانین و حریم خصوصی سودانه را می‌پذیرید.</p>
            </section>
          )}

          {step === 'otp' && (
            <section className="flow-screen">
              <div className="icon-badge"><FontAwesomeIcon icon={faLock} /></div>
              <div className="heading-group compact">
                <p className="eyebrow">تأیید شماره موبایل</p>
                <h1>کد تأیید را وارد کنید</h1>
                <p className="lead">کد ۵ رقمی به شماره <span className="phone-inline" dir="ltr">{phone}</span> ارسال شد.</p>
              </div>
              <button className="edit-phone" onClick={() => setStep('phone')}>ویرایش شماره</button>
              <form className="form-stack otp-form" onSubmit={verifyOtp}>
                <div className="otp-group" dir="ltr" aria-label="کد تأیید پنج رقمی">
                  {otp.map((value, index) => (
                    <input key={index} ref={(element) => { inputRefs.current[index] = element; }} value={value} onChange={(event) => updateOtp(event.target.value, index)} onPaste={pasteOtp} onKeyDown={(event) => keyDownOtp(event, index)} inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'} maxLength={1} aria-label={`رقم ${index + 1}`} />
                  ))}
                </div>
                {otpError && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} /> {otpError}</p>}
                <button className="primary-button" type="submit">تأیید و ادامه <FontAwesomeIcon icon={faArrowLeft} /></button>
              </form>
              <div className="resend-box">
                {seconds > 0 ? <p><FontAwesomeIcon icon={faClock} /> ارسال مجدد کد تا <strong dir="ltr">۰:{String(seconds).padStart(2, '0')}</strong> دیگر</p> : <button onClick={resendOtp}>ارسال مجدد کد</button>}
                {resendStatus && <p className="resend-success"><FontAwesomeIcon icon={faCircleCheck} /> {resendStatus}</p>}
              </div>
            </section>
          )}

          {step === 'referral' && (
            <section className="flow-screen referral-screen">
              <div className="icon-badge gift"><FontAwesomeIcon icon={faUserPlus} /></div>
              <div className="heading-group compact">
                <p className="eyebrow">یک قدم تا ساخت حساب</p>
                <h1>کد معرف دارید؟</h1>
                <p className="lead">اگر از طرف یک دوست دعوت شده‌اید، کد او را وارد کنید.</p>
              </div>
              <div className="choice-list" role="radiogroup" aria-label="وضعیت کد معرف">
                <button className={`choice-card ${hasReferral === true ? 'selected' : ''}`} role="radio" aria-checked={hasReferral === true} onClick={() => setHasReferral(true)}><span className="radio-dot" /><span><strong>بله، کد معرف دارم</strong><small>کد دعوت را وارد می‌کنم</small></span><FontAwesomeIcon icon={faChevronLeft} /></button>
                <button className={`choice-card ${hasReferral === false ? 'selected' : ''}`} role="radio" aria-checked={hasReferral === false} onClick={() => setHasReferral(false)}><span className="radio-dot" /><span><strong>خیر، ادامه می‌دهم</strong><small>می‌توانید بعداً هم کد معتبر وارد کنید</small></span><FontAwesomeIcon icon={faChevronLeft} /></button>
              </div>
              {hasReferral === true && <label className="referral-input-wrap"><span className="field-label">کد معرف</span><span className="input-with-icon"><FontAwesomeIcon icon={faTicket} /><input dir="ltr" value={referralCode} onChange={(event) => setReferralCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12))} placeholder="مثلاً ABC123" autoCapitalize="characters" /></span></label>}
              <div className="direct-note"><FontAwesomeIcon icon={faGift} /><p>پاداش معرفی فقط برای دعوت مستقیم ثبت می‌شود؛ هیچ ساختار چندسطحی وجود ندارد.</p></div>
              <button className="primary-button flow-action" disabled={hasReferral === null || (hasReferral && referralCode.length < 4)} onClick={() => setStep('profile')}>ادامه <FontAwesomeIcon icon={faArrowLeft} /></button>
            </section>
          )}

          {step === 'profile' && (
            <section className="flow-screen profile-screen">
              <div className="icon-badge"><FontAwesomeIcon icon={faUserPlus} /></div>
              <div className="heading-group compact">
                <p className="eyebrow">تکمیل حساب کاربری</p>
                <h1>خوشحالیم که اینجایید</h1>
                <p className="lead">برای ارائه تجربه بهتر، اطلاعات زیر را تکمیل کنید.</p>
              </div>
              <form className="profile-form" onSubmit={submitProfile} noValidate>
                <div className="two-fields"><label><span>نام <b>*</b></span><input value={profile.firstName} onChange={updateProfile('firstName')} placeholder="مثلاً مریم" autoComplete="given-name" /></label><label><span>نام خانوادگی <b>*</b></span><input value={profile.lastName} onChange={updateProfile('lastName')} placeholder="مثلاً احمدی" autoComplete="family-name" /></label></div>
                <label><span>تاریخ تولد <small>اختیاری</small></span><input value={profile.birthDate} onChange={updateProfile('birthDate')} placeholder="۱۳۷۵/۰۶/۲۱" inputMode="numeric" /></label>
                <label><span>کد ملی <small>اختیاری</small></span><input dir="ltr" value={profile.nationalId} onChange={updateProfile('nationalId')} placeholder="۰۱۲۳۴۵۶۷۸۹" inputMode="numeric" /></label>
                {profileError && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} /> {profileError}</p>}
                <button className="primary-button" type="submit">تکمیل و ورود به سودانه <FontAwesomeIcon icon={faArrowLeft} /></button>
              </form>
              <button className="text-button" onClick={() => setStep('complete')}>بعداً تکمیل می‌کنم</button>
            </section>
          )}

          {step === 'complete' && (
            <section className="complete-screen">
              <div className="success-visual"><span className="success-ring ring-a" /><span className="success-ring ring-b" /><div><FontAwesomeIcon icon={faCheck} /></div><i>✦</i><b>✦</b></div>
              <div className="heading-group">
                <p className="eyebrow">حساب شما آماده است</p>
                <h1>{profile.firstName ? `${profile.firstName}، خوش آمدی!` : 'به سودانه خوش آمدید!'}</h1>
                <p className="lead">حالا می‌توانید خرید کنید، پاداش بگیرید و دوستانتان را مستقیم دعوت کنید.</p>
              </div>
              <div className="welcome-card"><span><FontAwesomeIcon icon={faGift} /></span><div><strong>کیف پول پاداش شما فعال شد</strong><p>پاداش خریدهای تأییدشده در اینجا ثبت می‌شود.</p></div></div>
              <button className="primary-button" onClick={() => { setStep('phone'); setPhone(''); setPhoneTouched(false); setHasReferral(null); setReferralCode(''); setProfile({ firstName: '', lastName: '', birthDate: '', nationalId: '' }); }}>ورود به صفحه اصلی <FontAwesomeIcon icon={faArrowLeft} /></button>
            </section>
          )}
        </div>

        {step !== 'complete' && <footer className="support-footer">مشکلی دارید؟ <button>ارتباط با پشتیبانی</button></footer>}
      </section>
    </main>
  );
}
