import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompanyTest, MCQQuestion, CodingChallenge } from '../../types';
import {
  Code2,
  HelpCircle,
  Plus,
  Trash2,
  X,
  Sparkles,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const TestBuilderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { createTest, currentUser } = useApp();

  const [roleTitle, setRoleTitle] = useState('Junior Cloud Platform Engineer');
  const [department, setDepartment] = useState('Infrastructure & Reliability');
  const [companyName, setCompanyName] = useState('CloudScale Inc.');
  const [companyLogo, setCompanyLogo] = useState('☁️');
  const [location, setLocation] = useState('San Francisco, CA / Remote');
  const [workType, setWorkType] = useState<'Remote' | 'Hybrid' | 'On-site'>('Remote');
  const [salaryRange, setSalaryRange] = useState('$115,000 - $135,000 + Equity');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);
  const [passingCutoffPercent, setPassingCutoffPercent] = useState(75);
  const [experienceLevel, setExperienceLevel] = useState<'Entry-Level' | 'Junior' | 'New Grad'>('Entry-Level');
  const [description, setDescription] = useState(
    'Direct skill benchmark evaluating Go concurrency, container networking, and algorithm efficiency.'
  );
  const [skillsText, setSkillsText] = useState('Go, Docker, Kubernetes, Linux, Algorithms');

  // MCQs
  const [mcqs, setMcqs] = useState<MCQQuestion[]>([
    {
      id: 'mcq-new-1',
      topic: 'Concurrency in Go',
      question: 'What happens when sending to an unbuffered channel in Go without an active receiver goroutine?',
      options: [
        'The sender goroutine blocks indefinitely (deadlock if on main goroutine)',
        'The message is stored in an ephemeral memory ring-buffer',
        'An automatic runtime panic is thrown instantly',
        'The channel drops the packet silently',
      ],
      correctIndex: 0,
      explanation: 'Unbuffered channels require both sender and receiver to synchronize at the rendezvous point.',
      points: 20,
    },
    {
      id: 'mcq-new-2',
      topic: 'Linux Networking',
      question: 'Which Linux system call is standard for high-performance event-driven I/O multiplexing?',
      options: ['fork()', 'epoll_wait()', 'mmap()', 'chown()'],
      correctIndex: 1,
      explanation: 'epoll scales O(1) with the number of monitored file descriptors, unlike select and poll which scale O(n).',
      points: 20,
    },
  ]);

  // Coding Challenge
  const [codingChallenge, setCodingChallenge] = useState<CodingChallenge>({
    id: `coding-${Date.now()}`,
    title: 'Container Port Range Allocator',
    difficulty: 'Medium',
    description:
      'Given an array of allocated port intervals [[start, end]], write a function `findFirstAvailablePort(allocated, requestedPort)` that returns the requestedPort if not inside any allocated range, or the next lowest non-allocated port >= requestedPort.',
    starterCode: `function findFirstAvailablePort(allocated, requestedPort) {
  // Sort intervals by start
  allocated.sort((a, b) => a[0] - b[0]);
  let current = requestedPort;
  
  for (const [start, end] of allocated) {
    if (current >= start && current <= end) {
      current = end + 1;
    }
  }
  
  return current;
}`,
    language: 'javascript',
    points: 60,
    timeLimitSec: 2,
    testCases: [
      {
        id: 'tc-b-1',
        input: '[[3000, 3005], [8080, 8085]], 3000',
        expectedOutput: '3006',
        isHidden: false,
      },
      {
        id: 'tc-b-2',
        input: '[[3000, 3005], [8080, 8085]], 4000',
        expectedOutput: '4000',
        isHidden: false,
      },
      {
        id: 'tc-b-3',
        input: '[[1000, 2000], [2001, 3000]], 1500',
        expectedOutput: '3001',
        isHidden: true,
      },
    ],
  });

  const [activeTab, setActiveTab] = useState<'basics' | 'mcqs' | 'coding'>('basics');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    createTest({
      recruiterId: currentUser.id,
      companyName,
      companyLogo,
      roleTitle,
      department,
      location,
      workType,
      salaryRange,
      timeLimitMinutes: Number(timeLimitMinutes),
      passingCutoffPercent: Number(passingCutoffPercent),
      experienceLevel,
      description,
      skillsRequired: skillsText.split(',').map((s) => s.trim()).filter(Boolean),
      mcqs,
      codingChallenge,
      status: 'active',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Create Tailored Skill Benchmark Test
            </h2>
            <p className="text-xs text-stone-500">
              Set cutoff thresholds and questions to discover verified talent from any university
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex space-x-2 border-b border-stone-200 my-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('basics')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'basics'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            1. Role & Cutoff Parameters
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mcqs')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'mcqs'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            2. Domain MCQs ({mcqs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('coding')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'coding'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            3. Coding Sandbox Challenge
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {activeTab === 'basics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Department / Team
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Time Limit (Minutes)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={90}
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                {/* Cutoff percentage slider */}
                <div className="sm:col-span-2 p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-amber-900">
                      Passing Cutoff Threshold
                    </label>
                    <span className="font-black text-sm text-amber-700 font-mono">
                      {passingCutoffPercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={95}
                    step={5}
                    value={passingCutoffPercent}
                    onChange={(e) => setPassingCutoffPercent(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <p className="text-[10px] text-amber-800 mt-1">
                    * Full student profiles are strictly unlocked only for candidates who achieve ≥ {passingCutoffPercent}%.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Salary / Compensation
                  </label>
                  <input
                    type="text"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Required Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Test & Role Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'mcqs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-500">
                  Multiple-choice conceptual questions evaluated automatically.
                </span>
              </div>

              {mcqs.map((mcq, idx) => (
                <div
                  key={mcq.id}
                  className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 relative"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-800">
                      Question #{idx + 1} ({mcq.points} Points)
                    </span>
                    <span className="text-[10px] text-amber-700 font-mono px-2 py-0.5 rounded bg-amber-100">
                      Topic: {mcq.topic}
                    </span>
                  </div>
                  <p className="font-medium text-stone-900">{mcq.question}</p>
                  <div className="space-y-1">
                    {mcq.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2 rounded text-[11px] flex items-center space-x-2 ${
                          mcq.correctIndex === oIdx
                            ? 'bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300'
                            : 'bg-white text-stone-600 border border-stone-200'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-[10px]">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                        {mcq.correctIndex === oIdx && (
                          <span className="text-[9px] uppercase ml-auto font-bold text-emerald-800">
                            (Correct Answer)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'coding' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Problem Title
                  </label>
                  <input
                    type="text"
                    value={codingChallenge.title}
                    onChange={(e) =>
                      setCodingChallenge((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={codingChallenge.difficulty}
                    onChange={(e: any) =>
                      setCodingChallenge((prev) => ({
                        ...prev,
                        difficulty: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Easy">Easy (Entry)</option>
                    <option value="Medium">Medium (Standard)</option>
                    <option value="Hard">Hard (Senior)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Problem Description & Requirements
                </label>
                <textarea
                  rows={3}
                  value={codingChallenge.description}
                  onChange={(e) =>
                    setCodingChallenge((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Starter Code Template
                </label>
                <textarea
                  rows={4}
                  value={codingChallenge.starterCode}
                  onChange={(e) =>
                    setCodingChallenge((prev) => ({
                      ...prev,
                      starterCode: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono text-xs bg-stone-900 text-stone-100"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            <div className="text-[11px] text-stone-500">
              Direct match unlocks candidate identity immediately upon meeting {passingCutoffPercent}% score.
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-stone-700 hover:bg-stone-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                id="publish-benchmark-test-button"
                type="submit"
                className="px-5 py-2 text-white bg-amber-600 hover:bg-amber-700 font-bold rounded-lg shadow-sm"
              >
                Publish Benchmark Test
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
