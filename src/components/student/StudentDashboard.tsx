import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompanyTest } from '../../types';
import {
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Building2,
  Calendar,
  Lock,
  Unlock,
  GraduationCap,
} from 'lucide-react';
import { StudentProfileModal } from './StudentProfileModal';

export const StudentDashboard: React.FC<{
  onStartTest: (test: CompanyTest) => void;
  onViewScorecard: (attemptId: string) => void;
}> = ({ onStartTest, onViewScorecard }) => {
  const { tests, attempts, currentUser, studentProfiles, interviews } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const profile = studentProfiles[currentUser.id];
  const userAttempts = attempts.filter((a) => a.studentId === currentUser.id);
  const userInterviews = interviews.filter((i) => i.studentId === currentUser.id);

  // Extract all unique skills
  const allSkills = Array.from(
    new Set(tests.flatMap((t) => t.skillsRequired))
  );

  // Filter tests
  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSkill =
      selectedSkill === 'All' || test.skillsRequired.includes(selectedSkill);

    return matchesSearch && matchesSkill;
  });

  const passedAttemptsCount = userAttempts.filter((a) => a.passedCutoff).length;

  return (
    <div className="space-y-8">
      {/* Hero Value Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Eliminating Resume Filtering Bias</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Direct Candidate Discovery via Verified Skill Benchmarks
          </h1>

          <p className="text-sm text-stone-600 leading-relaxed">
            Students from regional and non-tier-1 colleges are screened out by legacy ATS algorithms every day. At <strong className="text-stone-900">DirectHire</strong>, passing a company’s customized benchmark test above their cutoff percentage bypasses resume reviews entirely and unlocks your profile directly on recruiter calendars.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>{profile?.universityName || currentUser.organizationOrUniversity}</span>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>University Affiliation Verified</span>
            </div>

            <button
              onClick={() => setShowProfileModal(true)}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 underline underline-offset-4"
            >
              Edit Academic Profile &rarr;
            </button>
          </div>
        </div>

        {/* Quick Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-100">
          <div>
            <div className="text-2xl font-black text-stone-900">{passedAttemptsCount}</div>
            <div className="text-xs font-medium text-stone-500">Cutoffs Passed</div>
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">{userInterviews.length}</div>
            <div className="text-xs font-medium text-stone-500">Direct Calendar Invites</div>
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">{tests.length}</div>
            <div className="text-xs font-medium text-stone-500">Active Benchmark Tests</div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">100%</div>
            <div className="text-xs font-medium text-stone-500">Verified Test Integrity</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search roles, companies, tech stacks (e.g. React, PostgreSQL)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Skill Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedSkill('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSkill === 'All'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            All Skills
          </button>
          {allSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSkill === skill
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">
            Open Roles with Direct Skill Benchmarks ({filteredTests.length})
          </h2>
          <span className="text-xs text-stone-500">
            Automated scoring in &lt; 3s &bull; Direct recruiter pipeline unlock
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            // Find recent attempt
            const attempt = userAttempts.find((a) => a.testId === test.id);
            const isCooldownActive =
              attempt &&
              !attempt.passedCutoff &&
              attempt.cooldownEndsAt &&
              new Date(attempt.cooldownEndsAt) > new Date();

            return (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:border-amber-300 hover:shadow-md transition-all space-y-4"
              >
                <div>
                  {/* Company & Role Header */}
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-stone-100 text-2xl flex items-center justify-center font-bold border border-stone-200">
                      {test.companyLogo}
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      Cutoff: {test.passingCutoffPercent}%
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-base font-bold text-stone-900 hover:text-amber-700 transition-colors">
                      {test.roleTitle}
                    </h3>
                    <p className="text-xs font-semibold text-stone-600">
                      {test.companyName} &bull; {test.department}
                    </p>
                  </div>

                  <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                    {test.description}
                  </p>

                  {/* Badges / Specs */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                      {test.workType}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                      {test.timeLimitMinutes} mins
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                      {test.experienceLevel}
                    </span>
                  </div>

                  {/* Skills Required */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {test.skillsRequired.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-2 py-0.5 rounded bg-stone-50 text-stone-600 border border-stone-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions based on Attempt Status */}
                <div className="pt-3 border-t border-stone-100">
                  {attempt?.passedCutoff ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Passed Cutoff ({attempt.totalScorePercent}%)
                        </span>
                        <span className="text-[10px] text-stone-500">Unlocked</span>
                      </div>
                      <button
                        onClick={() => onViewScorecard(attempt.id)}
                        className="w-full py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                      >
                        View Official Scorecard
                      </button>
                    </div>
                  ) : isCooldownActive ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-rose-700">
                        <span className="flex items-center font-bold">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          30-Day Cooldown Active
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {Math.ceil(
                            (new Date(attempt.cooldownEndsAt!).getTime() - Date.now()) /
                              (1000 * 60 * 60 * 24)
                          )}{' '}
                          days left
                        </span>
                      </div>
                      <button
                        onClick={() => onViewScorecard(attempt.id)}
                        className="w-full py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                      >
                        Review Diagnostic Feedback
                      </button>
                    </div>
                  ) : (
                    <button
                      id={`start-test-${test.id}`}
                      onClick={() => onStartTest(test)}
                      className="w-full py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>Take Skill Benchmark</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History of Completed Attempts */}
      {userAttempts.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-stone-900">
            My Assessment Performance & Scorecards
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Role & Company</th>
                  <th className="p-3">Date Completed</th>
                  <th className="p-3">Score Achieved</th>
                  <th className="p-3">Passing Cutoff</th>
                  <th className="p-3">Pipeline Status</th>
                  <th className="p-3">Proctoring Integrity</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                {userAttempts.map((att) => {
                  const test = tests.find((t) => t.id === att.testId);
                  return (
                    <tr key={att.id} className="hover:bg-stone-50">
                      <td className="p-3">
                        <div className="font-bold text-stone-900">{test?.roleTitle}</div>
                        <div className="text-stone-500">{test?.companyName}</div>
                      </td>
                      <td className="p-3 font-mono text-stone-500">
                        {new Date(att.completedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-bold text-stone-900">
                        {att.totalScorePercent}%
                      </td>
                      <td className="p-3 text-stone-500 font-mono">
                        {test?.passingCutoffPercent}%
                      </td>
                      <td className="p-3">
                        {att.passedCutoff ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Unlock className="w-3 h-3 mr-1 text-emerald-600" />
                            Recruiter Unlocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <Lock className="w-3 h-3 mr-1 text-rose-600" />
                            Cooldown Active
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-emerald-700">
                          {att.proctoringScorePercent}%
                        </span>
                        <span className="text-[10px] text-stone-400 block">
                          {att.violations.length} tab switches
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onViewScorecard(att.id)}
                          className="px-3 py-1 text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg"
                        >
                          View Breakdown
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      <StudentProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};
