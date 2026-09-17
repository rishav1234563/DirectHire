import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompanyTest, TestAttempt } from '../../types';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Code2,
  Plus,
  Search,
  Filter,
  Users,
  Sparkles,
  Lock,
  Unlock,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  GraduationCap,
} from 'lucide-react';
import { CandidateDetailModal } from './CandidateDetailModal';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';
import { TestBuilderModal } from './TestBuilderModal';

export const RecruiterDashboard: React.FC = () => {
  const { tests, attempts, currentUser, studentProfiles, interviews } = useApp();

  const [activeFilterTab, setActiveFilterTab] = useState<'qualified' | 'all'>('qualified');
  const [selectedTestId, setSelectedTestId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [selectedAttemptForDetail, setSelectedAttemptForDetail] = useState<TestAttempt | null>(null);
  const [selectedAttemptForSchedule, setSelectedAttemptForSchedule] = useState<TestAttempt | null>(null);
  const [showTestBuilderModal, setShowTestBuilderModal] = useState(false);

  // Filter attempts
  const filteredAttempts = attempts.filter((att) => {
    const test = tests.find((t) => t.id === att.testId);
    const profile = studentProfiles[att.studentId];

    const matchesTest = selectedTestId === 'all' || att.testId === selectedTestId;
    const matchesTab = activeFilterTab === 'qualified' ? att.passedCutoff : true;

    const matchesSearch =
      (profile?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (profile?.universityName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (test?.roleTitle || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTest && matchesTab && matchesSearch;
  });

  const qualifiedCount = attempts.filter((a) => a.passedCutoff).length;
  const belowCutoffCount = attempts.filter((a) => !a.passedCutoff).length;

  return (
    <div className="space-y-8">
      {/* Recruiter Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-900 border border-amber-200">
                Corporate Recruiter Portal
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Verified Corporate Domain ({currentUser.email.split('@')[1]})
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Direct Match Talent Pipeline
            </h1>
            <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
              Bypassing conventional ATS keyword screening. Candidate profiles unlock automatically once verified test scores meet or exceed your specified benchmark cutoff.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="create-test-button"
              onClick={() => setShowTestBuilderModal(true)}
              className="px-4 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Benchmark Test</span>
            </button>
          </div>
        </div>

        {/* Value Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-100">
          <div>
            <div className="text-2xl font-black text-emerald-600">{qualifiedCount}</div>
            <div className="text-xs font-medium text-stone-500">
              Cutoff-Passed Candidates Unlocked
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">-42%</div>
            <div className="text-xs font-medium text-stone-500 flex items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Time-to-First-Interview
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">{interviews.length}</div>
            <div className="text-xs font-medium text-stone-500">
              Direct Calendar Invites Sent
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">0%</div>
            <div className="text-xs font-medium text-stone-500">
              Resume Keyword Bias
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Controls & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center space-x-2 bg-stone-100 p-1 rounded-xl">
            <button
              id="tab-filter-qualified"
              onClick={() => setActiveFilterTab('qualified')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeFilterTab === 'qualified'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Qualified Profiles (Passed Cutoff)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                {qualifiedCount}
              </span>
            </button>

            <button
              id="tab-filter-all"
              onClick={() => setActiveFilterTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeFilterTab === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>All Submissions (Inc. Cooldown)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 text-stone-700">
                {attempts.length}
              </span>
            </button>
          </div>

          {/* Test Selector Dropdown */}
          <div className="flex items-center space-x-3">
            <select
              value={selectedTestId}
              onChange={(e) => setSelectedTestId(e.target.value)}
              className="text-xs px-3 py-2 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            >
              <option value="all">All Benchmark Tests ({tests.length})</option>
              {tests.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.roleTitle} (Cutoff: {t.passingCutoffPercent}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Candidate Cards Grid */}
        <div className="space-y-3">
          {filteredAttempts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
              <Users className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <div className="text-sm font-bold text-stone-800">
                No candidates match the current filter
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Candidate profiles appear here as soon as tests are completed.
              </p>
            </div>
          ) : (
            filteredAttempts.map((attempt) => {
              const test = tests.find((t) => t.id === attempt.testId);
              const profile = studentProfiles[attempt.studentId];
              const existingInvite = interviews.find(
                (i) => i.studentId === attempt.studentId && i.testId === attempt.testId
              );

              return (
                <div
                  key={attempt.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                    attempt.passedCutoff
                      ? 'border-emerald-200/90 hover:border-emerald-400'
                      : 'border-stone-200 opacity-80'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left Info */}
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        {attempt.passedCutoff ? (
                          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-lg">
                            <GraduationCap className="w-6 h-6 text-amber-700" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-stone-400" />
                          </div>
                        )}
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            attempt.passedCutoff ? 'bg-emerald-500' : 'bg-stone-400'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <h3 className="text-base font-bold text-stone-900">
                            {attempt.passedCutoff ? profile?.fullName : 'Anonymized Candidate'}
                          </h3>
                          {attempt.passedCutoff ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                              Passed Cutoff (Direct Match)
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              <XCircle className="w-3 h-3 mr-1 text-rose-600" />
                              Below Cutoff &bull; In Cooldown
                            </span>
                          )}

                          {existingInvite && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-100 text-sky-800">
                              Calendar Invite Dispatched
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-stone-600">
                          {attempt.passedCutoff ? (
                            <span>
                              <strong>{profile?.universityName}</strong> ({profile?.universityTier}) &bull; Class of {profile?.graduationYear}
                            </span>
                          ) : (
                            <span className="italic text-stone-400">
                              Institutional details shielded during 30-day cooldown
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-stone-500 flex items-center space-x-2 pt-0.5">
                          <span>Benchmark: <strong>{test?.roleTitle}</strong></span>
                          <span>&bull;</span>
                          <span>Cutoff: <strong className="text-stone-700">{test?.passingCutoffPercent}%</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Score Metrics */}
                    <div className="grid grid-cols-3 gap-3 text-center sm:text-left bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <div>
                        <div className="text-[10px] text-stone-400 uppercase font-semibold">
                          Score
                        </div>
                        <div
                          className={`text-base font-black ${
                            attempt.passedCutoff ? 'text-emerald-700' : 'text-stone-600'
                          }`}
                        >
                          {attempt.totalScorePercent}%
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-stone-400 uppercase font-semibold">
                          Unit Tests
                        </div>
                        <div className="text-base font-bold text-stone-800">
                          {attempt.testCaseResults.filter((r) => r.passed).length}/
                          {attempt.testCaseResults.length}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-stone-400 uppercase font-semibold">
                          Proctor Integrity
                        </div>
                        <div className="text-base font-bold text-emerald-700">
                          {attempt.proctoringScorePercent}%
                        </div>
                      </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex items-center space-x-2 justify-end">
                      <button
                        onClick={() => setSelectedAttemptForDetail(attempt)}
                        className="px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                      >
                        Inspect Submission
                      </button>

                      {attempt.passedCutoff && (
                        <button
                          id={`schedule-invite-${attempt.id}`}
                          onClick={() => setSelectedAttemptForSchedule(attempt)}
                          className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{existingInvite ? 'Manage Invite' : 'Schedule Interview'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAttemptForDetail && (
        <CandidateDetailModal
          attempt={selectedAttemptForDetail}
          test={tests.find((t) => t.id === selectedAttemptForDetail.testId)!}
          isOpen={Boolean(selectedAttemptForDetail)}
          onClose={() => setSelectedAttemptForDetail(null)}
        />
      )}

      {/* Direct Schedule Modal */}
      {selectedAttemptForSchedule && (
        <ScheduleInterviewModal
          attempt={selectedAttemptForSchedule}
          test={tests.find((t) => t.id === selectedAttemptForSchedule.testId)!}
          profile={studentProfiles[selectedAttemptForSchedule.studentId]}
          isOpen={Boolean(selectedAttemptForSchedule)}
          onClose={() => setSelectedAttemptForSchedule(null)}
        />
      )}

      {/* Test Builder Modal */}
      <TestBuilderModal
        isOpen={showTestBuilderModal}
        onClose={() => setShowTestBuilderModal(false)}
      />
    </div>
  );
};
