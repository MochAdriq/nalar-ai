'use client';

export default function LoadingDots() {
  return (
    <div className="flex items-center gap-1 py-2 px-1">
      <div className="loading-dot" style={{ animationDelay: '0ms' }} />
      <div className="loading-dot" style={{ animationDelay: '150ms' }} />
      <div className="loading-dot" style={{ animationDelay: '300ms' }} />
    </div>
  );
}
