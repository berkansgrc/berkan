"use client";

import { motion, Variants } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  highlightWords?: string[];
  highlightClass?: string;
}

export default function TextReveal({ 
  text, 
  className = "", 
  delay = 0,
  highlightWords = [],
  highlightClass = "text-gradient italic"
}: TextRevealProps) {
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -45,
      filter: "blur(4px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.h1
      className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => {
        // Simple clean-up for matching, ignoring punctuation
        const cleanWord = word.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ]/g, "");
        const isHighlighted = highlightWords.includes(cleanWord);
        
        return (
          <motion.span
            variants={child}
            key={index}
            className={`inline-block [transform-style:preserve-3d] ${
              isHighlighted ? highlightClass : ""
            }`}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.h1>
  );
}
