'use client';

import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#070707]">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/5 blur-[140px] rounded-full animate-float-1" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-900/5 blur-[160px] rounded-full animate-float-2" />
      <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-white/[0.02] blur-[120px] rounded-full animate-float-3" />
    </div>
  );
}
