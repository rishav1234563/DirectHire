import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Building2,
  UserCheck,
} from 'lucide-react';

export const StudentInterviews: React.FC = () => {
  const { interviews, currentUser, respondInterviewInvitation, tests } = useApp();

  const userInterviews = interviews.filter((i) => i.studentId === currentUser.id);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent p-6 rounded-2xl border border-amber-200/80">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Direct Recruiter Calendar Invitations
            </h2>
            <p className="text-xs text-stone-600">
              Zero resume filters. Invitations received directly based on verified benchmark assessment scores.
            </p>
          </div>
        </div>
      </div>

      {userInterviews.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">No Interview Invitations Yet</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
            Pass benchmark assessments above the company cutoff threshold to unlock your profile directly on recruiter calendars.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {userInterviews.map((inv) => {
            const test = tests.find((t) => t.id === inv.testId);

            return (
              <div
                key={inv.id}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-stone-100 text-2xl flex items-center justify-center font-bold border border-stone-200">
                      {test?.companyLogo || '🏢'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-stone-900">
                          {inv.roleTitle}
                        </h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                          Verified Cutoff Match
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-stone-500">
                        {inv.companyName} &bull; Stage: <strong className="text-stone-800">{inv.interviewType}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                        inv.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {inv.status === 'confirmed' ? 'Confirmed & Synced' : 'Action Required'}
                    </span>
                  </div>
                </div>

                {/* Recruiter Note / Personal Message */}
                {inv.recruiterNote && (
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-start space-x-3">
                    <MessageSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-800 mb-0.5">
                        Note from Hiring Team:
                      </div>
                      <p className="italic text-stone-600 leading-relaxed">
                        "{inv.recruiterNote}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Date & Time Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-100 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-stone-500" />
                    <div>
                      <div className="text-[10px] text-stone-400 font-semibold uppercase">Date</div>
                      <div className="font-bold text-stone-800">{inv.date}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-100 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-stone-500" />
                    <div>
                      <div className="text-[10px] text-stone-400 font-semibold uppercase">Time & Timezone</div>
                      <div className="font-bold text-stone-800">{inv.time} ({inv.timezone})</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-100 flex items-center space-x-2">
                    <Video className="w-4 h-4 text-stone-500" />
                    <div>
                      <div className="text-[10px] text-stone-400 font-semibold uppercase">Meeting Link</div>
                      <a
                        href={inv.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-amber-600 hover:underline flex items-center space-x-1"
                      >
                        <span>Join Room</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* RSVP Actions */}
                <div className="flex items-center justify-end space-x-3 pt-2">
                  {inv.status !== 'confirmed' ? (
                    <>
                      <button
                        onClick={() => respondInterviewInvitation(inv.id, 'rescheduled')}
                        className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                      >
                        Request Alternative Slot
                      </button>
                      <button
                        onClick={() => respondInterviewInvitation(inv.id, 'confirmed')}
                        className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Calendar RSVP</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Invitation Confirmed & Added to Calendar</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
