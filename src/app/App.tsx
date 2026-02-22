import { useState } from 'react';
import { SidebarNav } from './components/sidebar-nav';
import { LevelCard } from './components/level-card';
import { CodeEditor, ChallengeData } from './components/code-editor';
import { AchievementsPanel } from './components/achievements-panel';
import { AssessmentAnalytics } from './components/assessment-analytics';
import { AiReport } from './components/ai-report';
import { TakeAssessment } from './components/take-assessment';

const CHALLENGES: Record<number, ChallengeData> = {
  3: {
    id: 3,
    level: 3,
    type: "completion",
    title: "Find Duplicate IDs",
    description: "Find duplicate transaction IDs.",
    starter_code: "def find_duplicates(ids):\n    # complete\n    pass\n\n# Test the function\nresult = find_duplicates([1, 2, 3, 2, 4])\nprint(f\"Result: {result}\")",
    test_cases: [
      { input: "[1, 2, 3, 2, 4]", expected: "[2]" }
    ]
  }
};

export default function App() {
  // Always use standard numbers, default to locking if NaN or undefined. 
  // You can set 'assessment_score' to > 60 in Chrome DevTools using `localStorage.setItem('assessment_score', '80')` 
  const getStoredScore = () => {
    const s = localStorage.getItem('assessment_score');
    return s ? Number(s) : 0;
  };

  const [assessmentScore, setAssessmentScore] = useState(getStoredScore());
  const isJourneyUnlocked = assessmentScore >= 60;
  const [activeTab, setActiveTab] = useState(isJourneyUnlocked ? 'journey' : 'dashboard');
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeData | null>(null);

  const levels = [
    { level: 1, title: 'Trainee', status: 'completed' as const, description: 'Learn the basics' },
    { level: 2, title: 'Junior Dev', status: 'completed' as const, description: 'Build simple projects' },
    { level: 3, title: 'Developer', status: 'active' as const, description: 'Master your craft' },
    { level: 4, title: 'Senior Dev', status: 'locked' as const, description: 'Lead & mentor teams' },
    { level: 5, title: 'Tech Lead', status: 'locked' as const, description: 'Strategic vision' },
  ];

  const handleLevelClick = (levelNumber: number) => {
    const data = CHALLENGES[levelNumber] || {
      id: levelNumber,
      level: levelNumber,
      type: "completion",
      title: `${levels.find(l => l.level === levelNumber)?.title} Challenge`,
      description: `Complete the challenge for Level ${levelNumber} to proceed.`,
      starter_code: `# Write your solution here\n\ndef solve():\n    pass\n`,
      test_cases: [
        { input: "[]", expected: "[]" }
      ]
    };
    setSelectedChallenge(data);
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Left Sidebar Navigation */}
      <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} isJourneyUnlocked={isJourneyUnlocked} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'journey' && isJourneyUnlocked ? (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Developer Journey</h1>
              <p className="text-gray-600">Track your progress through five levels of mastery</p>
            </div>

            {/* Level Cards */}
            <div className="space-y-4 mb-8">
              {levels.map((level) => (
                <LevelCard
                  key={level.level}
                  {...level}
                  onClick={() => handleLevelClick(level.level)}
                />
              ))}
            </div>

            {/* Central Workspace - Code Editor */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Challenge</h2>
              <div className="h-[600px]">
                <CodeEditor />
              </div>
            </div>
          </div>
        ) : activeTab === 'dashboard' ? (
          <div className="h-full">
            <AssessmentAnalytics />
          </div>
        ) : activeTab === 'analytics' ? (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 transition-all">Analytics & Feedback</h1>
            <div className="flex flex-col gap-6">
              <AiReport />
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Historical Progression Logs</h2>
                <p className="text-gray-600">Additional raw performance charts and logs will appear down below.</p>
              </div>
            </div>
          </div>
        ) : activeTab === 'assessment' ? (
          <div className="h-full">
            <TakeAssessment onComplete={(score: number) => {
              setAssessmentScore(score);
              localStorage.setItem('assessment_score', score.toString());
            }} />
          </div>
        ) : (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  CM
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">CodeMaster</h2>
                  <p className="text-gray-600">Level 3 - Developer</p>
                  <p className="text-sm text-gray-500 mt-1">Member since February 2026</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">codemaster@skillgate.ai</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="text-gray-900 font-medium">Feb 21, 2026</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Achievements */}
      <AchievementsPanel />

      {/* Challenge Modal Overlay */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-[100] bg-[#1A1A1A] flex flex-col animate-in fade-in zoom-in duration-200">
          <CodeEditor challenge={selectedChallenge} onClose={() => setSelectedChallenge(null)} />
        </div>
      )}
    </div>
  );
}
