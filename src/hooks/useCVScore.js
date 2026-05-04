import { useMemo } from 'react';

export function useCVScore(cv) {
  return useMemo(() => {
    let score = 0;
    let missingSections = [];

    if (!cv) return { score: 0, missingSections: ['personal'] };

    // Personal Info (20 points)
    let personalScore = 0;
    if (cv.personal?.name?.trim()) personalScore += 5;
    if (cv.personal?.email?.trim()) personalScore += 5;
    if (cv.personal?.phone?.trim()) personalScore += 5;
    if (cv.personal?.title?.trim()) personalScore += 5;
    score += personalScore;
    if (personalScore < 20) missingSections.push('personal');

    // Summary (15 points)
    const summaryLen = cv.summary?.trim()?.length || 0;
    if (summaryLen >= 50) {
      score += 15;
    } else if (summaryLen > 0) {
      score += 5;
      missingSections.push('summary');
    } else {
      missingSections.push('summary');
    }

    // Experience (25 points)
    if (cv.experience?.length > 0) {
      const hasDesc = cv.experience.some(exp => exp.description?.trim()?.length > 0);
      if (hasDesc) {
        score += 25;
      } else {
        score += 15; // Partial: has job, no description
        missingSections.push('experience');
      }
    } else {
      missingSections.push('experience');
    }

    // Education (15 points)
    if (cv.education?.length > 0) {
      score += 15;
    } else {
      missingSections.push('education');
    }

    // Skills (15 points)
    if (cv.skills?.length > 0) {
      score += 15;
    } else {
      missingSections.push('skills');
    }

    // Languages (10 points)
    if (cv.languages?.length > 0) {
      score += 10;
    } else {
      missingSections.push('languages');
    }

    return {
      score: Math.min(Math.max(score, 0), 100),
      missingSections
    };
  }, [cv]);
}
