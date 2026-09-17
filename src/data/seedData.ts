import {
  User,
  StudentProfile,
  CompanyTest,
  TestAttempt,
  InterviewInvitation,
  RecruiterOrgVerification,
  StudentAffiliationVerification,
  ROLE_PERMISSIONS,
} from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'student-1',
    role: 'student',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@aktu.ac.in',
    password: 'password123',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    isVerified: true,
    organizationOrUniversity: 'Dr. A.P.J. Abdul Kalam Technical University (Non-Tier 1)',
    permissions: ROLE_PERMISSIONS.student,
    title: 'Senior CS Undergraduate',
  },
  {
    id: 'student-2',
    role: 'student',
    name: 'Priya Nambiar',
    email: 'priya.n@sjsu.edu',
    password: 'password123',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    isVerified: true,
    organizationOrUniversity: 'San Jose State University (State College)',
    permissions: ROLE_PERMISSIONS.student,
    title: 'Software Engineering Graduate',
  },
  {
    id: 'student-3',
    role: 'student',
    name: 'Marcus Vance',
    email: 'marcus.vance@uta.edu',
    password: 'password123',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    isVerified: true,
    organizationOrUniversity: 'University of Texas at Arlington',
    permissions: ROLE_PERMISSIONS.student,
    title: 'B.S. Computer Science Senior',
  },
  {
    id: 'recruiter-1',
    role: 'recruiter',
    name: 'Sarah Lin',
    email: 's.lin@cloudscale.io',
    password: 'password123',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    isVerified: true,
    organizationOrUniversity: 'CloudScale Infrastructure Technologies',
    permissions: ROLE_PERMISSIONS.recruiter,
    title: 'Lead Technical Talent Partner',
  },
  {
    id: 'admin-1',
    role: 'admin',
    name: 'Elena Rostova',
    email: 'admin.elena@directhire.org',
    password: 'password123',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    isVerified: true,
    organizationOrUniversity: 'DirectHire Trust & Integrity Operations',
    permissions: ROLE_PERMISSIONS.admin,
    title: 'Superadmin & Integrity Lead',
  },
];

export const SEED_STUDENT_PROFILES: Record<string, StudentProfile> = {
  'student-1': {
    userId: 'student-1',
    fullName: 'Aarav Sharma',
    universityName: 'Dr. A.P.J. Abdul Kalam Technical University',
    universityTier: 'State Technical University (Regional Non-Tier 1)',
    graduationYear: 2026,
    degree: 'B.Tech in Computer Science & Engineering',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Data Structures', 'Docker'],
    gpa: '8.8 / 10.0',
    githubUrl: 'https://github.com/aaravsharma-dev',
    linkedinUrl: 'https://linkedin.com/in/aaravsharma-cse',
    idCardVerified: true,
    eduEmailVerified: true,
    idCardDocumentName: 'student_id_AKTU_2022_CS_0842.pdf',
    headline: 'High-performance Frontend & Systems Engineer building reactive web apps',
    summary:
      'Consistently scored in top 1% on competitive programming platforms. Seeking opportunities purely based on demonstrated technical benchmark benchmarks rather than college brand filters.',
  },
  'student-2': {
    userId: 'student-2',
    fullName: 'Priya Nambiar',
    universityName: 'San Jose State University',
    universityTier: 'Regional State College',
    graduationYear: 2025,
    degree: 'B.S. in Software Engineering',
    skills: ['Python', 'Distributed Systems', 'FastAPI', 'Redis', 'SQL'],
    gpa: '3.82 / 4.0',
    githubUrl: 'https://github.com/priyanambiar',
    linkedinUrl: 'https://linkedin.com/in/priya-nambiar',
    idCardVerified: true,
    eduEmailVerified: true,
    idCardDocumentName: 'sjsu_tower_card_verified.png',
    headline: 'Backend engineer focused on API throughput and distributed cache invalidation',
    summary:
      'Passionate about backend microservices, resilient queue workers, and database query optimization.',
  },
  'student-3': {
    userId: 'student-3',
    fullName: 'Marcus Vance',
    universityName: 'University of Texas at Arlington',
    universityTier: 'State University',
    graduationYear: 2026,
    degree: 'B.S. in Computer Science',
    skills: ['Go', 'TypeScript', 'Kubernetes', 'GraphQL', 'Postgres'],
    gpa: '3.75 / 4.0',
    githubUrl: 'https://github.com/marcusvance',
    linkedinUrl: 'https://linkedin.com/in/marcusvance',
    idCardVerified: true,
    eduEmailVerified: true,
    idCardDocumentName: 'uta_mav_id_card.pdf',
    headline: 'Junior Cloud & Fullstack Developer looking for verified skill-matching roles',
    summary:
      'Built open-source telemetry collectors. Solved 350+ LeetCode problems with focus on memory safety.',
  },
};

export const SEED_TESTS: CompanyTest[] = [
  {
    id: 'test-cloudscale-frontend',
    recruiterId: 'recruiter-1',
    companyName: 'CloudScale Inc.',
    companyLogo: '⚡',
    roleTitle: 'Junior Frontend Systems Engineer',
    department: 'Core Web Platform',
    location: 'San Francisco, CA / Remote',
    workType: 'Remote',
    salaryRange: '$105,000 - $125,000 + Equity',
    timeLimitMinutes: 25,
    passingCutoffPercent: 75,
    experienceLevel: 'New Grad',
    description:
      'We build low-latency cloud infrastructure consoles. We evaluate purely on your understanding of reactive rendering cycles, closure scopes, state reconciliation, and algorithmic string/array processing.',
    skillsRequired: ['React', 'TypeScript', 'Algorithms', 'DOM Performance', 'CSS Layout'],
    mcqs: [
      {
        id: 'mcq-1',
        topic: 'React Re-render Mechanics',
        question:
          'When does a React functional component re-render if a parent passes an inline object literal like style={{ color: "red" }} as a prop?',
        options: [
          'Only when the parent component unmounts.',
          'On every parent render, because a new object reference is created in memory.',
          'Never, because React performs a deep equality comparison on props automatically.',
          'Only if React.memo is explicitly configured with a custom arePropsEqual handler.',
        ],
        correctIndex: 1,
        explanation:
          'Object literals create fresh object identities in memory on each render. If passed to memoized children, shallow reference comparison (===) fails, triggering re-renders unless memoized with useMemo.',
        points: 10,
      },
      {
        id: 'mcq-2',
        topic: 'JavaScript Event Loop & Microtasks',
        question:
          'In what exact order will the following console messages output?\n\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);',
        options: ['1, 2, 3, 4', '1, 4, 2, 3', '1, 4, 3, 2', '3, 1, 4, 2'],
        correctIndex: 2,
        explanation:
          'Synchronous code runs first (1, 4). Microtasks queue (Promise.then) executes immediately after synchronous code (3). Macrotasks (setTimeout) execute in the next tick (2).',
        points: 10,
      },
      {
        id: 'mcq-3',
        topic: 'Browser Performance & Reflow',
        question:
          'Which of the following CSS property changes is GPU-accelerated and avoids triggering a CPU layout reflow in modern rendering engines?',
        options: [
          'Changing element width from 200px to 300px',
          'Changing element margin-top from 10px to 40px',
          'Applying transform: translate3d(x, y, 0) and opacity',
          'Modifying element font-size dynamically',
        ],
        correctIndex: 2,
        explanation:
          'Transforms and opacity can be composited directly on the GPU without triggering layout (reflow) or paint passes on the main thread.',
        points: 10,
      },
      {
        id: 'mcq-4',
        topic: 'TypeScript Type Narrowing',
        question:
          'Given type Shape = { kind: "circle"; radius: number } | { kind: "square"; side: number }, what mechanism allows TypeScript to narrow the union safely in an if block?',
        options: [
          'Duck typing coercion',
          'Discriminated union narrowing via the common literal "kind" field',
          'Dynamic runtime reflection metadata',
          'Prototype chain walking',
        ],
        correctIndex: 1,
        explanation:
          'TypeScript treats string literal properties with distinct constant values across variants as discriminants, enabling exhaustiveness checking and safe narrowing.',
        points: 10,
      },
    ],
    codingChallenge: {
      id: 'coding-frontend-1',
      title: 'Valid Parentheses and Tag Parser',
      difficulty: 'Medium',
      description:
        'Write a function `isValidMarkup(str: string): boolean` that takes a string containing brackets `()`, `[]`, `{}` as well as angle brackets `<>` and determines if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
      starterCode: `function isValidMarkup(str) {
  // Implement your solution here
  const stack = [];
  const map = {
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<'
  };

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '(' || char === '[' || char === '{' || char === '<') {
      stack.push(char);
    } else if (map[char]) {
      if (stack.length === 0 || stack.pop() !== map[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}`,
      language: 'javascript',
      points: 60,
      timeLimitSec: 2,
      testCases: [
        {
          id: 'tc-1',
          input: '"{[()<>]}"',
          expectedOutput: 'true',
          isHidden: false,
        },
        {
          id: 'tc-2',
          input: '"([)]"',
          expectedOutput: 'false',
          isHidden: false,
        },
        {
          id: 'tc-3',
          input: '"<div><span></span></div>"',
          expectedOutput: 'true',
          isHidden: false,
        },
        {
          id: 'tc-4',
          input: '"][{"',
          expectedOutput: 'false',
          isHidden: true,
        },
        {
          id: 'tc-5',
          input: '"((((<[{} ]>))))"',
          expectedOutput: 'true',
          isHidden: true,
        },
      ],
    },
    createdAt: '2026-03-01T10:00:00Z',
    totalAttempts: 24,
    passedCount: 7,
    status: 'active',
  },
  {
    id: 'test-finledger-backend',
    recruiterId: 'recruiter-1',
    companyName: 'FinLedger Systems',
    companyLogo: '🏦',
    roleTitle: 'Associate Distributed Systems Engineer',
    department: 'Transaction Infrastructure',
    location: 'New York, NY / Remote',
    workType: 'Remote',
    salaryRange: '$110,000 - $130,000 + Signing Bonus',
    timeLimitMinutes: 30,
    passingCutoffPercent: 80,
    experienceLevel: 'Entry-Level',
    description:
      'We process 200,000 transactions per second. We test your knowledge of ACID transactions, idempotency keys, distributed consensus, and concurrency-safe data structures.',
    skillsRequired: ['Node.js', 'PostgreSQL', 'Idempotency', 'Distributed Systems', 'Redis'],
    mcqs: [
      {
        id: 'fin-mcq-1',
        topic: 'Database Concurrency & Isolation',
        question:
          'Under the PostgreSQL "Read Committed" transaction isolation level, what concurrency anomaly is still possible?',
        options: [
          'Dirty Reads (reading uncommitted changes from another transaction)',
          'Non-repeatable Reads (a row read twice within the same transaction differs)',
          'Physical memory corruption of WAL logs',
          'Automatic rollback of all subsequent transactions',
        ],
        correctIndex: 1,
        explanation:
          'In Read Committed, each SELECT statement sees a snapshot taken when that statement starts. If another transaction commits an UPDATE in between, a subsequent SELECT in the first transaction will see the newly committed value.',
        points: 10,
      },
      {
        id: 'fin-mcq-2',
        topic: 'API Idempotency',
        question:
          'What is the primary architectural purpose of an "Idempotency-Key" header in financial POST request transactions?',
        options: [
          'To encrypt credit card numbers in transit.',
          'To ensure that network retries or duplicate client submissions execute the payment exactly once.',
          'To bypass database indexing bottlenecks.',
          'To rate-limit requests to 1 request per second.',
        ],
        correctIndex: 1,
        explanation:
          'Idempotency keys allow the server to cache the original response against the key. If an identical request arrives due to network timeout or retry, the server returns the cached response without double-charging.',
        points: 10,
      },
      {
        id: 'fin-mcq-3',
        topic: 'Distributed Caching',
        question:
          'When using the Cache-Aside (Lazy Loading) pattern with Redis and a database, what is the safest strategy upon updating a database record?',
        options: [
          'Write to Redis first and ignore database errors.',
          'Update the database first, then invalidate (delete) the cached key in Redis.',
          'Keep both in sync using client-side WebSockets.',
          'Reboot the Redis cluster on every write.',
        ],
        correctIndex: 1,
        explanation:
          'Updating the primary persistent datastore first and then evicting/deleting the cached key avoids race conditions and stale writes that occur when trying to update cache values directly.',
        points: 10,
      },
    ],
    codingChallenge: {
      id: 'coding-backend-1',
      title: 'Transaction Idempotency Window Verifier',
      difficulty: 'Medium',
      description:
        'Write a function `findDuplicateTransactions(transactions)` where transactions is an array of objects `{ id: string, amount: number, timestamp: number }`.\n\nA duplicate is defined as any transaction with the EXACT SAME amount as a previous transaction occurring within 60 seconds (inclusive) of each other. Return the count of duplicate transactions detected.',
      starterCode: `function findDuplicateTransactions(transactions) {
  // Sort transactions by timestamp
  const sorted = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
  let duplicateCount = 0;
  
  for (let i = 1; i < sorted.length; i++) {
    // Check against previous transactions within 60s
    for (let j = i - 1; j >= 0; j--) {
      const timeDiff = sorted[i].timestamp - sorted[j].timestamp;
      if (timeDiff > 60) break;
      if (sorted[i].amount === sorted[j].amount) {
        duplicateCount++;
        break;
      }
    }
  }
  
  return duplicateCount;
}`,
      language: 'javascript',
      points: 70,
      timeLimitSec: 2,
      testCases: [
        {
          id: 'fin-tc-1',
          input:
            '[{ "id": "t1", "amount": 100, "timestamp": 10 }, { "id": "t2", "amount": 100, "timestamp": 45 }]',
          expectedOutput: '1',
          isHidden: false,
        },
        {
          id: 'fin-tc-2',
          input:
            '[{ "id": "t1", "amount": 50, "timestamp": 10 }, { "id": "t2", "amount": 50, "timestamp": 85 }]',
          expectedOutput: '0',
          isHidden: false,
        },
        {
          id: 'fin-tc-3',
          input:
            '[{ "id": "t1", "amount": 25, "timestamp": 5 }, { "id": "t2", "amount": 25, "timestamp": 20 }, { "id": "t3", "amount": 25, "timestamp": 35 }]',
          expectedOutput: '2',
          isHidden: true,
        },
      ],
    },
    createdAt: '2026-03-05T14:30:00Z',
    totalAttempts: 18,
    passedCount: 4,
    status: 'active',
  },
  {
    id: 'test-omnidata-fullstack',
    recruiterId: 'recruiter-1',
    companyName: 'OmniData Labs',
    companyLogo: '🧬',
    roleTitle: 'Junior Fullstack Engineer (APIs & UI)',
    department: 'Data Pipelines',
    location: 'Austin, TX / Hybrid',
    workType: 'Hybrid',
    salaryRange: '$95,000 - $115,000',
    timeLimitMinutes: 20,
    passingCutoffPercent: 70,
    experienceLevel: 'Entry-Level',
    description:
      'Direct benchmark for fullstack juniors. We evaluate end-to-end API serialization, data structures, and client state orchestration.',
    skillsRequired: ['TypeScript', 'Express', 'React', 'REST', 'Jest'],
    mcqs: [
      {
        id: 'omni-mcq-1',
        topic: 'HTTP Methods & Idempotence',
        question: 'Which of the following HTTP methods is defined as idempotent according to RFC 9110?',
        options: ['POST', 'PATCH', 'PUT', 'CONNECT'],
        correctIndex: 2,
        explanation:
          'PUT and DELETE are idempotent because executing them repeatedly results in the exact same server state representation. POST and PATCH are generally non-idempotent.',
        points: 15,
      },
      {
        id: 'omni-mcq-2',
        topic: 'SQL Indexing',
        question:
          'If a table frequently queries: SELECT * FROM users WHERE country = "IN" AND age > 21 ORDER BY created_at, what composite index will be most optimal?',
        options: [
          'INDEX(created_at, country, age)',
          'INDEX(country, age, created_at) following equality-first then range column ordering',
          'INDEX(age, created_at, country)',
          'Three separate single-column indices',
        ],
        correctIndex: 1,
        explanation:
          'Optimal composite indexes follow the Equality-Range-Sort rule: columns with equality operators (=) first, then range operators (<, >), then sort keys.',
        points: 15,
      },
    ],
    codingChallenge: {
      id: 'coding-omni-1',
      title: 'String Character Frequency Compression',
      difficulty: 'Easy',
      description:
        'Write a function `compressString(s)` that takes a string of lowercase letters and compresses consecutive duplicate characters into character followed by count (e.g. "aabcccccaaa" -> "a2b1c5a3"). If the compressed string is not smaller than original, return original.',
      starterCode: `function compressString(s) {
  if (!s || s.length <= 2) return s;
  let compressed = '';
  let count = 1;
  
  for (let i = 0; i < s.length; i++) {
    if (i + 1 < s.length && s[i] === s[i + 1]) {
      count++;
    } else {
      compressed += s[i] + count;
      count = 1;
    }
  }
  
  return compressed.length < s.length ? compressed : s;
}`,
      language: 'javascript',
      points: 70,
      timeLimitSec: 2,
      testCases: [
        {
          id: 'omni-tc-1',
          input: '"aabcccccaaa"',
          expectedOutput: '"a2b1c5a3"',
          isHidden: false,
        },
        {
          id: 'omni-tc-2',
          input: '"abcdef"',
          expectedOutput: '"abcdef"',
          isHidden: false,
        },
        {
          id: 'omni-tc-3',
          input: '"wwwwaaadexxxxx"',
          expectedOutput: '"w4a3d1e1x5"',
          isHidden: true,
        },
      ],
    },
    createdAt: '2026-03-08T09:00:00Z',
    totalAttempts: 31,
    passedCount: 12,
    status: 'active',
  },
];

export const SEED_ATTEMPTS: TestAttempt[] = [
  {
    id: 'attempt-1',
    testId: 'test-cloudscale-frontend',
    studentId: 'student-1',
    startedAt: '2026-03-12T14:00:00Z',
    completedAt: '2026-03-12T14:18:22Z',
    timeSpentSeconds: 1102,
    mcqScore: 40,
    mcqTotal: 40,
    codingScore: 60,
    codingTotal: 60,
    totalScorePercent: 100,
    passedCutoff: true,
    proctoringScorePercent: 99,
    violations: [],
    submittedCode: `function isValidMarkup(str) {
  const stack = [];
  const map = { ')': '(', ']': '[', '}': '{', '>': '<' };
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '(' || char === '[' || char === '{' || char === '<') {
      stack.push(char);
    } else if (map[char]) {
      if (stack.length === 0 || stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
    testCaseResults: [
      {
        testCaseId: 'tc-1',
        input: '"{[()<>]}"',
        expectedOutput: 'true',
        actualOutput: 'true',
        passed: true,
        executionTimeMs: 1.2,
      },
      {
        testCaseId: 'tc-2',
        input: '"([)]"',
        expectedOutput: 'false',
        actualOutput: 'false',
        passed: true,
        executionTimeMs: 0.8,
      },
      {
        testCaseId: 'tc-3',
        input: '"<div><span></span></div>"',
        expectedOutput: 'true',
        actualOutput: 'true',
        passed: true,
        executionTimeMs: 1.5,
      },
      {
        testCaseId: 'tc-4',
        input: '"][{"',
        expectedOutput: 'false',
        actualOutput: 'false',
        passed: true,
        executionTimeMs: 0.6,
      },
      {
        testCaseId: 'tc-5',
        input: '"((((<[{} ]>))))"',
        expectedOutput: 'true',
        actualOutput: 'true',
        passed: true,
        executionTimeMs: 1.1,
      },
    ],
    answersMCQ: {
      'mcq-1': 1,
      'mcq-2': 2,
      'mcq-3': 2,
      'mcq-4': 1,
    },
    status: 'completed',
  },
  {
    id: 'attempt-2',
    testId: 'test-cloudscale-frontend',
    studentId: 'student-2',
    startedAt: '2026-03-10T11:00:00Z',
    completedAt: '2026-03-10T11:22:15Z',
    timeSpentSeconds: 1335,
    mcqScore: 30,
    mcqTotal: 40,
    codingScore: 60,
    codingTotal: 60,
    totalScorePercent: 90,
    passedCutoff: true,
    proctoringScorePercent: 95,
    violations: [
      {
        id: 'viol-1',
        timestamp: '2026-03-10T11:12:05Z',
        type: 'tab_switch',
        message: 'Student switched away from assessment window (duration: 3.2s)',
        severity: 'low',
      },
    ],
    submittedCode: `function isValidMarkup(str) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{', '>': '<' };
  for (const c of str) {
    if ('([{<'.includes(c)) stack.push(c);
    else if (pairs[c]) {
      if (stack.pop() !== pairs[c]) return false;
    }
  }
  return stack.length === 0;
}`,
    testCaseResults: [
      { testCaseId: 'tc-1', input: '"{[()<>]}"', expectedOutput: 'true', actualOutput: 'true', passed: true, executionTimeMs: 1.1 },
      { testCaseId: 'tc-2', input: '"([)]"', expectedOutput: 'false', actualOutput: 'false', passed: true, executionTimeMs: 0.9 },
      { testCaseId: 'tc-3', input: '"<div><span></span></div>"', expectedOutput: 'true', actualOutput: 'true', passed: true, executionTimeMs: 1.4 },
      { testCaseId: 'tc-4', input: '"][{"', expectedOutput: 'false', actualOutput: 'false', passed: true, executionTimeMs: 0.5 },
      { testCaseId: 'tc-5', input: '"((((<[{} ]>))))"', expectedOutput: 'true', actualOutput: 'true', passed: true, executionTimeMs: 1.0 },
    ],
    answersMCQ: {
      'mcq-1': 1,
      'mcq-2': 1, // missed
      'mcq-3': 2,
      'mcq-4': 1,
    },
    status: 'completed',
  },
  {
    id: 'attempt-3',
    testId: 'test-finledger-backend',
    studentId: 'student-3',
    startedAt: '2026-03-14T16:00:00Z',
    completedAt: '2026-03-14T16:28:40Z',
    timeSpentSeconds: 1720,
    mcqScore: 20,
    mcqTotal: 30,
    codingScore: 45,
    codingTotal: 70,
    totalScorePercent: 65,
    passedCutoff: false, // Cutoff is 80%!
    cooldownEndsAt: '2026-04-14T16:28:40Z',
    proctoringScorePercent: 96,
    violations: [
      {
        id: 'viol-2',
        timestamp: '2026-03-14T16:15:30Z',
        type: 'window_blur',
        message: 'Browser window lost focus for 4 seconds',
        severity: 'low',
      },
    ],
    submittedCode: `function findDuplicateTransactions(transactions) {
  let count = 0;
  for (let i = 0; i < transactions.length; i++) {
    for (let j = i + 1; j < transactions.length; j++) {
      if (transactions[i].amount === transactions[j].amount && Math.abs(transactions[i].timestamp - transactions[j].timestamp) <= 60) {
        count++;
      }
    }
  }
  return count;
}`,
    testCaseResults: [
      { testCaseId: 'fin-tc-1', input: 'sample', expectedOutput: '1', actualOutput: '1', passed: true, executionTimeMs: 2.1 },
      { testCaseId: 'fin-tc-2', input: 'sample', expectedOutput: '0', actualOutput: '0', passed: true, executionTimeMs: 1.5 },
      { testCaseId: 'fin-tc-3', input: 'sample', expectedOutput: '2', actualOutput: '3', passed: false, executionTimeMs: 2.4, error: 'Double counted transitive duplicates: expected 2, got 3' },
    ],
    answersMCQ: {
      'fin-mcq-1': 1,
      'fin-mcq-2': 0, // missed
      'fin-mcq-3': 1,
    },
    status: 'completed',
  },
];

export const SEED_INTERVIEWS: InterviewInvitation[] = [
  {
    id: 'interview-1',
    attemptId: 'attempt-1',
    testId: 'test-cloudscale-frontend',
    studentId: 'student-1',
    recruiterId: 'recruiter-1',
    companyName: 'CloudScale Inc.',
    roleTitle: 'Junior Frontend Systems Engineer',
    date: '2026-03-24',
    time: '14:30',
    timezone: 'EST (US & Canada)',
    interviewType: 'Pair Programming',
    meetingLink: 'https://meet.google.com/drt-hrec-wkp',
    status: 'confirmed',
    recruiterNote:
      'Aarav, your score of 100% on our DOM parser and React mechanics benchmark bypassed resume screening. We would love to do a 45-min live pair programming round with our Senior Staff Engineer!',
    createdAt: '2026-03-13T10:15:00Z',
  },
];

export const SEED_RECRUITER_ORGS: RecruiterOrgVerification[] = [
  {
    id: 'org-verif-1',
    recruiterName: 'Sarah Lin',
    companyName: 'CloudScale Infrastructure',
    corporateEmail: 's.lin@cloudscale.io',
    domain: 'cloudscale.io',
    domainAgeYears: 6.4,
    businessRegistrationNumber: 'DEL-2019-94812C',
    status: 'verified',
    submittedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'org-verif-2',
    recruiterName: 'David K.',
    companyName: 'FinLedger Systems Inc.',
    corporateEmail: 'd.k@finledger.com',
    domain: 'finledger.com',
    domainAgeYears: 4.8,
    businessRegistrationNumber: 'NY-LLC-88129',
    status: 'verified',
    submittedAt: '2026-02-01T11:00:00Z',
  },
  {
    id: 'org-verif-3',
    recruiterName: 'Alex Thorne',
    companyName: 'Apex Data Cloud',
    corporateEmail: 'alex@apexdatacloud.net',
    domain: 'apexdatacloud.net',
    domainAgeYears: 0.8,
    businessRegistrationNumber: 'TX-PENDING-4412',
    status: 'pending',
    submittedAt: '2026-03-15T08:20:00Z',
  },
];

export const SEED_STUDENT_AFFILIATIONS: StudentAffiliationVerification[] = [
  {
    id: 'affil-1',
    studentName: 'Aarav Sharma',
    universityName: 'Dr. A.P.J. Abdul Kalam Technical University',
    eduEmail: 'aarav.sharma@aktu.ac.in',
    idCardFile: 'AKTU_Official_Smart_ID_2026.pdf',
    graduationYear: 2026,
    status: 'verified',
    submittedAt: '2026-02-10T14:00:00Z',
  },
  {
    id: 'affil-2',
    studentName: 'Priya Nambiar',
    universityName: 'San Jose State University',
    eduEmail: 'priya.n@sjsu.edu',
    idCardFile: 'SJSU_Tower_ID_Card.png',
    graduationYear: 2025,
    status: 'verified',
    submittedAt: '2026-02-12T10:00:00Z',
  },
  {
    id: 'affil-3',
    studentName: 'Rohan Mehra',
    universityName: 'Haldia Institute of Technology',
    eduEmail: 'rohan.m@hithaldia.in',
    idCardFile: 'HIT_Student_Affiliation_Cert.pdf',
    graduationYear: 2026,
    status: 'pending',
    submittedAt: '2026-03-16T12:45:00Z',
  },
];
