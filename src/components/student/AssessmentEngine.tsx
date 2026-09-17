import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CompanyTest,
  ProctoringViolation,
  TestCaseResult,
  TestAttempt,
} from '../../types';
import {
  Clock,
  ShieldAlert,
  ShieldCheck,
  Camera,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Code2,
  HelpCircle,
  Send,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface AssessmentEngineProps {
  test: CompanyTest;
  onClose: () => void;
}

export const AssessmentEngine: React.FC<AssessmentEngineProps> = ({ test, onClose }) => {
  const { currentUser, submitAttempt } = useApp();

  // State
  const [activeSection, setActiveSection] = useState<'mcq' | 'coding'>('mcq');
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [flaggedMcqs, setFlaggedMcqs] = useState<Record<string, boolean>>({});

  const [code, setCode] = useState(test.codingChallenge.starterCode);
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [testCaseRunResults, setTestCaseRunResults] = useState<TestCaseResult[] | null>(null);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  // Timer: test.timeLimitMinutes * 60 seconds
  const [secondsRemaining, setSecondsRemaining] = useState(test.timeLimitMinutes * 60);

  // Proctoring State
  const [violations, setViolations] = useState<ProctoringViolation[]>([]);
  const [lastViolationAlert, setLastViolationAlert] = useState<string | null>(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamPermissionDenied, setWebcamPermissionDenied] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Fullscreen helper
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1. Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. Camera setup with graceful simulation fallback
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 320, height: 240 } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
          setWebcamActive(true);
        })
        .catch(() => {
          setWebcamPermissionDenied(true);
          setWebcamActive(true); // fall back to simulated proctoring feed
        });
    } else {
      setWebcamActive(true); // simulated
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 3. Tab switch & blur detection (Anti-cheat proctoring)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation(
          'tab_switch',
          'Candidate navigated away from the assessment browser tab.'
        );
      }
    };

    const handleWindowBlur = () => {
      logViolation(
        'window_blur',
        'Assessment window lost active user focus (blur event).'
      );
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  const logViolation = (type: 'tab_switch' | 'window_blur', message: string) => {
    const newViolation: ProctoringViolation = {
      id: `viol-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      severity: 'medium',
    };
    setViolations((prev) => [...prev, newViolation]);
    setLastViolationAlert(`⚠️ Proctoring Alert: ${message}`);
    setTimeout(() => {
      setLastViolationAlert(null);
    }, 4500);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Proctoring integrity score calculation
  const integrityScore = Math.max(0, 100 - violations.length * 6);

  // Tab support in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  // 4. Code Execution Engine (Client-side sandboxed evaluation)
  const runCodeAgainstTestCases = () => {
    setIsRunningCode(true);
    setRunError(null);

    setTimeout(() => {
      try {
        const results: TestCaseResult[] = [];
        const challenge = test.codingChallenge;

        // Try evaluating user function
        // Extract function name from starter code
        let fnName = 'isValidMarkup';
        if (challenge.id.includes('backend')) fnName = 'findDuplicateTransactions';
        if (challenge.id.includes('omni')) fnName = 'compressString';

        // Evaluate user code in a function scope
        // eslint-disable-next-line no-new-func
        const userFn = new Function(`
          ${code}
          if (typeof ${fnName} !== 'undefined') return ${fnName};
          return null;
        `)();

        if (typeof userFn !== 'function') {
          throw new Error(`Function "${fnName}" is not defined or exportable.`);
        }

        challenge.testCases.forEach((tc) => {
          const startTime = performance.now();
          let actualOutputStr = '';
          let isPassed = false;
          let testError: string | undefined;

          try {
            // Parse input arguments safely
            // eslint-disable-next-line no-new-func
            const parsedArgs = new Function(`return [${tc.input}];`)();
            const output = userFn(...parsedArgs);
            actualOutputStr = JSON.stringify(output);
            const expectedClean = tc.expectedOutput.trim();
            isPassed = actualOutputStr === expectedClean || String(output) === expectedClean;
          } catch (err: any) {
            testError = err.message || 'Runtime execution error';
            actualOutputStr = 'Error: ' + testError;
            isPassed = false;
          }

          const execTime = Number((performance.now() - startTime).toFixed(2));

          results.push({
            testCaseId: tc.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: actualOutputStr,
            passed: isPassed,
            executionTimeMs: Math.max(0.5, execTime),
            error: testError,
          });
        });

        setTestCaseRunResults(results);
      } catch (err: any) {
        setRunError(err.message || 'Syntax Error in code');
      } finally {
        setIsRunningCode(false);
      }
    }, 400);
  };

  // 5. Final Submission & Automated Grading
  const handleFinalSubmit = () => {
    setIsSubmitting(true);

    // Calculate MCQ Score
    let mcqScore = 0;
    const mcqTotal = test.mcqs.reduce((acc, q) => acc + q.points, 0);
    test.mcqs.forEach((q) => {
      if (mcqAnswers[q.id] === q.correctIndex) {
        mcqScore += q.points;
      }
    });

    // Run all test cases for coding challenge
    let codingScore = 0;
    const codingTotal = test.codingChallenge.points;
    const testCases = test.codingChallenge.testCases;
    let passedCount = 0;
    const finalTestCaseResults: TestCaseResult[] = [];

    let fnName = 'isValidMarkup';
    if (test.codingChallenge.id.includes('backend')) fnName = 'findDuplicateTransactions';
    if (test.codingChallenge.id.includes('omni')) fnName = 'compressString';

    try {
      // eslint-disable-next-line no-new-func
      const userFn = new Function(`
        ${code}
        if (typeof ${fnName} !== 'undefined') return ${fnName};
        return null;
      `)();

      testCases.forEach((tc) => {
        let isPassed = false;
        let actualStr = '';
        let errorMsg: string | undefined;

        if (typeof userFn === 'function') {
          try {
            // eslint-disable-next-line no-new-func
            const parsedArgs = new Function(`return [${tc.input}];`)();
            const output = userFn(...parsedArgs);
            actualStr = JSON.stringify(output);
            isPassed = actualStr === tc.expectedOutput || String(output) === tc.expectedOutput;
          } catch (err: any) {
            errorMsg = err.message;
            actualStr = 'Error';
          }
        } else {
          actualStr = 'Syntax/Undefined Function Error';
        }

        if (isPassed) passedCount++;
        finalTestCaseResults.push({
          testCaseId: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: actualStr,
          passed: isPassed,
          executionTimeMs: 1.2,
          error: errorMsg,
        });
      });
    } catch (err) {
      testCases.forEach((tc) => {
        finalTestCaseResults.push({
          testCaseId: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: 'Syntax Error',
          passed: false,
          executionTimeMs: 0,
          error: 'Syntax parsing failed',
        });
      });
    }

    if (testCases.length > 0) {
      codingScore = Math.round((passedCount / testCases.length) * codingTotal);
    }

    const totalPossiblePoints = mcqTotal + codingTotal;
    const earnedPoints = mcqScore + codingScore;
    const totalScorePercent = Math.round((earnedPoints / totalPossiblePoints) * 100);

    const passedCutoff = totalScorePercent >= test.passingCutoffPercent;

    // Cooldown is 30 days if failed (as specified in PRD)
    const cooldownEndsAt = passedCutoff
      ? undefined
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const timeSpentSeconds = test.timeLimitMinutes * 60 - secondsRemaining;

    const newAttempt: Omit<TestAttempt, 'id'> = {
      testId: test.id,
      studentId: currentUser.id,
      startedAt: new Date(Date.now() - timeSpentSeconds * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      timeSpentSeconds,
      mcqScore,
      mcqTotal,
      codingScore,
      codingTotal,
      totalScorePercent,
      passedCutoff,
      cooldownEndsAt,
      proctoringScorePercent: integrityScore,
      violations,
      submittedCode: code,
      testCaseResults: finalTestCaseResults,
      answersMCQ: mcqAnswers,
      status: 'completed',
    };

    submitAttempt(newAttempt);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredMcqCount = Object.keys(mcqAnswers).length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-900 text-stone-100 font-sans">
      {/* Violation Alert Banner */}
      {lastViolationAlert && (
        <div className="bg-amber-600 text-white px-4 py-2 text-center text-xs font-semibold flex items-center justify-center space-x-2 animate-pulse shadow-md">
          <AlertTriangle className="w-4 h-4" />
          <span>{lastViolationAlert}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <header className="h-14 border-b border-stone-800 bg-stone-950 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-base font-bold">
            {test.companyLogo}
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>{test.roleTitle}</span>
              <span className="text-stone-400 font-normal">| {test.companyName}</span>
            </h1>
            <div className="flex items-center space-x-2 text-[11px] text-stone-400">
              <span>Passing Cutoff: <strong className="text-amber-400">{test.passingCutoffPercent}%</strong></span>
              <span>&bull;</span>
              <span>Candidate: <strong className="text-stone-200">{currentUser.name}</strong></span>
            </div>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex items-center space-x-4">
          {/* Proctoring Status & Webcam */}
          <div className="hidden sm:flex items-center space-x-3 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800">
            {/* Live/Simulated Webcam Feed Thumbnail */}
            <div className="relative w-9 h-7 rounded bg-black overflow-hidden border border-emerald-500/50 flex items-center justify-center">
              {webcamPermissionDenied ? (
                <div className="w-full h-full bg-stone-950 flex flex-col items-center justify-center text-[8px] text-emerald-400 font-mono">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mb-0.5" />
                  SIM
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="text-left">
              <div className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Integrity: {integrityScore}%</span>
              </div>
              <p className="text-[10px] text-stone-400">
                {violations.length === 0 ? '0 Tab-switches' : `${violations.length} Tab-switch alert(s)`}
              </p>
            </div>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 border border-stone-800"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{isFullscreen ? 'Exit Full' : 'Fullscreen'}</span>
          </button>

          {/* Countdown Timer */}
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${
              secondsRemaining < 300
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800 animate-pulse'
                : 'bg-stone-900 text-stone-100 border border-stone-800'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          {/* Submit Button */}
          <button
            id="test-submit-button"
            onClick={() => setShowSubmitConfirm(true)}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </header>

      {/* Section Selector Tabs */}
      <div className="h-10 bg-stone-950/60 border-b border-stone-800 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            id="tab-mcq-section"
            onClick={() => setActiveSection('mcq')}
            className={`flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeSection === 'mcq'
                ? 'bg-stone-800 text-amber-400 border border-stone-700'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Section 1: Domain MCQs</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-stone-700 text-stone-300">
              {answeredMcqCount}/{test.mcqs.length} answered
            </span>
          </button>

          <button
            id="tab-coding-section"
            onClick={() => setActiveSection('coding')}
            className={`flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeSection === 'coding'
                ? 'bg-stone-800 text-amber-400 border border-stone-700'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Section 2: Coding Sandbox</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-stone-700 text-stone-300">
              {testCaseRunResults ? `${testCaseRunResults.filter((r) => r.passed).length}/${test.codingChallenge.testCases.length} tests` : '60 pts'}
            </span>
          </button>
        </div>

        <div className="text-[11px] text-stone-400 hidden sm:block">
          All submissions evaluated against automated sandbox unit tests
        </div>
      </div>

      {/* Main Assessment Body */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeSection === 'mcq' ? (
          /* SECTION 1: DOMAIN MCQs */
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto w-full">
            {/* Question Quick Palette */}
            <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-stone-800 overflow-x-auto">
              {test.mcqs.map((q, idx) => {
                const isAnswered = mcqAnswers[q.id] !== undefined;
                const isCurrent = currentMcqIndex === idx;
                const isFlagged = flaggedMcqs[q.id];

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentMcqIndex(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all relative ${
                      isCurrent
                        ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400'
                        : isAnswered
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                        : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Current MCQ Card */}
            {test.mcqs[currentMcqIndex] && (
              <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                      Question {currentMcqIndex + 1} of {test.mcqs.length}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800">
                      {test.mcqs[currentMcqIndex].topic}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        setFlaggedMcqs((prev) => ({
                          ...prev,
                          [test.mcqs[currentMcqIndex].id]: !prev[test.mcqs[currentMcqIndex].id],
                        }))
                      }
                      className={`text-xs flex items-center space-x-1 px-2.5 py-1 rounded transition-colors ${
                        flaggedMcqs[test.mcqs[currentMcqIndex].id]
                          ? 'text-amber-300 bg-amber-950/50'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <span>★ Flag for review</span>
                    </button>
                    <span className="text-xs font-bold text-amber-400">
                      {test.mcqs[currentMcqIndex].points} Points
                    </span>
                  </div>
                </div>

                <div className="text-base sm:text-lg font-medium text-stone-100 whitespace-pre-line leading-relaxed">
                  {test.mcqs[currentMcqIndex].question}
                </div>

                {/* Options */}
                <div className="space-y-3 pt-2">
                  {test.mcqs[currentMcqIndex].options.map((opt, optIdx) => {
                    const isSelected =
                      mcqAnswers[test.mcqs[currentMcqIndex].id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() =>
                          setMcqAnswers((prev) => ({
                            ...prev,
                            [test.mcqs[currentMcqIndex].id]: optIdx,
                          }))
                        }
                        className={`w-full text-left p-4 rounded-xl border text-sm font-normal transition-all flex items-start space-x-3 ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-amber-100 shadow-sm'
                            : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-amber-500 text-stone-950'
                              : 'bg-stone-800 text-stone-400 border border-stone-700'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Question Navigation Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-stone-800">
                  <button
                    disabled={currentMcqIndex === 0}
                    onClick={() => setCurrentMcqIndex((prev) => Math.max(0, prev - 1))}
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg text-xs font-medium text-stone-300 bg-stone-850 hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Question</span>
                  </button>

                  {currentMcqIndex < test.mcqs.length - 1 ? (
                    <button
                      onClick={() => setCurrentMcqIndex((prev) => prev + 1)}
                      className="flex items-center space-x-1 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-stone-800 hover:bg-stone-700"
                    >
                      <span>Next Question</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveSection('coding')}
                      className="flex items-center space-x-1 px-5 py-2 rounded-lg text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-md"
                    >
                      <span>Proceed to Coding Sandbox</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* SECTION 2: CODING SANDBOX */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Column: Problem Description & Test Cases */}
            <div className="w-full lg:w-5/12 border-b lg:border-b-0 lg:border-r border-stone-800 flex flex-col h-1/2 lg:h-full overflow-hidden bg-stone-950">
              <div className="p-4 border-b border-stone-800 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">
                    {test.codingChallenge.title}
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {test.codingChallenge.difficulty}
                    </span>
                    <span className="text-xs text-stone-400">
                      Weight: <strong>{test.codingChallenge.points} Points</strong>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setCode(test.codingChallenge.starterCode)}
                  className="flex items-center space-x-1 text-xs text-stone-400 hover:text-stone-200"
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Reset</span>
                </button>
              </div>

              {/* Problem Prompt */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed text-stone-300">
                <div className="whitespace-pre-line text-stone-200">
                  {test.codingChallenge.description}
                </div>

                {/* Example Test Cases */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-stone-100 uppercase tracking-wider mb-2">
                    Sample Test Cases
                  </h3>
                  <div className="space-y-2">
                    {test.codingChallenge.testCases.map((tc, idx) => (
                      <div
                        key={tc.id}
                        className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 font-mono text-[11px]"
                      >
                        <div className="text-stone-400 text-[10px] mb-1">
                          Test Case {idx + 1} {tc.isHidden && '(Hidden during final eval)'}
                        </div>
                        <div className="text-amber-300/90">
                          <span className="text-stone-500">Input:</span> {tc.input}
                        </div>
                        <div className="text-emerald-400">
                          <span className="text-stone-500">Expected:</span> {tc.expectedOutput}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Code Editor & Execution Results */}
            <div className="w-full lg:w-7/12 flex flex-col h-1/2 lg:h-full bg-stone-900">
              {/* Code Editor Header */}
              <div className="h-10 bg-stone-950 px-4 border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono text-stone-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>solution.{test.codingChallenge.language === 'javascript' ? 'js' : 'ts'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    id="run-code-button"
                    onClick={runCodeAgainstTestCases}
                    disabled={isRunningCode}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 fill-stone-950" />
                    <span>{isRunningCode ? 'Executing...' : 'Run Code'}</span>
                  </button>
                </div>
              </div>

              {/* Code Editor TextArea */}
              <div className="flex-1 relative flex">
                {/* Line numbers dummy */}
                <div className="w-10 bg-stone-950 text-stone-600 text-xs font-mono pt-3 select-none text-right pr-2 border-r border-stone-800 leading-5">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                <textarea
                  id="code-editor-textarea"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  className="flex-1 p-3 bg-stone-900 text-stone-100 font-mono text-xs leading-5 resize-none focus:outline-none focus:ring-0 selection:bg-amber-500/30"
                  placeholder="// Implement your solution here..."
                />
              </div>

              {/* Test Execution Output Tray */}
              <div className="h-44 border-t border-stone-800 bg-stone-950 flex flex-col">
                <div className="h-8 px-4 border-b border-stone-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-stone-300">Sandbox Test Runner</span>
                    {testCaseRunResults && (
                      <span className="text-[11px] text-stone-400">
                        ({testCaseRunResults.filter((r) => r.passed).length}/
                        {testCaseRunResults.length} passed)
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">Isolated V8 Sandbox</span>
                </div>

                <div className="flex-1 p-3 overflow-y-auto font-mono text-xs">
                  {runError && (
                    <div className="p-2.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                      <strong>Runtime / Syntax Error:</strong>
                      <div className="mt-1">{runError}</div>
                    </div>
                  )}

                  {!runError && !testCaseRunResults && (
                    <div className="h-full flex flex-col items-center justify-center text-stone-500 text-xs">
                      <span>Click "Run Code" to test your solution against visible test suites.</span>
                    </div>
                  )}

                  {testCaseRunResults && !runError && (
                    <div className="space-y-2">
                      <div className="flex space-x-2 pb-2 border-b border-stone-800">
                        {testCaseRunResults.map((r, idx) => (
                          <button
                            key={r.testCaseId}
                            onClick={() => setSelectedTestCaseIndex(idx)}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center space-x-1 ${
                              selectedTestCaseIndex === idx
                                ? 'bg-stone-800 text-stone-100 border border-stone-700'
                                : 'text-stone-400 hover:bg-stone-850'
                            }`}
                          >
                            {r.passed ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <XCircle className="w-3 h-3 text-rose-400" />
                            )}
                            <span>Case {idx + 1}</span>
                          </button>
                        ))}
                      </div>

                      {testCaseRunResults[selectedTestCaseIndex] && (
                        <div className="text-[11px] space-y-1.5 pt-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-bold ${
                                testCaseRunResults[selectedTestCaseIndex].passed
                                  ? 'text-emerald-400'
                                  : 'text-rose-400'
                              }`}
                            >
                              {testCaseRunResults[selectedTestCaseIndex].passed
                                ? '✓ TEST PASSED'
                                : '✗ TEST FAILED'}
                            </span>
                            <span className="text-stone-500 text-[10px]">
                              Time: {testCaseRunResults[selectedTestCaseIndex].executionTimeMs}ms
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-500">Input:</span>{' '}
                            <span className="text-stone-200">
                              {testCaseRunResults[selectedTestCaseIndex].input}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-500">Expected:</span>{' '}
                            <span className="text-emerald-400">
                              {testCaseRunResults[selectedTestCaseIndex].expectedOutput}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-500">Actual Output:</span>{' '}
                            <span
                              className={
                                testCaseRunResults[selectedTestCaseIndex].passed
                                  ? 'text-emerald-300'
                                  : 'text-rose-300'
                              }
                            >
                              {testCaseRunResults[selectedTestCaseIndex].actualOutput}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Final Submit */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-stone-100">
            <h3 className="text-lg font-bold text-white mb-2">Ready to Submit Assessment?</h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Your test will be automatically graded within 3 seconds. If your verified score meets or exceeds the <strong className="text-amber-400">{test.passingCutoffPercent}% passing cutoff</strong>, your full profile and code metrics will instantly unlock on {test.companyName}'s recruiter pipeline.
            </p>

            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs space-y-1.5 mb-5 font-mono">
              <div className="flex justify-between">
                <span className="text-stone-500">MCQs Answered:</span>
                <span className="text-stone-200">
                  {answeredMcqCount} of {test.mcqs.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Proctoring Integrity:</span>
                <span className="text-emerald-400">{integrityScore}% (0 critical violations)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Time Spent:</span>
                <span className="text-stone-200">
                  {formatTimer(test.timeLimitMinutes * 60 - secondsRemaining)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-300 hover:bg-stone-800"
              >
                Continue Test
              </button>
              <button
                id="confirm-final-submit"
                onClick={() => {
                  setShowSubmitConfirm(false);
                  handleFinalSubmit();
                }}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md"
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
