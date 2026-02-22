import { Trophy, Award, Star } from 'lucide-react';

export function AchievementsPanel() {
  const achievements = [
    {
      name: 'Code Brackets',
      tier: 'Gold',
      description: 'Solved 50 problems',
      icon: '{ }',
      earned: true,
      color: 'from-yellow-400 to-amber-500',
    },
    {
      name: 'Problem Solver',
      tier: 'Silver',
      description: 'Solved 25 problems',
      icon: '✓',
      earned: true,
      color: 'from-gray-300 to-gray-400',
    },
    {
      name: 'Tech Lead',
      tier: 'Platinum',
      description: 'Reach Level 5',
      icon: '★',
      earned: false,
      color: 'from-cyan-400 to-blue-500',
    },
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full p-6 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
        </div>
        <p className="text-sm text-gray-500">Your earned badges</p>
      </div>

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.name}
            className={`
              p-4 rounded-xl border transition-all
              ${achievement.earned
                ? 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                : 'bg-gray-50 border-gray-100 opacity-50'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div
                className={`
                  w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-white
                  bg-gradient-to-br ${achievement.color}
                  ${achievement.earned ? 'shadow-lg' : ''}
                `}
              >
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                  {achievement.earned && (
                    <Award className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">{achievement.description}</p>
                <span
                  className={`
                    inline-block px-2 py-0.5 rounded-full text-xs font-medium
                    ${achievement.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${achievement.tier === 'Silver' ? 'bg-gray-200 text-gray-700' : ''}
                    ${achievement.tier === 'Platinum' ? 'bg-cyan-100 text-cyan-700' : ''}
                  `}
                >
                  {achievement.tier}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Card */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
        <h3 className="font-semibold text-gray-900 mb-3">Your Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Problems Solved</span>
            <span className="font-bold text-blue-600">52</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total XP</span>
            <span className="font-bold text-purple-600">2,450</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Streak</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="font-bold text-orange-600">7 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
