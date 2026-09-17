import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { UserRole, Permission } from '../../types';

export const AccessDenied: React.FC<{
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: Permission;
  onSwitchTab?: (tab: string) => void;
}> = ({ requiredRole, requiredPermission, onSwitchTab }) => {
  const { currentUser, loginAsDemoUser, allUsers } = useApp();

  const roleString = Array.isArray(requiredRole)
    ? requiredRole.join(' or ')
    : requiredRole;

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-200 shadow-sm max-w-2xl mx-auto my-8 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
          Role-Based Access Control (RBAC) Barrier
        </div>
        <h2 className="text-xl font-extrabold text-stone-900">
          Access Restricted to {roleString?.toUpperCase() || 'Authorized'} Roles
        </h2>
        <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
          Your current authenticated account is logged in as{' '}
          <strong className="text-stone-900 capitalize">
            {currentUser?.name} ({currentUser?.role})
          </strong>
          . This view requires the{' '}
          <span className="font-mono font-bold text-rose-700">
            {roleString || requiredPermission}
          </span>{' '}
          authorization level.
        </p>
      </div>

      {/* RBAC explanation box */}
      <div className="bg-stone-50 rounded-xl p-4 text-xs text-stone-600 text-left border border-stone-200 space-y-2 font-mono">
        <div className="flex items-center justify-between font-bold text-stone-700">
          <span>Active Role: {currentUser?.role?.toUpperCase()}</span>
          <span>Security Policy: Enforced</span>
        </div>
        <div className="text-[11px] text-stone-500 font-sans">
          {currentUser?.role === 'student' &&
            'Students cannot modify company test suites, view recruiter pipeline logs, or inspect corporate domain verifications.'}
          {currentUser?.role === 'recruiter' &&
            'Recruiters cannot submit test attempts as candidates under company profiles or approve domain verifications.'}
          {currentUser?.role === 'admin' &&
            'Admin role maintains oversight; to experience candidate assessment or interview flow, switch to a student or recruiter profile.'}
        </div>
      </div>

      {/* Quick Role Switcher for seamless evaluation */}
      <div className="pt-4 border-t border-stone-100 space-y-3">
        <div className="text-xs font-semibold text-stone-500">
          Switch to an authorized role to test this view:
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {allUsers
            .filter((u) => {
              if (Array.isArray(requiredRole)) return requiredRole.includes(u.role);
              if (requiredRole) return u.role === requiredRole;
              return u.id !== currentUser?.id;
            })
            .slice(0, 3)
            .map((u) => (
              <button
                key={u.id}
                onClick={() => loginAsDemoUser(u.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 transition-colors flex items-center space-x-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  Switch to {u.name} ({u.role})
                </span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
