import { useMemo, useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

type SignupStep = 1 | 2;
type Gender = 'male' | 'female' | 'other';

export default function SignupPage({ onNavigate }: SignupPageProps) {
  const { signup } = useAuth();
  const [step, setStep] = useState<SignupStep>(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const progress = useMemo(() => (step === 1 ? 50 : 100), [step]);

  const handleNext = (e?: FormEvent) => {
    e?.preventDefault();
    setError('');

    if (!fullName || !email || !age || !height || !weight) {
      setError('Please complete your profile details before continuing.');
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword) {
      setError('Please complete your account credentials.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        username,
        email,
        password,
        confirmPassword,
        fullName,
        age: Number(age),
        gender,
        height: Number(height),
        weight: Number(weight),
      } as any);
      onNavigate('dashboard');
    } catch {
      setError('Sign up failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="auth-bg">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-blob auth-blob-3" />
        <div className="auth-noise" />
      </div>

      <div className="signup-card glass-card-strong nd-scale-in">
        <div className="signup-logo nd-fade-up">
          <div className="logo-mark">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L28 26H4L16 2Z" fill="url(#logoGrad)" opacity="0.9"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF6B9D"/>
                  <stop offset="100%" stopColor="#8B5CF6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-name">NDURANCE</span>
        </div>

        <div className="signup-header nd-fade-up delay-1">
          <h2>Create your premium profile</h2>
          <p>Set up your athlete-ready studio profile with a refined multi-step onboarding flow.</p>
        </div>

        <div className="signup-progress nd-fade-up delay-2">
          <div className="signup-progress-bar">
            <div className="signup-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="signup-progress-label">Step {step} of 2</div>
        </div>

        {error && (
          <div className="signup-error nd-fade-in">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext} className="signup-form nd-fade-up delay-2">
            <div className="signup-section signup-section--single">
              <div className="section-label">Athlete profile</div>
              <p className="section-copy">Your capture lab experience is tailored to the body profile you share.</p>

              <div className="nd-input-wrap">
                <input id="signup-full-name" className="nd-input" type="text" placeholder=" " value={fullName} onChange={e => setFullName(e.target.value)} autoComplete="name" />
                <label className="nd-label" htmlFor="signup-full-name">Full Name</label>
              </div>

              <div className="nd-input-wrap">
                <input id="signup-email" className="nd-input" type="email" placeholder=" " value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                <label className="nd-label" htmlFor="signup-email">Email</label>
              </div>

              <div className="signup-row">
                <div className="nd-input-wrap">
                  <input id="signup-age" className="nd-input" type="number" placeholder=" " value={age} onChange={e => setAge(e.target.value)} min="16" max="100" />
                  <label className="nd-label" htmlFor="signup-age">Age</label>
                </div>
                <div className="nd-input-wrap">
                  <div className="gender-segmented" role="radiogroup" aria-label="Gender selection">
                    {(['male', 'female', 'other'] as Gender[]).map(option => (
                      <button
                        key={option}
                        type="button"
                        className={`gender-chip ${gender === option ? 'active' : ''}`}
                        onClick={() => setGender(option)}
                      >
                        {option === 'male' ? 'Male' : option === 'female' ? 'Female' : 'Other'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="signup-row">
                <div className="nd-input-wrap">
                  <input id="signup-height" className="nd-input" type="number" placeholder=" " value={height} onChange={e => setHeight(e.target.value)} min="100" max="250" />
                  <label className="nd-label" htmlFor="signup-height">Height (cm)</label>
                </div>
                <div className="nd-input-wrap">
                  <input id="signup-weight" className="nd-input" type="number" placeholder=" " value={weight} onChange={e => setWeight(e.target.value)} min="40" max="220" />
                  <label className="nd-label" htmlFor="signup-weight">Weight (kg)</label>
                </div>
              </div>

              <div className="signup-actions">
                <button type="submit" className="nd-btn nd-btn-primary nd-btn-full nd-btn-lg">Continue</button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="signup-form nd-fade-up delay-2">
            <div className="signup-section signup-section--single">
              <div className="section-label">Account setup</div>
              <p className="section-copy">Create your secure coaching identity for NDURANCE.</p>

              <div className="nd-input-wrap">
                <input id="signup-username" className="nd-input" type="text" placeholder=" " value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" />
                <label className="nd-label" htmlFor="signup-username">Username</label>
              </div>

              <div className="nd-input-wrap">
                <input id="signup-password" className="nd-input" type={showPassword ? 'text' : 'password'} placeholder=" " value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" style={{ paddingRight: '52px' }} />
                <label className="nd-label" htmlFor="signup-password">Password</label>
                <button type="button" className="pass-toggle" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="nd-input-wrap">
                <input id="signup-confirm-password" className="nd-input" type={showConfirm ? 'text' : 'password'} placeholder=" " value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" style={{ paddingRight: '52px' }} />
                <label className="nd-label" htmlFor="signup-confirm-password">Confirm Password</label>
                <button type="button" className="pass-toggle" onClick={() => setShowConfirm(s => !s)} aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="signup-actions signup-actions--split">
                <button type="button" className="nd-btn nd-btn-ghost nd-btn-full" onClick={() => setStep(1)}>Back</button>
                <button type="submit" className="nd-btn nd-btn-primary nd-btn-full nd-btn-lg" disabled={isLoading}>
                  {isLoading ? 'Creating account…' : 'Create premium account'}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="signup-note">
          Already have an account?{' '}
          <button className="signup-link" type="button" onClick={() => onNavigate('login')}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
