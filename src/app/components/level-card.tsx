import { Check, Lock } from 'lucide-react';

interface LevelCardProps {
  level: number;
  title: string;
  status: 'completed' | 'active' | 'locked';
  description: string;
  onClick?: () => void;
}

export function LevelCard({ level, title, status, description, onClick }: LevelCardProps) {
  return (
    <div
      onClick={status !== 'locked' ? onClick : undefined}
      className={`
        relative p-5 rounded-xl border-2 transition-all duration-300 bg-white
        ${status !== 'locked' ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''}
        ${status === 'completed' 
          ? 'border-green-400 shadow-sm' 
          : status === 'active'
          ? 'border-blue-500 shadow-md shadow-blue-100'
          : 'border-gray-200 opacity-60'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`
              w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
              ${status === 'completed'
                ? 'bg-green-100 text-green-600'
                : status === 'active'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-400'
              }
            `}
          >
            {level}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex-shrink-0">
          {status === 'completed' ? (
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          ) : status === 'locked' ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Lock className="w-4 h-4 text-gray-400" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
