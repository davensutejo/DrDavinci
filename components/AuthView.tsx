
import React, { useState, useMemo } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

interface ValidationErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, text: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    
    const strengthMap = {
      0: { text: 'Very Weak', color: 'bg-red-500' },
      1: { text: 'Weak', color: 'bg-orange-500' },
      2: { text: 'Fair', color: 'bg-yellow-500' },
      3: { text: 'Good', color: 'bg-lime-500' },
      4: { text: 'Strong', color: 'bg-green-500' },
      5: { text: 'Very Strong', color: 'bg-emerald-600' }
    };
    return { score: Math.min(score, 5), ...strengthMap[Math.min(score, 5) as keyof typeof strengthMap] };
  }, [password]);

  const validateSignupForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!name.trim()) {
      errors.name = 'Full name is required';
    }

    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[a-z]/.test(password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[A-Z]/.test(password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/\d/.test(password)) {
      errors.password = 'Password must contain at least one number';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (password && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateLoginForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && !validateSignupForm()) return;
    if (isLogin && !validateLoginForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await authService.login(username, password, rememberMe);
        if (result.success && result.user) {
          onLogin(result.user);
        } else {
          setError(result.error || 'Invalid username or password');
        }
      } else {
        const result = await authService.signup(username, password, name, email);
        if (result.success && result.user) {
          onLogin(result.user);
        } else {
          setError(result.error || 'Signup failed');
        }
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl shadow-slate-900/30 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-8 pb-4 text-center bg-gradient-to-b from-slate-50 to-white">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">Dr. Davinci</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Advanced Clinical Support System</p>
        </div>

        <div className="px-8 flex border-b border-slate-200">
          <button 
            type="button"
            disabled={isLoading}
            onClick={() => {
              setIsLogin(true);
              setValidationErrors({});
              setError('');
            }}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${isLogin ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Sign In
          </button>
          <button 
            type="button"
            disabled={isLoading}
            onClick={() => {
              setIsLogin(false);
              setValidationErrors({});
              setError('');
            }}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${!isLogin ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-200 animate-in slide-in-from-top duration-300 flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          {!isLogin && (
            <div className="animate-in slide-in-from-left-2 duration-300">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 ml-1">Full Name</label>
              <input 
                type="text" 
                autoComplete="name"
                value={name} 
                disabled={isLoading}
                onChange={e => {
                  setName(e.target.value);
                  if (validationErrors.name) setValidationErrors({ ...validationErrors, name: undefined });
                }}
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all outline-none ${validationErrors.name ? 'border-red-300' : 'border-slate-200 hover:border-slate-300'}`}
                placeholder="Dr. Jane Smith"
              />
              {validationErrors.name && <p className="text-xs text-red-600 mt-1.5 ml-1 font-medium">{validationErrors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 ml-1">Username</label>
            <input 
              type="text" 
              autoComplete="username"
              value={username} 
              disabled={isLoading}
              onChange={e => {
                setUsername(e.target.value);
                if (validationErrors.username) setValidationErrors({ ...validationErrors, username: undefined });
              }}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all outline-none ${validationErrors.username ? 'border-red-300' : 'border-slate-200 hover:border-slate-300'}`}
              placeholder="medical_id_2024"
            />
            {validationErrors.username && <p className="text-xs text-red-600 mt-1.5 ml-1 font-medium">{validationErrors.username}</p>}
          </div>

          {!isLogin && (
            <div className="animate-in slide-in-from-left-2 duration-300">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 ml-1">Email</label>
              <input 
                type="email" 
                autoComplete="email"
                value={email} 
                disabled={isLoading}
                onChange={e => {
                  setEmail(e.target.value);
                  if (validationErrors.email) setValidationErrors({ ...validationErrors, email: undefined });
                }}
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all outline-none ${validationErrors.email ? 'border-red-300' : 'border-slate-200 hover:border-slate-300'}`}
                placeholder="you@example.com"
              />
              {validationErrors.email && <p className="text-xs text-red-600 mt-1.5 ml-1 font-medium">{validationErrors.email}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password} 
                disabled={isLoading}
                onChange={e => {
                  setPassword(e.target.value);
                  if (validationErrors.password) setValidationErrors({ ...validationErrors, password: undefined });
                }}
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all outline-none ${validationErrors.password ? 'border-red-300' : 'border-slate-200 hover:border-slate-300'}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"></path><path d="M15.171 13.576l1.474 1.474a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.474 1.474A10.014 10.014 0 00.458 10C1.732 14.057 5.522 17 10 17a9.958 9.958 0 004.512-1.074l1.159 1.159z"></path></svg>
                )}
              </button>
            </div>
            {validationErrors.password && <p className="text-xs text-red-600 mt-1.5 ml-1 font-medium">{validationErrors.password}</p>}
            
            {!isLogin && password && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-600">Password Strength</span>
                  <span className={`text-xs font-bold ${passwordStrength.score < 2 ? 'text-red-600' : passwordStrength.score < 4 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
                <ul className="text-xs text-slate-600 mt-3 space-y-1">
                  <li className={password.length >= 8 ? 'text-green-600' : ''}>✓ At least 8 characters</li>
                  <li className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-600' : ''}>✓ Mix of uppercase and lowercase</li>
                  <li className={/\d/.test(password) ? 'text-green-600' : ''}>✓ Contains numbers</li>
                </ul>
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="animate-in slide-in-from-left-2 duration-300">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 ml-1">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  autoComplete="new-password"
                  value={confirmPassword} 
                  disabled={isLoading}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    // Real-time validation feedback
                    if (!validationErrors.confirmPassword) return;
                    
                    if (e.target.value && password && e.target.value === password) {
                      setValidationErrors({ ...validationErrors, confirmPassword: undefined });
                    }
                  }}
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all outline-none ${validationErrors.confirmPassword ? 'border-red-300 focus:ring-red-500/50' : 'border-slate-200 hover:border-slate-300'}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"></path><path d="M15.171 13.576l1.474 1.474a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.474 1.474A10.014 10.014 0 00.458 10C1.732 14.057 5.522 17 10 17a9.958 9.958 0 004.512-1.074l1.159 1.159z"></path></svg>
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && <p className="text-xs text-red-600 mt-1.5 ml-1 font-medium flex items-center gap-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18.101 12.93a.75.75 0 000-1.06l-7.783-7.783a.75.75 0 00-1.06 1.061L16.939 12l-7.682 7.682a.75.75 0 101.06 1.06l7.783-7.783z" clipRule="evenodd" /><path fillRule="evenodd" d="M9.283 12.93a.75.75 0 000-1.06L1.5 4.147a.75.75 0 00-1.06 1.06L8.223 12l-7.783 7.783a.75.75 0 101.06 1.06l7.782-7.783z" clipRule="evenodd" /></svg>{validationErrors.confirmPassword}</p>}
              {confirmPassword && password && confirmPassword === password && !validationErrors.confirmPassword && (
                <p className="text-xs text-green-600 mt-1.5 ml-1 font-medium flex items-center gap-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Passwords match</p>
              )}
            </div>
          )}

          {isLogin && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded border-slate-300 text-teal-600 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-slate-600 font-medium cursor-pointer hover:text-slate-700">
                Remember me for 30 days
              </label>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading || Object.keys(validationErrors).length > 0}
            className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-6 flex items-center justify-center gap-2 ${isLoading || Object.keys(validationErrors).length > 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-teal-600 to-teal-700 shadow-teal-500/25 hover:shadow-teal-500/40 hover:from-teal-700 hover:to-teal-800 active:scale-[0.98]'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              isLogin ? 'Sign In Securely' : 'Create Medical Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthView;
