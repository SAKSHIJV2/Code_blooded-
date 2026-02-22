import { ImageWithFallback } from './figma/ImageWithFallback';

interface BadgeItemProps {
  name: string;
  tier: string;
  image: string;
  earned: boolean;
}

export function BadgeItem({ name, tier, image, earned }: BadgeItemProps) {
  return (
    <div
      className={`
        relative flex flex-col items-center p-4 rounded-lg border backdrop-blur-md transition-all duration-300
        ${earned
          ? 'bg-white/5 border-gray-600 hover:bg-white/10 hover:border-gray-500'
          : 'bg-gray-500/5 border-gray-700 opacity-40'
        }
      `}
    >
      <div
        className={`
          w-20 h-20 rounded-full flex items-center justify-center mb-3 relative overflow-hidden
          ${earned
            ? 'shadow-[0_0_20px_rgba(255,215,0,0.3)]'
            : ''
          }
        `}
      >
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-full"
        />
        {earned && (
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 rounded-full"></div>
        )}
      </div>
      <div className="text-center">
        <div
          className={`
            text-xs px-2 py-1 rounded-full mb-1 inline-block
            ${tier === 'Bronze' ? 'bg-amber-700/30 text-amber-400' : ''}
            ${tier === 'Silver' ? 'bg-gray-400/30 text-gray-300' : ''}
            ${tier === 'Gold' ? 'bg-yellow-500/30 text-yellow-300' : ''}
            ${tier === 'Platinum' ? 'bg-cyan-400/30 text-cyan-300' : ''}
            ${tier === 'Diamond' ? 'bg-purple-400/30 text-purple-300' : ''}
          `}
        >
          {tier}
        </div>
        <p className="text-sm text-white font-medium">{name}</p>
      </div>
    </div>
  );
}
