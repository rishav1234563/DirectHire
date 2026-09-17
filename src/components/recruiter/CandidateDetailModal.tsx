import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TestAttempt, CompanyTest } from '../../types';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Code2,
  HelpCircle,
  ExternalLink,
  X,
  AlertTriangle,
  Lock,
  Unlock,
} from 'lucide-react';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';

export const CandidateDetailModal: React.FC<{
  attempt: TestAttempt;
  test: CompanyTest;
  isOpen: boolean;
  onClose: () => void;
}> = ({ attempt, test, isOpen, onClose }) => {
  const { studentProfiles } = useApp();
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  if (!isOpen) return null;

  const profile = studentProfiles[attempt.studentId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-stone-900">
                  {attempt.passedCutoff ? profile?.fullName : 'Anonymized Candidate'}
                </h2>
                {attempt.passedCutoff ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <Unlock className="w-3 h-3 mr-1 text-emerald-600" />
                    Cutoff Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600">
                    <Lock className="w-3 h-3 mr-1 text-stone-400" />
                    Locked (Below Cutoff)
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">
                Assessment for {test.roleTitle} &bull; {test.companyName}
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

        {/* Profile Details or Locked Notice */}
        {attempt.passedCutoff ? (
          <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-stone-900">
                  {profile?.universityName}
                </div>
                <div className="text-xs text-stone-600">
                  {profile?.degree} &bull; Class of {profile?.graduationYear} &bull; GPA: {profile?.gpa}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  College Affiliation Verified
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 italic">
              "{profile?.headline}"
            </p>

            {/* Skills & Links */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200 text-xs">
              <div className="flex flex-wrap gap-1">
                {profile?.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700 text-[10px]"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                {profile?.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-stone-700 hover:text-amber-700 font-semibold flex items-center space-x-1"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-stone-700 hover:text-amber-700 font-semibold flex items-center space-x-1"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
            <div className="font-semibold text-stone-800 flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-stone-400" />
              <span>Full Profile Anonymized & Locked</span>
            </div>
            <p>
              Candidate scored {attempt.totalScorePercent}%, which is below your {test.passingCutoffPercent}% passing cutoff. Per DirectHire’s merit-first model, candidates below cutoff remain in a 30-day cooldown period and their personal contact details remain shielded.
            </p>
          </div>
        )}

        {/* Verified Score Card Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-stone-500 text-[10px] uppercase font-sans">Final Score</div>
            <div className="text-xl font-bold text-stone-900 font-sans">
              {attempt.totalScorePercent}%
            </div>
            <div className="text-[10px] text-stone-400 font-sans">
              Cutoff: {test.passingCutoffPercent}%
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-stone-500 text-[10px] uppercase font-sans">Domain MCQs</div>
            <div className="text-xl font-bold text-stone-900 font-sans">
              {attempt.mcqScore}/{attempt.mcqTotal}
            </div>
            <div className="text-[10px] text-stone-400 font-sans">Points Earned</div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-stone-500 text-[10px] uppercase font-sans">Unit Tests</div>
            <div className="text-xl font-bold text-stone-900 font-sans">
              {attempt.testCaseResults.filter((r) => r.passed).length}/{attempt.testCaseResults.length}
            </div>
            <div className="text-[10px] text-stone-400 font-sans">Passed Sandbox</div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-stone-500 text-[10px] uppercase font-sans">Proctor Integrity</div>
            <div className="text-xl font-bold text-emerald-700 font-sans">
              {attempt.proctoringScorePercent}%
            </div>
            <div className="text-[10px] text-stone-400 font-sans">
              {attempt.violations.length} tab switch(es)
            </div>
          </div>
        </div>

        {/* Proctoring Log Audit */}
        <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">
              Proctoring Audit Trail
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified Clean Session
            </span>
          </div>

          {attempt.violations.length === 0 ? (
            <p className="text-stone-500 text-[11px]">
              Zero tab switches or blur events recorded during this {Math.round(attempt.timeSpentSeconds / 60)}-minute assessment.
            </p>
          ) : (
            <div className="space-y-1">
              {attempt.violations.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center space-x-2 text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded"
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>{v.message}</span>
                  <span className="text-stone-400 text-[9px] font-mono ml-auto">
                    {new Date(v.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Candidate Code Solution */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">
              Candidate Code Submission
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              Evaluated against isolated test suite
            </span>
          </div>
          <pre className="p-4 rounded-xl bg-stone-900 text-stone-200 font-mono text-xs overflow-x-auto border border-stone-800 max-h-48">
            <code>{attempt.submittedCode}</code>
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            {attempt.passedCutoff
              ? 'Candidate qualified for direct calendar interview invitation'
              : 'Candidate entered 30-day cooldown'}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg"
            >
              Close
            </button>

            {attempt.passedCutoff && profile && (
              <button
                id="open-schedule-modal-button"
                onClick={() => setShowScheduleModal(true)}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm flex items-center space-x-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Direct Interview</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && profile && (
        <ScheduleInterviewModal
          attempt={attempt}
          test={test}
          profile={profile}
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};
