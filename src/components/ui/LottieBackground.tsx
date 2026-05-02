"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LottieBackground() {
  return (
    <div className="absolute inset-0 w-full h-full opacity-30 mix-blend-screen pointer-events-none">
      <DotLottieReact
        src="/hero-animation.lottie"
        loop
        autoplay
        className="w-full h-full object-cover"
      />
    </div>
  );
}
