"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LottieBackground() {
  return (
    <div className="absolute inset-0 w-full h-full opacity-30 mix-blend-screen pointer-events-none">
      <DotLottieReact
        src="https://lottie.host/f25c05ba-fce9-4cf4-99e2-374d5f22739b/y84R6ljbfb.lottie"
        loop
        autoplay
        className="w-full h-full object-cover"
      />
    </div>
  );
}
