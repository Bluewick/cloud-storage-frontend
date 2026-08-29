import React, { useState } from 'react';
import {
  Cloud,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Loader2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PublicHeader from '../components/PublicHeader';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Sidebar } from '../components/layout/Sidebar';
import { DrivePage } from './DrivePage';
import { authApi } from '../api/auth.api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field validation
  const validateField = (name, value) => {
    let errorMsg = '';
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        errorMsg = 'Email address is required';
      } else if (!emailRegex.test(value)) {
        errorMsg = 'Please enter a valid email address';
      }
    }
    if (name === 'password') {
      if (!value) {
        errorMsg = 'Password is required';
      }
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));
    setApiError('');

    if (errors[name]) {
      const err = validateField(name, val);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // 1. Full form validation check
    const emailErr = validateField('email', formData.email);
    const passErr = validateField('password', formData.password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Call your authentication API endpoint directly
      const res = await authApi.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Extract auth payload (adjust property names if your API returns different keys)
      const { token, user } = res.data;

      // 3. Update AuthContext state & localStorage
      login(token, user);

      // 4. Redirect to dashboard
      window.location.href = '/dashboard'; 
      // Or if using react-router: navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <PublicHeader />
    
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased selection:bg-[#EFF6FF] selection:text-[#2563EB]">
      {/* Background subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Logo */}
        <div className="flex justify-center">
          <a href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-sm group-hover:bg-[#1D4ED8] transition-colors">
              <Cloud className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-lg font-bold text-[#0F172A] tracking-tight">Lumina</span>
              <span className="text-lg font-medium text-[#2563EB]">Clarity</span>
            </div>
          </a>
        </div>

        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-[#0F172A]">
          Sign in to your workspace
        </h2>
        <p className="mt-1.5 text-center text-xs text-[#64748B]">
          Enter your credentials to access your secure media vault
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-xl border border-[#E2E8F0] shadow-level-1">
          
          {/* Global API Error Alert */}
          {apiError && (
            <div className="mb-5 p-3.5 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
              <div className="text-xs text-[#B91C1C] leading-relaxed">
                <span className="font-semibold block">Authentication Failed</span>
                {apiError}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="alex@company.com"
                  className={`w-full pl-9 pr-3 py-2 text-xs text-[#0F172A] bg-[#FFFFFF] rounded-lg border transition-colors focus:outline-none focus:ring-1 ${
                    errors.email
                      ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] bg-[#FEF2F2]/10'
                      : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[11px] text-[#EF4444] flex items-center gap-1">
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••••••"
                  className={`w-full pl-9 pr-10 py-2 text-xs text-[#0F172A] bg-[#FFFFFF] rounded-lg border transition-colors focus:outline-none focus:ring-1 ${
                    errors.password
                      ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] bg-[#FEF2F2]/10'
                      : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#475569] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-[11px] text-[#EF4444]">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] focus:ring-offset-0"
                />
                <span className="text-xs text-[#475569]">Keep me logged in for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Social / SSO Alternative */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                <span className="bg-white px-2 text-[#94A3B8] font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-[#CBD5E1] rounded-lg text-xs font-medium text-[#0F172A] bg-white hover:bg-[#F8FAFC] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8 0-1.3.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-[#CBD5E1] rounded-lg text-xs font-medium text-[#0F172A] bg-white hover:bg-[#F8FAFC] transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                <span>SSO / SAML</span>
              </button>
            </div>
          </div>

          {/* Footer note inside card */}
          <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-center">
            <p className="text-xs text-[#475569]">
              Don't have an account?{' '}
              <button onClick={() => navigate('/signup')} className="cursor-pointer font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
                Sign up
              </button>
            </p>
          </div>

        </div>

        {/* Security SLA micro-badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#94A3B8]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
          <span>256-Bit SSL Encrypted Session</span>
        </div>
      </div>
    </div>
    
    </>
  );
}