import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Code2,
  HelpCircle,
  Calendar,
  X,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ScorecardModal: React.FC<{
  attemptId: string;
  onClose: () => void;
}> = ({ attemptId, onClose }) => {
  const { attempts, tests, studentProfiles, currentUser } = useApp();

  const attempt = attempts.find((a) => a.id === attemptId);
  const test = attempt ? tests.find((t) => t.id === attempt.testId) : null;
  const profile = attempt ? studentProfiles[attempt.studentId] : null;

  useEffect(() => {
    if (attempt?.passedCutoff) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [attempt?.passedCutoff]);

  if (!attempt || !test) return null;

  const cooldownDateStr = attempt.cooldownEndsAt
    ? new Date(attempt.cooldownEndsAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-2xl flex items-center justify-center font-bold">
              {test.companyLogo}
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Official Benchmark Scorecard
              </h2>
              <p className="text-xs text-stone-500">
                {test.roleTitle} &bull; {test.companyName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Outcome Banner */}
        <div
          className={`mt-6 p-6 rounded-2xl border ${
            attempt.passedCutoff
              ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-300'
              : 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border-rose-300'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {attempt.passedCutoff ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    DIRECT RECRUITER MATCH UNLOCKED
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                    <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
                    CUTOFF NOT MET &bull; 30-DAY COOLDOWN ACTIVE
                  </span>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-stone-900">
                {attempt.passedCutoff
                  ? 'Congratulations! You Bypassed the Resume Filter.'
                  : 'Assessment Below Cutoff Threshold'}
              </h3>
              <p className="text-xs text-stone-600 max-w-xl leading-relaxed">
                {attempt.passedCutoff
                  ? `Your verified score of ${attempt.totalScorePercent}% exceeded the required ${test.passingCutoffPercent}% cutoff. Your full candidate profile and verified metrics have been unlocked on ${test.companyName}'s recruiter pipeline for direct calendar scheduling.`
                  : `You achieved ${attempt.totalScorePercent}%, which is below the designated ${test.passingCutoffPercent}% passing threshold. Per DirectHire integrity rules, you can re-attempt this role on ${cooldownDateStr}. Check the diagnostic breakdown below to target your prep.`}
              </p>
            </div>

            {/* Score Pill */}
            <div className="text-center sm:text-right shrink-0 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <div className="text-3xl font-black text-stone-900">
                {attempt.totalScorePercent}%
              </div>
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Cutoff: {test.passingCutoffPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center space-x-2 text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Domain Knowledge</span>
            </div>
            <div className="text-lg font-bold text-stone-900">
              {attempt.mcqScore} / {attempt.mcqTotal} Points
            </div>
            <div className="text-xs text-stone-500 mt-1">
              Multiple Choice Section
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center space-x-2 text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">
              <Code2 className="w-4 h-4 text-emerald-600" />
              <span>Sandbox Coding</span>
            </div>
            <div className="text-lg font-bold text-stone-900">
              {attempt.codingScore} / {attempt.codingTotal} Points
            </div>
            <div className="text-xs text-stone-500 mt-1">
              {attempt.testCaseResults.filter((r) => r.passed).length} of{' '}
              {attempt.testCaseResults.length} Unit Tests Passed
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center space-x-2 text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Integrity Score</span>
            </div>
            <div className="text-lg font-bold text-stone-900">
              {attempt.proctoringScorePercent}%
            </div>
            <div className="text-xs text-stone-500 mt-1">
              {attempt.violations.length} Tab-switch / Blur event(s)
            </div>
          </div>
        </div>

        {/* Unit Test Execution Details */}
        <div className="mt-6">
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Automated Unit Test Results
          </h4>
          <div className="space-y-2">
            {attempt.testCaseResults.map((tc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-stone-200 bg-stone-50 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center space-x-2">
                  {tc.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold text-stone-800">
                      Test Case #{idx + 1}:
                    </span>{' '}
                    <span className="text-stone-600">Input: {tc.input}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-semibold ${
                      tc.passed ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {tc.passed ? 'PASSED' : 'FAILED'}
                  </span>
                  <span className="text-stone-400 text-[10px] ml-2">
                    {tc.executionTimeMs}ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Solution Submitted */}
        <div className="mt-6">
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Submitted Solution
          </h4>
          <pre className="p-4 rounded-xl bg-stone-900 text-stone-200 font-mono text-xs overflow-x-auto border border-stone-800 max-h-48">
            <code>{attempt.submittedCode}</code>
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 border border-stone-300"
          >
            Close Scorecard
          </button>
        </div>
      </div>
    </div>
  );
};
