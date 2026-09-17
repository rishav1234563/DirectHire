import React, { useState } from 'react';
import { useApp, RegisterPayload } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  GraduationCap,
  Building2,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Send,
  Building,
  School,
} from 'lucide-react';

export const LoginPage: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { login, register, loginAsDemoUser, allUsers } = useApp();

  const [authMode, setAuthMode] = useState<'signin' | 'register' | 'magic'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Sign in state
  const [email, setEmail] = useState('aarav.sharma@aktu.ac.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('password123');
  const [regOrg, setRegOrg] = useState('');
  const [regTitle, setRegTitle] = useState('');
  const [regDegree, setRegDegree] = useState('B.Tech / B.S. in Computer Science');
  const [regGradYear, setRegGradYear] = useState(2026);

  // Magic link state
  const [magicEmail, setMagicEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = login(email, password);
    if (!result.success) {
      setErrorMessage(result.error || 'Authentication failed. Please check credentials.');
    } else {
      if (onSuccess) onSuccess();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const payload: RegisterPayload = {
      role: selectedRole,
      name: regName,
      email: regEmail,
      password: regPassword,
      organizationOrUniversity: regOrg,
      title: regTitle || undefined,
      degree: selectedRole === 'student' ? regDegree : undefined,
      graduationYear: selectedRole === 'student' ? Number(regGradYear) : undefined,
    };

    const result = register(payload);
    if (!result.success) {
      setErrorMessage(result.error || 'Registration failed.');
    } else {
      if (onSuccess) onSuccess();
    }
  };

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicEmail.trim()) return;

    // Simulate magic link verification
    setMagicSent(true);
    setTimeout(() => {
      const existingUser = allUsers.find(
        (u) => u.email.toLowerCase() === magicEmail.trim().toLowerCase()
      );
      if (existingUser) {
        loginAsDemoUser(existingUser.id);
        if (onSuccess) onSuccess();
      } else {
        // Auto-provision candidate
        register({
          role: 'student',
          name: magicEmail.split('@')[0],
          email: magicEmail,
          organizationOrUniversity: 'Verified Institution',
        });
        if (onSuccess) onSuccess();
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-stone-100/80 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo & Headline */}
        <div className="inline-flex items-center justify-center space-x-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-stone-900">
            DirectHire
          </span>
        </div>
        <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
          Role-Based Authentication
        </h2>
        <p className="mt-1 text-xs text-stone-600">
          Direct skill discovery platform with verified domain credentials & RBAC authorization
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-stone-200">
          {/* Top Quick Demo Persona Bar */}
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600" />
                Quick 1-Click Role Login
              </span>
              <span className="text-[10px] text-amber-700 font-mono">Password: password123</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="quick-login-student"
                onClick={() => {
                  loginAsDemoUser('student-1');
                  if (onSuccess) onSuccess();
                }}
                className="p-2 text-left bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl transition-all shadow-2xs group"
              >
                <div className="flex items-center space-x-1.5 mb-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span className="text-[11px] font-bold text-stone-900 truncate">
                    Student
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 truncate">Aarav (AKTU)</div>
              </button>

              <button
                type="button"
                id="quick-login-recruiter"
                onClick={() => {
                  loginAsDemoUser('recruiter-1');
                  if (onSuccess) onSuccess();
                }}
                className="p-2 text-left bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl transition-all shadow-2xs group"
              >
                <div className="flex items-center space-x-1.5 mb-0.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span className="text-[11px] font-bold text-stone-900 truncate">
                    Recruiter
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 truncate">Sarah (CloudScale)</div>
              </button>

              <button
                type="button"
                id="quick-login-admin"
                onClick={() => {
                  loginAsDemoUser('admin-1');
                  if (onSuccess) onSuccess();
                }}
                className="p-2 text-left bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl transition-all shadow-2xs group"
              >
                <div className="flex items-center space-x-1.5 mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span className="text-[11px] font-bold text-stone-900 truncate">
                    Admin
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 truncate">Elena (Trust Lead)</div>
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-stone-200 mb-6 text-xs font-bold">
            <button
              id="tab-auth-signin"
              onClick={() => {
                setAuthMode('signin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
                authMode === 'signin'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign In
            </button>
            <button
              id="tab-auth-register"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
                authMode === 'register'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Create Account
            </button>
            <button
              id="tab-auth-magic"
              onClick={() => {
                setAuthMode('magic');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
                authMode === 'magic'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Magic Link
            </button>
          </div>

          {/* Error / Alert Display */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    id="signin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu or name@company.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-semibold text-stone-700">
                    Password
                  </label>
                  <span className="text-[10px] text-stone-400 font-mono">
                    Default: password123
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-9 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs">Remember this device</span>
                </label>
                <button
                  type="button"
                  onClick={() => setAuthMode('magic')}
                  className="text-amber-700 hover:text-amber-800 font-semibold"
                >
                  Passwordless Login?
                </button>
              </div>

              <button
                id="submit-signin-button"
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-white font-bold bg-amber-600 hover:bg-amber-700 shadow-sm transition-colors flex items-center justify-center space-x-2 mt-2"
              >
                <span>Sign In to DirectHire</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 2. REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              {/* Role Picker */}
              <div>
                <label className="block font-semibold text-stone-700 mb-2">
                  Select Your Platform Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedRole === 'student'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-amber-700 mb-1" />
                    <div className="font-bold text-xs">Candidate</div>
                    <div className="text-[10px] text-stone-500">Student / Grad</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('recruiter')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedRole === 'recruiter'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-700 mb-1" />
                    <div className="font-bold text-xs">Recruiter</div>
                    <div className="text-[10px] text-stone-500">Corporate HR</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedRole === 'admin'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-500'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-700 mb-1" />
                    <div className="font-bold text-xs">Admin</div>
                    <div className="text-[10px] text-stone-500">Trust & Ops</div>
                  </button>
                </div>
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {selectedRole === 'student'
                      ? 'University Email'
                      : selectedRole === 'recruiter'
                      ? 'Corporate Work Email'
                      : 'Admin Email'}
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder={
                      selectedRole === 'student'
                        ? 'alex@aktu.ac.in or alex@edu'
                        : 'alex@company.com'
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                  {selectedRole === 'recruiter' && (
                    <p className="text-[10px] text-amber-800 mt-1 font-medium">
                      * Must use corporate domain (e.g., @company.com). Free email providers are blocked.
                    </p>
                  )}
                </div>
              </div>

              {/* Role Specific Fields */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {selectedRole === 'student'
                    ? 'College / University Name'
                    : 'Company / Organization Name'}
                </label>
                <input
                  type="text"
                  required
                  value={regOrg}
                  onChange={(e) => setRegOrg(e.target.value)}
                  placeholder={
                    selectedRole === 'student'
                      ? 'e.g. Dr. A.P.J. Abdul Kalam Technical University'
                      : 'e.g. Stripe, CloudScale Inc, Acme Corp'
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              {selectedRole === 'student' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Degree Program
                    </label>
                    <input
                      type="text"
                      value={regDegree}
                      onChange={(e) => setRegDegree(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Graduation Year
                    </label>
                    <select
                      value={regGradYear}
                      onChange={(e) => setRegGradYear(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    >
                      <option value={2024}>2024 (Recent Grad)</option>
                      <option value={2025}>2025 (Senior)</option>
                      <option value={2026}>2026 (Junior)</option>
                      <option value={2027}>2027 (Sophomore)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Job Title / Function
                  </label>
                  <input
                    type="text"
                    value={regTitle}
                    onChange={(e) => setRegTitle(e.target.value)}
                    placeholder="e.g. Technical Recruiter, VP Engineering"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-mono"
                />
              </div>

              <button
                id="submit-register-button"
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-white font-bold bg-amber-600 hover:bg-amber-700 shadow-sm transition-colors flex items-center justify-center space-x-2 mt-2"
              >
                <span>Complete Registration & Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 3. MAGIC LINK FORM */}
          {authMode === 'magic' && (
            <div className="space-y-4 text-xs">
              <p className="text-stone-600 leading-relaxed">
                Enter your institutional or company email address to receive a zero-password login link:
              </p>

              {magicSent ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-emerald-900">
                    Magic Link Dispatched
                  </div>
                  <p className="text-xs text-emerald-800">
                    Authenticating session for <strong>{magicEmail}</strong>...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={magicEmail}
                        onChange={(e) => setMagicEmail(e.target.value)}
                        placeholder="you@aktu.ac.in or you@company.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl text-white font-bold bg-amber-600 hover:bg-amber-700 shadow-sm transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Magic Link & Enter</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* RBAC Permission Matrix Summary Card */}
        <div className="mt-6 bg-white rounded-2xl p-5 border border-stone-200 text-xs text-stone-600 space-y-3">
          <div className="font-bold text-stone-800 uppercase tracking-wider text-[10px] flex items-center justify-between">
            <span>DirectHire RBAC Security Matrix</span>
            <span className="text-emerald-700 font-mono">Enforced Client & Server</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <div className="font-bold text-stone-900 flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                <span>Student</span>
              </div>
              <ul className="mt-1 space-y-0.5 text-stone-500 text-[10px]">
                <li>✓ Take benchmark tests</li>
                <li>✓ Earn verified scorecards</li>
                <li>✓ Accept calendar invites</li>
                <li className="text-stone-400">✗ Cannot view recruiter pipeline</li>
              </ul>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <div className="font-bold text-stone-900 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Recruiter</span>
              </div>
              <ul className="mt-1 space-y-0.5 text-stone-500 text-[10px]">
                <li>✓ Create benchmark tests</li>
                <li>✓ Access cutoff-unlocked talent</li>
                <li>✓ Dispatch interview invites</li>
                <li className="text-stone-400">✗ Cannot take student tests</li>
              </ul>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <div className="font-bold text-stone-900 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin</span>
              </div>
              <ul className="mt-1 space-y-0.5 text-stone-500 text-[10px]">
                <li>✓ Verify corporate domains</li>
                <li>✓ Vet student affiliations</li>
                <li>✓ Proctoring stream monitor</li>
                <li className="text-stone-400">✓ Full platform audit rights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
