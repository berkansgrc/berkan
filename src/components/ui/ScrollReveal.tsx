"use client";

import { m, useInView, Variants } from "framer-motion";
import { useRef, ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

const getInitialTranslate = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":    return { y: distance, x: 0 };
    case "down":  return { y: -distance, x: 0 };
    case "left":  return { x: distance, y: 0 };
    case "right": return { x: -distance, y: 0 };
  }
};

export default function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 40,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px" });

  const initial = { opacity: 0, ...getInitialTranslate(direction, distance) };
  const animate = isInView
    ? { opacity: 1, x: 0, y: 0 }
    : initial;

  return (
    <m.div
      ref={ref}
      className={className}
      initial={initial}
      animate={animate}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // ease-out-expo
      }}
    >
      {children}
    </m.div>
  );
}
