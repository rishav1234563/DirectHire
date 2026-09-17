import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  Activity,
  Award,
} from 'lucide-react';

export const AdminDashboard: React.FC<{
  activeSubTab: 'admin-orgs' | 'admin-students' | 'admin-proctoring';
}> = ({ activeSubTab }) => {
  const {
    orgVerifications,
    updateOrgVerification,
    affiliationVerifications,
    updateAffiliationVerification,
    attempts,
    tests,
    studentProfiles,
  } = useApp();

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Trust, Verification & Integrity Operations
            </h1>
            <p className="text-xs text-stone-600">
              Validating recruiter domains, vetting student academic credentials, and monitoring live proctoring integrity streams.
            </p>
          </div>
        </div>

        {/* High-level stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-100">
          <div>
            <div className="text-2xl font-black text-stone-900">
              {orgVerifications.filter((o) => o.status === 'verified').length}
            </div>
            <div className="text-xs font-medium text-stone-500">
              Verified Corporate Domains
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">
              {affiliationVerifications.filter((a) => a.status === 'verified').length}
            </div>
            <div className="text-xs font-medium text-stone-500">
              Vetted Student Affiliations
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">
              {attempts.length}
            </div>
            <div className="text-xs font-medium text-stone-500">
              Monitored Test Sessions
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">98.4%</div>
            <div className="text-xs font-medium text-stone-500">
              Platform Integrity Index
            </div>
          </div>
        </div>
      </div>

      {/* Subtab 1: Recruiter Organization Verification */}
      {activeSubTab === 'admin-orgs' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Corporate Organization Domain Verifications
              </h2>
              <p className="text-xs text-stone-500">
                Ensure all hiring managers represent legitimate registered companies with corporate email domains.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">Recruiter & Company</th>
                  <th className="p-3">Corporate Domain</th>
                  <th className="p-3">Domain Age</th>
                  <th className="p-3">Registration #</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                {orgVerifications.map((org) => (
                  <tr key={org.id} className="hover:bg-stone-50">
                    <td className="p-3">
                      <div className="font-bold text-stone-900">{org.companyName}</div>
                      <div className="text-stone-500">{org.recruiterName} ({org.corporateEmail})</div>
                    </td>
                    <td className="p-3 font-mono font-semibold text-stone-800">
                      {org.domain}
                    </td>
                    <td className="p-3 text-stone-600 font-mono">
                      {org.domainAgeYears} years
                    </td>
                    <td className="p-3 text-stone-500 font-mono">
                      {org.businessRegistrationNumber}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          org.status === 'verified'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : org.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {org.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {org.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => updateOrgVerification(org.id, 'verified')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateOrgVerification(org.id, 'rejected')}
                            className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold text-[11px]"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            updateOrgVerification(
                              org.id,
                              org.status === 'verified' ? 'rejected' : 'verified'
                            )
                          }
                          className="text-[11px] text-stone-500 hover:text-stone-800 underline"
                        >
                          Toggle Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Student Affiliations */}
      {activeSubTab === 'admin-students' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Student University Affiliation Queue
              </h2>
              <p className="text-xs text-stone-500">
                Validating student enrollment via verified institutional .edu / .ac email and uploaded college ID documents.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">University / College</th>
                  <th className="p-3">Institutional Email</th>
                  <th className="p-3">Uploaded ID Document</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                {affiliationVerifications.map((aff) => (
                  <tr key={aff.id} className="hover:bg-stone-50">
                    <td className="p-3 font-bold text-stone-900">{aff.studentName}</td>
                    <td className="p-3 font-medium text-stone-800">{aff.universityName}</td>
                    <td className="p-3 font-mono text-stone-600">{aff.eduEmail}</td>
                    <td className="p-3 font-mono text-amber-700">
                      <span className="flex items-center space-x-1">
                        <FileText className="w-3.5 h-3.5 text-stone-400" />
                        <span>{aff.idCardFile}</span>
                      </span>
                    </td>
                    <td className="p-3 font-mono text-stone-500">{aff.graduationYear}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          aff.status === 'verified'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : aff.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {aff.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {aff.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => updateAffiliationVerification(aff.id, 'verified')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => updateAffiliationVerification(aff.id, 'rejected')}
                            className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold text-[11px]"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            updateAffiliationVerification(
                              aff.id,
                              aff.status === 'verified' ? 'rejected' : 'verified'
                            )
                          }
                          className="text-[11px] text-stone-500 hover:text-stone-800 underline"
                        >
                          Toggle Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: Proctoring Integrity Stream */}
      {activeSubTab === 'admin-proctoring' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Assessment Proctoring Integrity Audit Stream
              </h2>
              <p className="text-xs text-stone-500">
                Live monitoring of tab-switches, window blurs, and sandboxed test case execution across all attempts.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
              Stream Active
            </span>
          </div>

          <div className="space-y-3">
            {attempts.map((att) => {
              const test = tests.find((t) => t.id === att.testId);
              const profile = studentProfiles[att.studentId];

              return (
                <div
                  key={att.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 text-xs space-y-2 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-stone-900">
                        {profile?.fullName || 'Candidate'}
                      </span>
                      <span className="text-stone-400">&bull;</span>
                      <span className="text-stone-600">{test?.roleTitle} ({test?.companyName})</span>
                    </div>

                    <div className="flex items-center space-x-3 text-stone-500 font-mono text-[11px]">
                      <span>{new Date(att.completedAt).toLocaleString()}</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          att.passedCutoff
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        Score: {att.totalScorePercent}% (Cutoff: {test?.passingCutoffPercent}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-stone-700">Integrity Rating:</span>
                      <span className="font-bold text-emerald-700">
                        {att.proctoringScorePercent}%
                      </span>
                      <span className="text-stone-400">|</span>
                      <span className="text-stone-600">
                        {att.violations.length} Tab-switch violation(s)
                      </span>
                      <span className="text-stone-400">|</span>
                      <span className="text-stone-600">
                        Time: {Math.round(att.timeSpentSeconds / 60)} mins
                      </span>
                    </div>

                    <span className="text-[10px] text-stone-400 font-mono">
                      V8 Sandbox ID: {att.id.substring(0, 12)}
                    </span>
                  </div>

                  {att.violations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-stone-200 space-y-1">
                      {att.violations.map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center space-x-2 text-[11px] text-amber-800"
                        >
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{v.message}</span>
                          <span className="text-stone-400 text-[10px] font-mono ml-auto">
                            {new Date(v.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
