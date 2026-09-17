export type UserRole = 'student' | 'recruiter' | 'admin';

export type Permission =
  | 'take_assessment'
  | 'view_scorecard'
  | 'view_interviews'
  | 'edit_student_profile'
  | 'create_test'
  | 'view_recruiter_pipeline'
  | 'schedule_interview'
  | 'verify_orgs'
  | 'verify_students'
  | 'view_proctoring_stream'
  | 'manage_users';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: [
    'take_assessment',
    'view_scorecard',
    'view_interviews',
    'edit_student_profile',
  ],
  recruiter: [
    'create_test',
    'view_recruiter_pipeline',
    'schedule_interview',
    'view_scorecard',
  ],
  admin: [
    'verify_orgs',
    'verify_students',
    'view_proctoring_stream',
    'manage_users',
    'view_recruiter_pipeline',
    'view_scorecard',
  ],
};

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  isVerified: boolean;
  organizationOrUniversity: string;
  permissions: Permission[];
  title?: string;
}

export interface StudentProfile {
  userId: string;
  fullName: string;
  universityName: string;
  universityTier: string; // e.g. 'Regional State University', 'Tier-2/3 Technical Institute'
  graduationYear: number;
  degree: string;
  skills: string[];
  gpa: string;
  githubUrl: string;
  linkedinUrl: string;
  idCardVerified: boolean;
  eduEmailVerified: boolean;
  idCardDocumentName?: string;
  headline: string;
  summary: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  points: number;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface CodingChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starterCode: string;
  language: string;
  testCases: TestCase[];
  points: number;
  timeLimitSec: number;
}

export interface CompanyTest {
  id: string;
  recruiterId: string;
  companyName: string;
  companyLogo: string;
  roleTitle: string;
  department: string;
  location: string;
  workType: 'Remote' | 'Hybrid' | 'On-site';
  salaryRange: string;
  timeLimitMinutes: number;
  passingCutoffPercent: number; // e.g. 75%
  experienceLevel: 'Entry-Level' | 'Junior' | 'New Grad';
  description: string;
  skillsRequired: string[];
  mcqs: MCQQuestion[];
  codingChallenge: CodingChallenge;
  createdAt: string;
  totalAttempts: number;
  passedCount: number;
  status: 'active' | 'draft' | 'archived';
}

export interface ProctoringViolation {
  id: string;
  timestamp: string;
  type: 'tab_switch' | 'window_blur' | 'fullscreen_exit' | 'multiple_faces' | 'no_face';
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface TestCaseResult {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTimeMs: number;
  error?: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  startedAt: string;
  completedAt: string;
  timeSpentSeconds: number;
  mcqScore: number;
  mcqTotal: number;
  codingScore: number;
  codingTotal: number;
  totalScorePercent: number;
  passedCutoff: boolean;
  cooldownEndsAt?: string; // 30 days if failed
  proctoringScorePercent: number; // e.g. 98%
  violations: ProctoringViolation[];
  submittedCode: string;
  testCaseResults: TestCaseResult[];
  answersMCQ: Record<string, number>;
  status: 'completed' | 'in_progress';
}

export interface InterviewInvitation {
  id: string;
  attemptId: string;
  testId: string;
  studentId: string;
  recruiterId: string;
  companyName: string;
  roleTitle: string;
  date: string;
  time: string;
  timezone: string;
  interviewType: 'Technical Screen' | 'Pair Programming' | 'System Discussion';
  meetingLink: string;
  status: 'pending' | 'confirmed' | 'rescheduled';
  recruiterNote: string;
  createdAt: string;
}

export interface RecruiterOrgVerification {
  id: string;
  recruiterName: string;
  companyName: string;
  corporateEmail: string;
  domain: string;
  domainAgeYears: number;
  businessRegistrationNumber: string;
  status: 'verified' | 'pending' | 'rejected';
  submittedAt: string;
}

export interface StudentAffiliationVerification {
  id: string;
  studentName: string;
  universityName: string;
  eduEmail: string;
  idCardFile: string;
  graduationYear: number;
  status: 'verified' | 'pending' | 'rejected';
  submittedAt: string;
}
