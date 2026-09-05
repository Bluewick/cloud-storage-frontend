import React, { useState, useMemo } from 'react';
import {
  Cloud,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  X,
  ArrowRight,
  Loader2,
  HardDrive,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PublicHeader from '../components/PublicHeader';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';

export default function Signup() {

  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live password requirements evaluation
  const passwordChecks = useMemo(() => {
    const pass = formData.password;
    return {
      minLength: pass.length >= 8,
      hasUpper: /[A-Z]/.test(pass),
      hasLower: /[a-z]/.test(pass),
      hasNumber: /[0-9]/.test(pass),
      hasSpecial: /[^A-Za-z0-9]/.test(pass),
    };
  }, [formData.password]);

  // Password strength calculation (0 to 4)
  const strengthScore = useMemo(() => {
    let score = 0;
    if (passwordChecks.minLength) score += 1;
    if (passwordChecks.hasUpper && passwordChecks.hasLower) score += 1;
    if (passwordChecks.hasNumber) score += 1;
    if (passwordChecks.hasSpecial) score += 1;
    return score;
  }, [passwordChecks]);

  const strengthConfig = [
    { label: 'Too Weak', color: 'bg-[#EF4444]', textColor: 'text-[#EF4444]', width: '25%' },
    { label: 'Fair', color: 'bg-[#F59E0B]', textColor: 'text-[#F59E0B]', width: '50%' },
    { label: 'Good', color: 'bg-[#3B82F6]', textColor: 'text-[#3B82F6]', width: '75%' },
    { label: 'Very Strong', color: 'bg-[#10B981]', textColor: 'text-[#10B981]', width: '100%' },
  ];

  // Dynamic Validation
  const validateField = (name, value) => {
    let error = '';
    if (name === 'fullName') {
      const nameRegex = /^[a-zA-Z\s.'-]+$/;
      if (!value.trim()) {
        error = 'Full name is required';
      } else if (value.trim().length < 2) {
        error = 'Name must be at least 2 characters';
      } else if (!nameRegex.test(value.trim())) {
        error = 'Invalid characters in name';
      }
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        error = 'Email is required';
      } else if (!emailRegex.test(value)) {
        error = 'Please enter a valid email address';
      }
    }
    if (name === 'password') {
      if (!value) {
        error = 'Password is required';
      } else if (value.length < 8) {
        error = 'Password must be at least 8 characters';
      }
    }
    if (name === 'confirmPassword') {
      if (!value) {
        error = 'Please confirm your password';
      } else if (value !== formData.password) {
        error = 'Passwords do not match';
      }
    }
    return error;
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

    if (name === 'password' && formData.confirmPassword) {
      if (val !== formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setApiError('');

  // 1. Full form validation check
  const fnErr = validateField('fullName', formData.fullName);
  const emErr = validateField('email', formData.email);
  const pwErr = validateField('password', formData.password);
  const cpErr = validateField('confirmPassword', formData.confirmPassword);

  let termsErr = '';
  if (!formData.agreeTerms) {
    termsErr = 'You must agree to the Terms of Service';
  }

  if (fnErr || emErr || pwErr || cpErr || termsErr) {
    setErrors({
      fullName: fnErr,
      email: emErr,
      password: pwErr,
      confirmPassword: cpErr,
      agreeTerms: termsErr,
    });
    return;
  }

  setIsSubmitting(true);

  try {
    // 2. Call your registration API endpoint directly
    const res = await authApi.register({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });

    // Extract auth payload returned by the registration endpoint
    const { token, user } = res.data;

    // 3. Log the user in immediately using AuthContext
    login(token, user);

    // 4. Redirect to dashboard
    window.location.href = '/dashboard';
    // Or if using react-router: navigate('/dashboard');
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      'Registration failed. Please try again.';
    setApiError(message);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <>
    <PublicHeader />
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased selection:bg-[#EFF6FF] selection:text-[#2563EB]">
      {/* Background radial wash */}
      <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        {/* Brand Header */}


        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-[#0F172A]">
          Create your account
        </h2>
        
        {/* Automatic 5GB Onboarding Pill */}
        <div className="mt-2.5 flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-semibold text-[#047857]">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Default 5.0 GB Cloud Storage</span>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-xl border border-[#E2E8F0] shadow-level-1">
          
          {/* API Error Box */}
          {apiError && (
            <div className="mb-5 p-3.5 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
              <div className="text-xs text-[#B91C1C] leading-relaxed">
                <span className="font-semibold block">Registration Error</span>
                {apiError}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Alex Mercer"
                  className={`w-full pl-9 pr-3 py-2 text-xs text-[#0F172A] bg-white rounded-lg border transition-colors focus:outline-none focus:ring-1 ${
                    errors.fullName
                      ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] bg-[#FEF2F2]/10'
                      : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-[11px] text-[#EF4444]">{errors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Email Address
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
                  placeholder="alex@email.com"
                  className={`w-full pl-9 pr-3 py-2 text-xs text-[#0F172A] bg-white rounded-lg border transition-colors focus:outline-none focus:ring-1 ${
                    errors.email
                      ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] bg-[#FEF2F2]/10'
                      : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[11px] text-[#EF4444]">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Create Password
              </label>
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
                  placeholder="Must be at least 8 characters"
                  className={`w-full pl-9 pr-10 py-2 text-xs text-[#0F172A] bg-white rounded-lg border transition-colors focus:outline-none focus:ring-1 ${
                    errors.password
                      ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] bg-[#FEF2F2]/10'
                      : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#475569] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-[11px] text-[#EF4444]">{errors.password}</p>
              )}

              {/* Password Safety Meter */}
              {formData.password && (
                <div className="mt-2.5 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B] font-medium">Password Safety:</span>
                    <span className={`font-bold ${strengthScore > 0 ? strengthConfig[strengthScore - 1].textColor : 'text-[#94A3B8]'}`}>
                      {strengthScore > 0 ? strengthConfig[strengthScore - 1].label : 'Too Short'}
                    </span>
                  </div>

                  <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strengthScore > 0 ? strengthConfig[strengthScore - 1].color : 'w-0'}`}
                      style={{ width: strengthScore > 0 ? strengthConfig[strengthScore - 1].width : '0%' }}
                    />
                  </div>

                  {/* Requirements Checklist */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${passwordChecks.minLength ? 'text-[#10B981]' : 'text-[#94A3B8]'}`}>
                      {passwordChecks.minLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>8+ Characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordChecks.hasNumber ? 'text-[#10B981]' : 'text-[#94A3B8]'}`}>
                      {passwordChecks.hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>1+ Number</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordChecks.hasUpper && passwordChecks.hasLower ? 'text-[#10B981]' : 'text-[#94A3B8]'}`}>
                      {passwordChecks.hasUpper && passwordChecks.hasLower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Upper & lowercase</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordChecks.hasSpecial ? 'text-[#10B981]' : 'text-[#94A3B8]'}`}>
                      {passwordChecks.hasSpecial ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>1+ Special symbol</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Re-enter password"
                  className={`w-full pl-9 pr-10 py-2 text-xs text-[#0F172A] bg-white rounded-lg border transition-colors focus:outline-none focus:ring-1 ${
                    errors.confirmPassword
                      ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] bg-[#FEF2F2]/10'
                      : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute cursor-pointer   inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#475569] transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-[11px] text-[#EF4444]">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                />
                <span className="text-xs text-[#475569]">
                  I accept the{' '}
                  <a href="/terms" className="text-[#2563EB] font-semibold hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-[#2563EB] font-semibold hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="mt-1 text-[11px] text-[#EF4444]">{errors.agreeTerms}</p>
              )}
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 cursor-pointer rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Card Footer Link */}
          <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-center">
            <p className="text-xs text-[#475569]">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="cursor-pointer font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
                Sign in
              </button>
            </p>
          </div>

        </div>

        {/* Security SLA micro-badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#94A3B8]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Zero-knowledge client keys & granular folder permissions</span>
        </div>
      </div>
    </div>
    </>
  );
}