import { LucideIcon } from 'lucide-react';
import { useStore } from '../store';

interface PictureButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  selected?: boolean;
  disabled?: boolean;
  imageUrl?: string;
}

export function PictureButton({
  icon: Icon,
  label,
  onClick,
  color = 'blue',
  size = 'medium',
  selected = false,
  disabled = false,
  imageUrl,
}: PictureButtonProps) {
  const { settings } = useStore();

  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600 border-blue-600',
    green: 'bg-green-500 hover:bg-green-600 border-green-600',
    purple: 'bg-purple-500 hover:bg-purple-600 border-purple-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 border-yellow-600',
    red: 'bg-red-500 hover:bg-red-600 border-red-600',
    orange: 'bg-orange-500 hover:bg-orange-600 border-orange-600',
    pink: 'bg-pink-500 hover:bg-pink-600 border-pink-600',
  };

  const sizeClasses = {
    small: 'w-24 h-24 p-3',
    medium: 'w-32 h-32 p-4',
    large: 'w-40 h-40 p-5',
  };

  const iconSizes = {
    small: 32,
    medium: 48,
    large: 64,
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const handleClick = () => {
    if (disabled) return;

    // Play audio if enabled
    if (settings?.audioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(label);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }

    onClick();
  };

  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];
  const textSize = textSizes[size];

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${sizeClass}
        ${colorClass}
        ${selected ? 'ring-4 ring-yellow-400 scale-105' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
        ${settings?.dyslexiaFont ? 'font-mono' : ''}
        flex flex-col items-center justify-center
        rounded-2xl
        text-white font-bold
        shadow-lg
        transition-all duration-200
        border-4
      `}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={label}
          className="w-full h-3/4 object-cover rounded-lg mb-1"
        />
      ) : (
        <Icon className="mb-2" size={iconSize} strokeWidth={2.5} />
      )}
      <span className={`${textSize} text-center leading-tight`}>{label}</span>
    </button>
  );
}
