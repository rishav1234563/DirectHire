import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  LogOut,
  Key,
} from 'lucide-react';

export const Header: React.FC<{
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenLogin?: () => void;
}> = ({ currentTab, setCurrentTab, onOpenLogin }) => {
  const {
    currentUser,
    logout,
    resetToDemoData,
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-500 flex items-center justify-center shadow-xs text-white font-bold text-xl tracking-tight">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-stone-900">
                  Direct<span className="text-amber-600">Hire</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                  ATS-Bypass Verified
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-medium text-stone-500">
                Direct Skill-First Matching for Non-Tier-1 & Regional Universities
              </p>
            </div>
          </div>

          {/* Navigation for Current Role */}
          {currentUser && (
            <nav className="hidden lg:flex items-center space-x-1">
              {currentUser.role === 'student' && (
                <>
                  <button
                    id="nav-student-assessments"
                    onClick={() => setCurrentTab('assessments')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentTab === 'assessments'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    Skill Tests & Roles
                  </button>
                  <button
                    id="nav-student-history"
                    onClick={() => setCurrentTab('history')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentTab === 'history'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    My Test Scorecards
                  </button>
                  <button
                    id="nav-student-interviews"
                    onClick={() => setCurrentTab('interviews')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentTab === 'interviews'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    Direct Interviews
                  </button>
                  <button
                    id="nav-student-profile"
                    onClick={() => setCurrentTab('profile')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentTab === 'profile'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    University Verification
                  </button>
                </>
              )}

              {currentUser.role === 'recruiter' && (
                <>
                  <button
                    id="nav-recruiter-pipeline"
                    onClick={() => setCurrentTab('pipeline')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentTab === 'pipeline'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    Candidate Pool (Cutoff Filtered)
                  </button>
                  <button
                    id="nav-recruiter-tests"
                    onClick={() => setCurrentTab('tests')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentTab === 'tests'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    Benchmark Tests
                  </button>
                  <button
                    id="nav-recruiter-interviews"
                    onClick={() => setCurrentTab('interviews')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentTab === 'interviews'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    Direct Calendar Invites
                  </button>
                </>
              )}

              {currentUser.role === 'admin' && (
                <>
                  <button
                    id="nav-admin-dashboard"
                    onClick={() => setCurrentTab('admin-orgs')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentTab === 'admin-orgs'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    Corporate Verifications
                  </button>
                  <button
                    id="nav-admin-students"
                    onClick={() => setCurrentTab('admin-students')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentTab === 'admin-students'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    Student Affiliations
                  </button>
                  <button
                    id="nav-admin-proctoring"
                    onClick={() => setCurrentTab('admin-proctoring')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentTab === 'admin-proctoring'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    Assessment Integrity Stream
                  </button>
                </>
              )}
            </nav>
          )}

          {/* User Persona Switcher & Authentication State */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <>
                {/* Authenticated User Profile Menu */}
                <div className="relative">
                  <button
                    id="user-menu-button"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-all"
                  >
                    <img
                      src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-lg object-cover border border-stone-300"
                    />
                    <div className="hidden md:block text-left text-xs leading-tight">
                      <div className="font-bold text-stone-900 truncate max-w-[100px]">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider">
                        {currentUser.role}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 py-3 z-50 text-xs animate-in fade-in">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <div className="font-bold text-stone-900 text-sm">
                          {currentUser.name}
                        </div>
                        <div className="text-stone-500 text-[11px] font-mono">
                          {currentUser.email}
                        </div>
                        <div className="mt-1 flex items-center space-x-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                            Role: {currentUser.role}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            Verified
                          </span>
                        </div>
                      </div>

                      {/* Permissions List */}
                      <div className="px-4 py-2 text-[11px] text-stone-500 border-b border-stone-100">
                        <div className="font-bold text-stone-700 mb-1 flex items-center space-x-1">
                          <Key className="w-3 h-3 text-amber-600" />
                          <span>Active RBAC Permissions:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {currentUser.permissions.map((perm) => (
                            <span
                              key={perm}
                              className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 font-mono text-[9px]"
                            >
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="px-2 pt-2">
                        <button
                          id="header-signout-button"
                          onClick={() => {
                            logout();
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-rose-700 hover:bg-rose-50 rounded-xl transition-colors font-semibold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reset Demo State */}
                <button
                  id="reset-demo-button"
                  onClick={() => {
                    if (confirm('Reset application to original DirectHire PRD seed data?')) {
                      resetToDemoData();
                      setCurrentTab('assessments');
                    }
                  }}
                  title="Reset Demo Data"
                  className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                id="header-signin-button"
                onClick={onOpenLogin}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
