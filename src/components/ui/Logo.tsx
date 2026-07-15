'use client';

export default function Logo({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const sizeClasses = {
    small: 'text-lg',
    default: 'text-2xl',
    large: 'text-5xl md:text-6xl',
  };

  const iconSizes = {
    small: 'w-6 h-6',
    default: 'w-8 h-8',
    large: 'w-14 h-14 md:w-16 md:h-16',
  };

  return (
    <div className={`font-bold ${sizeClasses[size]} flex items-center gap-2`}>
      <div className="relative flex items-center justify-center shrink-0">
        <img
          src="/apple-touch-icon.png"
          alt="Nalar.AI Logo"
          className={`${iconSizes[size]} rounded-lg object-contain shadow-lg shadow-cyan-500/25`}
        />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
      </div>
      <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
        Nalar
      </span>
      <span className="text-slate-400 font-light">.AI</span>
    </div>
  );
}
