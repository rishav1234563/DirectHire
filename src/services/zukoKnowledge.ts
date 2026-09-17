import { StudentProfile, CompanyTest } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'zuko' | 'user';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: () => void }[];
}

export function generateZukoResponse(
  userQuery: string,
  candidateProfile?: StudentProfile | null,
  availableTests?: CompanyTest[]
): string {
  const query = userQuery.toLowerCase();

  // 1. Cutoff and ATS bypass queries
  if (
    query.includes('cutoff') ||
    query.includes('ats') ||
    query.includes('bypass') ||
    query.includes('how it works') ||
    query.includes('how does it work')
  ) {
    return `### How DirectHire's ATS-Bypass Works 🚀

Traditional ATS systems reject up to **75% of qualified candidates** simply because they lack Ivy League or Tier-1 university keywords. Here is how DirectHire flips the script:

1. **Benchmark Skill Testing**: Instead of submitting a static resume, you take a company's specific timed assessment (e.g. 20-30 mins).
2. **The Cutoff Threshold**: Each role has a transparent benchmark (e.g., **75%** for Cloud Platform, **80%** for React Architect).
3. **Automated Profile Unlock**: The exact moment your automated test score meets or exceeds the cutoff, your complete verified profile, GitHub, and full code solution unlock in the recruiter's Direct Match Pipeline.
4. **Zero Resume Screening**: Recruiters are notified immediately and schedule interviews directly onto your calendar!`;
  }

  // 2. Cooldown period queries
  if (
    query.includes('cooldown') ||
    query.includes('fail') ||
    query.includes('below cutoff') ||
    query.includes('retake') ||
    query.includes('try again')
  ) {
    return `### The 30-Day Cooldown Policy ⏱️

If your assessment score falls below the company's designated passing cutoff (for example, scoring 65% when the cutoff is 75%):

- **Shielded Identity**: Per DirectHire's candidate protection protocol, your identity and college name remain anonymized in the recruiter pool to prevent biased rejections.
- **30-Day Cooldown**: A 30-day preparation cooldown begins immediately for that specific test.
- **Diagnostic Feedback**: Your scorecard provides exact feedback on which domain MCQs and unit test cases failed so you know what to revise.
- **Other Tests**: You are free to take assessments for other companies and roles without waiting!`;
  }

  // 3. Proctoring & anti-cheat queries
  if (
    query.includes('proctor') ||
    query.includes('cheat') ||
    query.includes('webcam') ||
    query.includes('tab switch') ||
    query.includes('camera') ||
    query.includes('integrity')
  ) {
    return `### Proctoring & Integrity Stream 🛡️

DirectHire uses real-time client-side proctoring to guarantee that corporate recruiters can trust your benchmark results:

- **Tab Switch Detection**: Leaving the assessment browser tab or clicking outside the window registers a blur violation.
- **Integrity Score**: Starts at 100% and deducts points for unauthorized focus loss or tab switching. Aim for **>95%**.
- **Webcam Feed**: Active camera snapshot stream verifies you are solving the test in a focused environment.
- **Sandboxed Execution**: Your code is run in an isolated V8 execution context against hidden test cases.

💡 *Pro-Tip: Close Slack, Discord, and secondary monitors before clicking "Start Assessment" to ensure 100% integrity!*`;
  }

  // 4. College Verification queries
  if (
    query.includes('verify') ||
    query.includes('college') ||
    query.includes('university') ||
    query.includes('tier') ||
    query.includes('.edu') ||
    query.includes('id card')
  ) {
    return `### University Affiliation Verification 🎓

DirectHire is built specifically to champion talent from **non-tier-1, state, and regional universities**!

To get your profile verified:
1. Open the **University Verification** tab in the top navigation.
2. Confirm your institutional email (e.g. \`@aktu.ac.in\`, \`@sjsu.edu\`).
3. Upload a photo or PDF of your student ID card or degree certificate.
4. DirectHire's Trust & Integrity team reviews submissions within 24 hours.

Once verified, you receive the green **"College Affiliation Verified"** badge on your recruiter scorecard!`;
  }

  // 5. Coding problem advice (e.g. Container Port Allocator / Go / React)
  if (
    query.includes('code') ||
    query.includes('port') ||
    query.includes('container') ||
    query.includes('algorithm') ||
    query.includes('go') ||
    query.includes('concurrency')
  ) {
    return `### Technical Benchmark Tips 💻

For the **Container Port Range Allocator** challenge:
- **Interval Merging Logic**: Sort the allocated intervals by starting port \`a[0] - b[0]\`.
- **Overlap Check**: Start from \`current = requestedPort\`. Loop through intervals; if \`current >= start && current <= end\`, bump \`current = end + 1\`.
- **Edge Cases**: Make sure to test when the requested port is below all intervals, between intervals, or at the exact boundary of an allocated range.

For **Go Concurrency**:
- Unbuffered channels block until both a sender and receiver are synchronized.
- Always close channels on the sender side to avoid receiver deadlocks.`;
  }

  // 6. Interview queries
  if (
    query.includes('interview') ||
    query.includes('schedule') ||
    query.includes('calendar') ||
    query.includes('google meet') ||
    query.includes('invite')
  ) {
    return `### Direct Recruiter Interviews 📅

When you pass a company's benchmark cutoff:
- Recruiters bypass traditional phone screenings and invite you directly to a 45-minute technical deep dive.
- Check the **Direct Interviews** tab in the header.
- You can accept the invitation to confirm your Google Meet / Zoom link.
- Recruiters receive your scorecard, proctoring score, and submitted code beforehand, so they'll ask you to walk through your design decisions!`;
  }

  // 7. Mock Interview Question
  if (
    query.includes('mock') ||
    query.includes('question') ||
    query.includes('quiz') ||
    query.includes('practice')
  ) {
    return `### Zuko's Mock Technical Question 🧠

Here is a question frequently asked in cloud infrastructure interviews:

**Question**: *Explain what a race condition is in concurrent programming, and how you would prevent it in Go or Node.js.*

**What the interviewer looks for**:
1. Defining shared mutable state accessed by multiple threads/goroutines simultaneously with at least one write.
2. In Go: Using \`sync.Mutex\` or channel-based message passing.
3. In Node.js: Explaining the single-threaded event loop and where race conditions can still happen across asynchronous I/O awaits.

*Reply with your answer and I'll evaluate it!*`;
  }

  // 8. General fallback greeting/help
  const candidateName = candidateProfile?.fullName?.split(' ')[0] || 'there';
  const university = candidateProfile?.universityName || 'your university';

  return `### Hello ${candidateName}! 👋

I'm **Zuko**, your personal DirectHire Career & Assessment Coach. I'm here to ensure students from **${university}** showcase their true technical skills without getting filtered out by automated ATS software.

Here are a few things I can help you with:
- 🎯 **Beat the Cutoff**: Strategies for scoring 80%+ on coding and MCQ benchmarks.
- 💻 **Code Diagnostics**: Explanations for data structures, Go concurrency, and unit test debugging.
- 🛡️ **Proctoring Rules**: How to keep a clean 100% anti-cheat integrity score.
- 📅 **Interview Preparation**: What to expect in your direct calendar interviews.
- 🎓 **Credentials**: Uploading and verifying your college ID.

What would you like to explore today?`;
}
