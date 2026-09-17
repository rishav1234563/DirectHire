import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TestAttempt, CompanyTest, StudentProfile } from '../../types';
import {
  Calendar,
  Clock,
  Video,
  MessageSquare,
  Sparkles,
  X,
  CheckCircle2,
} from 'lucide-react';

export const ScheduleInterviewModal: React.FC<{
  attempt: TestAttempt;
  test: CompanyTest;
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
}> = ({ attempt, test, profile, isOpen, onClose }) => {
  const { sendInterviewInvitation, currentUser } = useApp();

  const [date, setDate] = useState('2026-03-25');
  const [time, setTime] = useState('14:00');
  const [timezone, setTimezone] = useState('EST (US & Canada)');
  const [interviewType, setInterviewType] = useState<
    'Technical Screen' | 'Pair Programming' | 'System Discussion'
  >('Pair Programming');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/drt-dir-hire');
  const [note, setNote] = useState(
    `Hi ${profile.fullName}, your score of ${attempt.totalScorePercent}% on our ${test.roleTitle} benchmark test surpassed our ${test.passingCutoffPercent}% cutoff. We are excited to bypass resume screening and invite you directly to a technical conversation!`
  );
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendInterviewInvitation({
      attemptId: attempt.id,
      testId: test.id,
      studentId: profile.userId,
      recruiterId: currentUser.id,
      companyName: test.companyName,
      roleTitle: test.roleTitle,
      date,
      time,
      timezone,
      interviewType,
      meetingLink,
      recruiterNote: note,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Direct Recruiter Calendar Invitation
              </h2>
              <p className="text-xs text-stone-500">
                Direct calendar booking with verified candidate {profile.fullName}
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

        {/* Value Proposition Alert */}
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start space-x-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Bypassing Resume Review:</strong> Candidate scored{' '}
            <strong className="text-emerald-900">{attempt.totalScorePercent}%</strong> against your{' '}
            <strong>{test.passingCutoffPercent}% cutoff</strong> with{' '}
            <strong>{attempt.proctoringScorePercent}% proctoring integrity</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Interview Stage
            </label>
            <select
              value={interviewType}
              onChange={(e: any) => setInterviewType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            >
              <option value="Pair Programming">Live Pair Programming & Code Review (45m)</option>
              <option value="Technical Screen">Core Systems Technical Screen (30m)</option>
              <option value="System Discussion">System Architecture & Team Fit (45m)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Time Slot</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Virtual Meeting Link (Google Meet / Zoom)
            </label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Personalized Invitation Message to Candidate
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              id="confirm-send-invite-button"
              type="submit"
              className="px-5 py-2 text-white bg-amber-600 hover:bg-amber-700 font-bold rounded-lg shadow-sm flex items-center space-x-1.5"
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Invitation Sent!</span>
                </>
              ) : (
                <span>Dispatch Calendar Invitation</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
