"use client";

import { useEffect, useState } from "react";
import { m, useSpring, useTransform } from "framer-motion";

interface AnimatedScoreProps {
  score: number;
  className?: string;
}

export default function AnimatedScore({ score, className }: AnimatedScoreProps) {
  const [mounted, setMounted] = useState(false);
  const springScore = useSpring(0, { bounce: 0, duration: 1500 });
  
  useEffect(() => {
    setMounted(true);
    springScore.set(score);
  }, [score, springScore]);

  const displayScore = useTransform(springScore, (current) => current.toFixed(2));

  if (!mounted) {
    return <span className={className}>0.00</span>;
  }

  return <m.span className={className}>{displayScore}</m.span>;
}
