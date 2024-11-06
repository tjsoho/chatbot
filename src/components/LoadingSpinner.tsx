import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-900/50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-[3px] border-b-[3px] border-t-[#0ff] border-b-[#f0f]"></div>
    </div>
  );
};

export default LoadingSpinner; 