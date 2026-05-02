const fs = require('fs');
const glob = require('glob');

// Use native glob (since Node 20+, or we can just use the provided list of files)
const files = [
"src/app/loading.tsx",
"src/components/ui/MagneticButton.tsx",
"src/components/ui/PageTransition.tsx",
"src/components/ui/BerkanBoard.tsx",
"src/components/ui/TextReveal.tsx",
"src/components/ui/FeedbackButton.tsx",
"src/components/ui/ScrollReveal.tsx",
"src/components/ui/HeroHeading.tsx",
"src/components/layout/NavbarClient.tsx",
"src/components/admin/ExamListClient.tsx",
"src/components/admin/AttendanceHistoryPanel.tsx",
"src/components/admin/NotificationCenter.tsx",
"src/components/admin/ExamDetailModal.tsx",
"src/components/admin/CommandPalette.tsx",
"src/components/admin/LiveDashboardClient.tsx",
"src/components/admin/AdminPresencePanel.tsx",
"src/components/admin/ArchiveLessonButton.tsx",
"src/components/admin/BulkQuestionUploader.tsx",
"src/components/admin/QuickPreviewDrawer.tsx",
"src/components/admin/DashboardStatCard.tsx",
"src/components/admin/PollResultsPanel.tsx",
"src/components/admin/ActivityChart.tsx",
"src/components/admin/AchievementHeatmap.tsx",
"src/components/admin/ExamAnalyticsCard.tsx",
"src/components/admin/AnalitikPageClient.tsx",
"src/components/live/LessonCountdown.tsx",
"src/components/live/LessonReminderBanner.tsx",
"src/components/live/ReminderOptIn.tsx",
"src/components/live/ArsivClient.tsx",
"src/components/exam/ResultAnalysisClient.tsx",
"src/components/exam/AnimatedScore.tsx",
"src/components/exam/SubmitConfirmModal.tsx",
"src/components/exam/ExamEngine.tsx",
"src/components/lesson/LessonViewer.tsx",
"src/components/lesson/StudentQuizModal.tsx",
"src/components/notifications/NotificationBell.tsx"
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace import { motion ... } with import { m ... }
  content = content.replace(/import\s+\{([^}]*)\bmotion\b([^}]*)\}\s+from\s+["']framer-motion["']/g, (match, p1, p2) => {
    return `import {${p1}m${p2}} from "framer-motion"`;
  });
  
  // Replace <motion. with <m.
  content = content.replace(/<motion\./g, '<m.');
  // Replace </motion. with </m.
  content = content.replace(/<\/motion\./g, '</m.');
  
  // Replace motion(Component) with m(Component)
  content = content.replace(/\bmotion\(/g, 'm(');
  
  fs.writeFileSync(file, content);
}
console.log('Replaced motion with m in all files.');
