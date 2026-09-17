import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LoginPage } from './components/auth/LoginPage';
import { AccessDenied } from './components/common/AccessDenied';
import { StudentDashboard } from './components/student/StudentDashboard';
import { AssessmentEngine } from './components/student/AssessmentEngine';
import { ScorecardModal } from './components/student/ScorecardModal';
import { StudentProfileModal } from './components/student/StudentProfileModal';
import { StudentInterviews } from './components/student/StudentInterviews';
import { RecruiterDashboard } from './components/recruiter/RecruiterDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ZukoChatbot } from './components/student/ZukoChatbot';
import { ShieldCheck, Heart, Sparkles, GraduationCap } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentUser,
    activeTestSession,
    startTestSession,
    endTestSession,
    viewScorecardAttemptId,
    setViewScorecardAttemptId,
    hasRole,
  } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('assessments');
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);

  // Sync tab with role when currentUser changes
  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === 'student') {
      if (!['assessments', 'history', 'interviews', 'profile'].includes(currentTab)) {
        setCurrentTab('assessments');
      }
    } else if (currentUser.role === 'recruiter') {
      if (!['pipeline', 'tests', 'interviews'].includes(currentTab)) {
        setCurrentTab('pipeline');
      }
    } else if (currentUser.role === 'admin') {
      if (!['admin-orgs', 'admin-students', 'admin-proctoring'].includes(currentTab)) {
        setCurrentTab('admin-orgs');
      }
    }
  }, [currentUser?.id, currentUser?.role]);

  // If not authenticated, render Login Page
  if (!currentUser) {
    return <LoginPage />;
  }

  // If student is currently taking a live test session, show full proctored engine
  if (activeTestSession) {
    return (
      <AssessmentEngine
        test={activeTestSession.test}
        onClose={endTestSession}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-900">
      {/* Sticky Header */}
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* STUDENT VIEWS & GUARDS */}
        {['assessments', 'history', 'profile'].includes(currentTab) && (
          <>
            {!hasRole('student') ? (
              <AccessDenied
                requiredRole="student"
                onSwitchTab={(t) => setCurrentTab(t)}
              />
            ) : (
              <>
                {currentTab === 'assessments' && (
                  <StudentDashboard
                    onStartTest={(test) => startTestSession(test)}
                    onViewScorecard={(attemptId) => setViewScorecardAttemptId(attemptId)}
                  />
                )}

                {currentTab === 'history' && (
                  <StudentDashboard
                    onStartTest={(test) => startTestSession(test)}
                    onViewScorecard={(attemptId) => setViewScorecardAttemptId(attemptId)}
                  />
                )}

                {currentTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200">
                      <h2 className="text-xl font-bold text-stone-900 mb-2">
                        Academic Affiliation & Credentials
                      </h2>
                      <p className="text-xs text-stone-600 mb-6">
                        DirectHire verifies non-tier-1 university enrollment so recruiters evaluate your actual verified code and domain skills rather than institutional rankings.
                      </p>
                      <button
                        onClick={() => setShowStudentProfileModal(true)}
                        className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                      >
                        Open Profile & Verification Editor
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* INTERVIEWS (Shared between student and recruiter) */}
        {currentTab === 'interviews' && (
          <>
            {hasRole('student') && <StudentInterviews />}
            {hasRole('recruiter') && <RecruiterDashboard />}
            {hasRole('admin') && (
              <AccessDenied
                requiredRole={['student', 'recruiter']}
                onSwitchTab={(t) => setCurrentTab(t)}
              />
            )}
          </>
        )}

        {/* RECRUITER VIEWS & GUARDS */}
        {['pipeline', 'tests'].includes(currentTab) && (
          <>
            {!hasRole('recruiter') ? (
              <AccessDenied
                requiredRole="recruiter"
                onSwitchTab={(t) => setCurrentTab(t)}
              />
            ) : (
              <RecruiterDashboard />
            )}
          </>
        )}

        {/* ADMIN VIEWS & GUARDS */}
        {['admin-orgs', 'admin-students', 'admin-proctoring'].includes(currentTab) && (
          <>
            {!hasRole('admin') ? (
              <AccessDenied
                requiredRole="admin"
                onSwitchTab={(t) => setCurrentTab(t)}
              />
            ) : (
              <AdminDashboard
                activeSubTab={
                  currentTab === 'admin-students'
                    ? 'admin-students'
                    : currentTab === 'admin-proctoring'
                    ? 'admin-proctoring'
                    : 'admin-orgs'
                }
              />
            )}
          </>
        )}
      </main>

      {/* Global Scorecard Modal */}
      {viewScorecardAttemptId && (
        <ScorecardModal
          attemptId={viewScorecardAttemptId}
          onClose={() => setViewScorecardAttemptId(null)}
        />
      )}

      {/* Student Profile Modal */}
      <StudentProfileModal
        isOpen={showStudentProfileModal}
        onClose={() => setShowStudentProfileModal(false)}
      />

      {/* Zuko AI Career & Assessment Chatbot - JOB SEEKER WEB LOGIN ONLY */}
      {currentUser?.role === 'student' && (
        <ZukoChatbot
          onNavigateTab={(tab) => setCurrentTab(tab)}
          onOpenProfile={() => setShowStudentProfileModal(true)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-stone-700">DirectHire</span>
            <span>&bull;</span>
            <span>Eliminating Resume Filtering Bias for Emerging Universities</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-stone-400">
            <span>Role-Based Access Control (RBAC) Active</span>
            <span>&bull;</span>
            <span>Corporate Domain Vetting</span>
            <span>&bull;</span>
            <span>Sandboxed Unit Test Execution</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
