import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Permission,
  ROLE_PERMISSIONS,
  StudentProfile,
  CompanyTest,
  TestAttempt,
  InterviewInvitation,
  RecruiterOrgVerification,
  StudentAffiliationVerification,
} from '../types';
import {
  SEED_USERS,
  SEED_STUDENT_PROFILES,
  SEED_TESTS,
  SEED_ATTEMPTS,
  SEED_INTERVIEWS,
  SEED_RECRUITER_ORGS,
  SEED_STUDENT_AFFILIATIONS,
} from '../data/seedData';

export interface RegisterPayload {
  role: UserRole;
  name: string;
  email: string;
  password?: string;
  organizationOrUniversity: string;
  title?: string;
  degree?: string;
  graduationYear?: number;
}

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  loginAsDemoUser: (userId: string) => void;
  logout: () => void;
  register: (payload: RegisterPayload) => { success: boolean; error?: string };
  hasPermission: (permission: Permission) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  allUsers: User[];
  studentProfiles: Record<string, StudentProfile>;
  updateStudentProfile: (profile: StudentProfile) => void;
  tests: CompanyTest[];
  createTest: (newTest: Omit<CompanyTest, 'id' | 'totalAttempts' | 'passedCount' | 'createdAt'>) => void;
  attempts: TestAttempt[];
  submitAttempt: (attemptData: Omit<TestAttempt, 'id'>) => TestAttempt;
  interviews: InterviewInvitation[];
  sendInterviewInvitation: (invitation: Omit<InterviewInvitation, 'id' | 'createdAt' | 'status'>) => void;
  respondInterviewInvitation: (id: string, status: 'confirmed' | 'rescheduled') => void;
  orgVerifications: RecruiterOrgVerification[];
  updateOrgVerification: (id: string, status: 'verified' | 'rejected') => void;
  affiliationVerifications: StudentAffiliationVerification[];
  updateAffiliationVerification: (id: string, status: 'verified' | 'rejected') => void;
  activeTestSession: { test: CompanyTest; startedAt: string } | null;
  startTestSession: (test: CompanyTest) => void;
  endTestSession: () => void;
  viewScorecardAttemptId: string | null;
  setViewScorecardAttemptId: (id: string | null) => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'directhire_user_id',
  USERS: 'directhire_users',
  PROFILES: 'directhire_profiles',
  TESTS: 'directhire_tests',
  ATTEMPTS: 'directhire_attempts',
  INTERVIEWS: 'directhire_interviews',
  ORGS: 'directhire_orgs',
  AFFILIATIONS: 'directhire_affiliations',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SEED_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (saved !== null) return saved;
    return 'student-1'; // default initial session
  });

  const [studentProfiles, setStudentProfiles] = useState<Record<string, StudentProfile>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SEED_STUDENT_PROFILES;
  });

  const [tests, setTests] = useState<CompanyTest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TESTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SEED_TESTS;
  });

  const [attempts, setAttempts] = useState<TestAttempt[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SEED_ATTEMPTS;
  });

  const [interviews, setInterviews] = useState<InterviewInvitation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SEED_INTERVIEWS;
  });

  const [orgVerifications, setOrgVerifications] = useState<RecruiterOrgVerification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SEED_RECRUITER_ORGS;
  });

  const [affiliationVerifications, setAffiliationVerifications] = useState<StudentAffiliationVerification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AFFILIATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SEED_STUDENT_AFFILIATIONS;
  });

  const [activeTestSession, setActiveTestSession] = useState<{ test: CompanyTest; startedAt: string } | null>(null);
  const [viewScorecardAttemptId, setViewScorecardAttemptId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(studentProfiles));
  }, [studentProfiles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORGS, JSON.stringify(orgVerifications));
  }, [orgVerifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AFFILIATIONS, JSON.stringify(affiliationVerifications));
  }, [affiliationVerifications]);

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const isAuthenticated = Boolean(currentUser);

  // Authentication Handlers
  const login = (email: string, password?: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (password && foundUser.password && foundUser.password !== password) {
      return { success: false, error: 'Incorrect password entered.' };
    }

    setCurrentUserId(foundUser.id);
    setActiveTestSession(null);
    return { success: true };
  };

  const loginAsDemoUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUserId(found.id);
      setActiveTestSession(null);
    }
  };

  const logout = () => {
    setCurrentUserId(null);
    setActiveTestSession(null);
    setViewScorecardAttemptId(null);
  };

  const register = (payload: RegisterPayload): { success: boolean; error?: string } => {
    const cleanEmail = payload.email.trim().toLowerCase();

    // Check duplicate
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account already exists with this email address.' };
    }

    // Recruiter corporate domain check
    if (payload.role === 'recruiter') {
      const publicDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
      const emailDomain = cleanEmail.split('@')[1];
      if (!emailDomain || publicDomains.includes(emailDomain)) {
        return {
          success: false,
          error: 'Recruiters must register with a corporate domain (e.g., @company.com). Public mail providers are blocked to ensure platform trust.',
        };
      }
    }

    const newUserId = `${payload.role}-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      role: payload.role,
      name: payload.name.trim(),
      email: cleanEmail,
      password: payload.password || 'password123',
      isVerified: payload.role === 'student' ? false : true,
      organizationOrUniversity: payload.organizationOrUniversity.trim(),
      permissions: ROLE_PERMISSIONS[payload.role] || [],
      title: payload.title || (payload.role === 'student' ? 'Undergraduate Candidate' : 'Technical Recruiter'),
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80`,
    };

    setUsers((prev) => [...prev, newUser]);

    // If student, create initial student profile
    if (payload.role === 'student') {
      const newProfile: StudentProfile = {
        userId: newUserId,
        fullName: payload.name.trim(),
        universityName: payload.organizationOrUniversity.trim(),
        universityTier: 'Emerging / Regional University',
        graduationYear: payload.graduationYear || 2026,
        degree: payload.degree || 'B.Tech / B.S. in Computer Science',
        skills: ['TypeScript', 'React', 'Problem Solving'],
        gpa: '3.5 / 4.0',
        githubUrl: 'https://github.com',
        linkedinUrl: 'https://linkedin.com',
        idCardVerified: false,
        eduEmailVerified: cleanEmail.includes('.edu') || cleanEmail.includes('.ac'),
        idCardDocumentName: 'student_id_pending_review.pdf',
        headline: 'Aspiring Software Engineer seeking merit-based skill verification',
        summary: 'Registered on DirectHire to connect directly with recruiters through benchmark testing.',
      };
      setStudentProfiles((prev) => ({ ...prev, [newUserId]: newProfile }));

      // Add to admin verification queue
      setAffiliationVerifications((prev) => [
        {
          id: `affil-${Date.now()}`,
          studentName: payload.name.trim(),
          universityName: payload.organizationOrUniversity.trim(),
          eduEmail: cleanEmail,
          idCardFile: 'student_id_pending_review.pdf',
          graduationYear: payload.graduationYear || 2026,
          status: 'pending',
          submittedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } else if (payload.role === 'recruiter') {
      // Add to recruiter org verification queue
      const emailDomain = cleanEmail.split('@')[1];
      setOrgVerifications((prev) => [
        {
          id: `org-${Date.now()}`,
          recruiterName: payload.name.trim(),
          companyName: payload.organizationOrUniversity.trim(),
          corporateEmail: cleanEmail,
          domain: emailDomain,
          domainAgeYears: 2.5,
          businessRegistrationNumber: `REG-${Date.now().toString().slice(-6)}`,
          status: 'pending',
          submittedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    setCurrentUserId(newUserId);
    return { success: true };
  };

  // RBAC Access Control Helpers
  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions.includes(permission);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    if (Array.isArray(roles)) {
      return roles.includes(currentUser.role);
    }
    return currentUser.role === roles;
  };

  const updateStudentProfile = (profile: StudentProfile) => {
    setStudentProfiles((prev) => ({
      ...prev,
      [profile.userId]: profile,
    }));
  };

  const createTest = (newTestData: Omit<CompanyTest, 'id' | 'totalAttempts' | 'passedCount' | 'createdAt'>) => {
    const id = `test-${Date.now()}`;
    const newTest: CompanyTest = {
      ...newTestData,
      id,
      totalAttempts: 0,
      passedCount: 0,
      createdAt: new Date().toISOString(),
    };
    setTests((prev) => [newTest, ...prev]);
  };

  const submitAttempt = (attemptData: Omit<TestAttempt, 'id'>): TestAttempt => {
    const id = `attempt-${Date.now()}`;
    const newAttempt: TestAttempt = {
      ...attemptData,
      id,
    };

    setAttempts((prev) => [newAttempt, ...prev]);

    // Update test stats
    setTests((prev) =>
      prev.map((t) => {
        if (t.id === newAttempt.testId) {
          return {
            ...t,
            totalAttempts: t.totalAttempts + 1,
            passedCount: newAttempt.passedCutoff ? t.passedCount + 1 : t.passedCount,
          };
        }
        return t;
      })
    );

    setActiveTestSession(null);
    setViewScorecardAttemptId(id);
    return newAttempt;
  };

  const sendInterviewInvitation = (
    invitationData: Omit<InterviewInvitation, 'id' | 'createdAt' | 'status'>
  ) => {
    const newInvite: InterviewInvitation = {
      ...invitationData,
      id: `invite-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setInterviews((prev) => [newInvite, ...prev]);
  };

  const respondInterviewInvitation = (id: string, status: 'confirmed' | 'rescheduled') => {
    setInterviews((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    );
  };

  const updateOrgVerification = (id: string, status: 'verified' | 'rejected') => {
    setOrgVerifications((prev) =>
      prev.map((org) => (org.id === id ? { ...org, status } : org))
    );
  };

  const updateAffiliationVerification = (id: string, status: 'verified' | 'rejected') => {
    setAffiliationVerifications((prev) =>
      prev.map((aff) => (aff.id === id ? { ...aff, status } : aff))
    );
  };

  const startTestSession = (test: CompanyTest) => {
    setActiveTestSession({
      test,
      startedAt: new Date().toISOString(),
    });
  };

  const endTestSession = () => {
    setActiveTestSession(null);
  };

  const resetToDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.PROFILES);
    localStorage.removeItem(STORAGE_KEYS.TESTS);
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.INTERVIEWS);
    localStorage.removeItem(STORAGE_KEYS.ORGS);
    localStorage.removeItem(STORAGE_KEYS.AFFILIATIONS);
    setUsers(SEED_USERS);
    setCurrentUserId('student-1');
    setStudentProfiles(SEED_STUDENT_PROFILES);
    setTests(SEED_TESTS);
    setAttempts(SEED_ATTEMPTS);
    setInterviews(SEED_INTERVIEWS);
    setOrgVerifications(SEED_RECRUITER_ORGS);
    setAffiliationVerifications(SEED_STUDENT_AFFILIATIONS);
    setActiveTestSession(null);
    setViewScorecardAttemptId(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        loginAsDemoUser,
        logout,
        register,
        hasPermission,
        hasRole,
        allUsers: users,
        studentProfiles,
        updateStudentProfile,
        tests,
        createTest,
        attempts,
        submitAttempt,
        interviews,
        sendInterviewInvitation,
        respondInterviewInvitation,
        orgVerifications,
        updateOrgVerification,
        affiliationVerifications,
        updateAffiliationVerification,
        activeTestSession,
        startTestSession,
        endTestSession,
        viewScorecardAttemptId,
        setViewScorecardAttemptId,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
