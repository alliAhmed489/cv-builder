import { useState, useEffect, useMemo } from 'react';

// Common stop words to ignore
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'experience', 'years', 'working', 'knowledge', 'ability',
  'team', 'skills', 'work', 'required', 'strong', 'understanding', 'using'
]);

// High value technical keywords (case insensitive matching)
const HIGH_VALUE_SKILLS = new Set([
  'react', 'angular', 'vue', 'node', 'python', 'java', 'javascript', 'typescript',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'sql', 'mysql', 'postgresql',
  'mongodb', 'nosql', 'api', 'rest', 'graphql', 'ci/cd', 'git', 'agile', 'scrum',
  'html', 'css', 'sass', 'tailwind', 'redux', 'next.js', 'express', 'django',
  'flask', 'spring', 'c#', '.net', 'c++', 'ruby', 'rails', 'php', 'laravel',
  'go', 'rust', 'swift', 'kotlin', 'linux', 'bash', 'jenkins', 'terraform',
  'frontend', 'backend', 'fullstack', 'machine learning', 'ai', 'data science'
]);

// Normalization map: Maps variations to a standard form
const KEYWORD_ALIASES = {
  'reactjs': 'react', 'react.js': 'react', 'react js': 'react',
  'node.js': 'node', 'nodejs': 'node', 'node js': 'node',
  'vue.js': 'vue', 'vuejs': 'vue',
  'nextjs': 'next.js', 'next js': 'next.js',
  'front-end': 'frontend', 'front end': 'frontend',
  'back-end': 'backend', 'back end': 'backend',
  'full-stack': 'fullstack', 'full stack': 'fullstack',
  'js': 'javascript', 'ts': 'typescript',
  'postgres': 'postgresql'
};

function normalizeText(text) {
  let normalized = text.toLowerCase();
  // Apply aliases
  for (const [alias, standard] of Object.entries(KEYWORD_ALIASES)) {
    // Replace whole word matches of the alias with standard form
    const regex = new RegExp(`\\b${alias.replace(/\./g, '\\.')}\\b`, 'g');
    normalized = normalized.replace(regex, standard);
  }
  return normalized;
}

// Extract distinct keywords from text
function extractKeywords(text) {
  if (!text) return [];
  const normalized = normalizeText(text);
  // Match words, allowing hyphens and dots (like c#, .net, next.js)
  const rawWords = normalized.match(/[\w#\.]+/g) || [];
  
  const words = new Set();
  rawWords.forEach(w => {
    // remove trailing dots
    let clean = w.replace(/\.$/, '');
    if (clean.length > 2 && !STOP_WORDS.has(clean)) {
      words.add(clean);
    }
  });

  // Check multi-word skills manually
  ['machine learning', 'data science'].forEach(phrase => {
    if (normalized.includes(phrase)) words.add(phrase);
  });

  return Array.from(words);
}

// Debounce helper
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function useATS(cv, targetJobTitle, jobDescription = '') {
  const debouncedCV = useDebounce(cv, 300);
  const debouncedInputText = useDebounce(`${targetJobTitle} ${jobDescription}`, 300);

  return useMemo(() => {
    let score = 0;
    let issues = [];
    let suggestions = [];
    let missingKeywords = [];

    if (!debouncedCV) return { score: 0, status: 'Low', issues, suggestions, missingKeywords };

    // --- Advanced Keywords Match (30 points) ---
    const extractedTargetKeywords = extractKeywords(debouncedInputText);
    
    let keywordScore = 0;
    if (extractedTargetKeywords.length > 0) {
      const summaryText = (debouncedCV.summary || '');
      const expText = (debouncedCV.experience || []).map(e => (e.title || '') + ' ' + (e.description || '')).join(' ');
      const skillsText = (debouncedCV.skills || []).map(s => s.name || '').join(' ');
      const allTextRaw = `${summaryText} ${expText} ${skillsText}`;
      const cvNormalizedText = normalizeText(allTextRaw);

      let totalWeight = 0;
      let matchedWeight = 0;

      extractedTargetKeywords.forEach(kw => {
        const isHighValue = HIGH_VALUE_SKILLS.has(kw);
        const weight = isHighValue ? 3 : 1;
        totalWeight += weight;

        // Escape regex special characters in keyword
        const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedKw}\\b`, 'i');

        if (regex.test(cvNormalizedText)) {
          matchedWeight += weight;
        } else {
          if (isHighValue) missingKeywords.push(kw);
        }
      });

      const matchRatio = totalWeight > 0 ? (matchedWeight / totalWeight) : 0;
      keywordScore = Math.floor(matchRatio * 30);
      score += keywordScore;

      if (matchRatio < 0.5) {
        issues.push("Low keyword match with target job description.");
        suggestions.push("Tailor your CV by adding missing keywords.");
      } else if (matchRatio < 1 && missingKeywords.length > 0) {
        suggestions.push("Adding a few more missing high-value keywords will boost your score.");
      }
    } else {
      score += 15;
      suggestions.push("Paste a Job Description to get precise keyword and skill matching.");
    }

    // --- Content Completeness (30 points) ---
    let contentScore = 0;
    const summaryLen = debouncedCV.summary?.trim()?.length || 0;
    if (summaryLen >= 80) {
      contentScore += 10;
    } else if (summaryLen >= 50) {
      contentScore += 5;
      suggestions.push("Expand your summary to highlight more of your achievements.");
    } else {
      issues.push("Summary is too short or missing.");
      suggestions.push("Write a summary of at least 80 characters.");
    }

    if (debouncedCV.experience?.length > 0) {
      const hasDesc = debouncedCV.experience.every(exp => exp.description?.trim()?.length > 20);
      if (hasDesc) {
        contentScore += 10;
      } else {
        contentScore += 5;
        issues.push("Some experience entries lack detailed descriptions.");
      }
    } else {
      issues.push("No experience listed.");
    }

    const skillsCount = debouncedCV.skills?.length || 0;
    if (skillsCount >= 5) {
      contentScore += 10;
    } else {
      contentScore += (skillsCount * 2);
      issues.push(`Only ${skillsCount} skills listed.`);
      suggestions.push("Include at least 5 relevant skills.");
    }
    score += contentScore;

    // --- Structure & Formatting (20 points) ---
    let structureScore = 0;
    if (debouncedCV.personal?.email?.trim()) structureScore += 5;
    else issues.push("Missing email address.");
    
    if (debouncedCV.personal?.phone?.trim()) structureScore += 5;
    else issues.push("Missing phone number.");

    if (debouncedCV.education?.length > 0) structureScore += 10;
    else {
      issues.push("Missing education details.");
      suggestions.push("Add your educational background.");
    }
    score += structureScore;

    // --- Readability (20 points) ---
    let readabilityScore = 20;
    if (summaryLen > 500) {
      readabilityScore -= 10;
      issues.push("Summary is too long.");
    }
    
    let hasLongBlock = false;
    (debouncedCV.experience || []).forEach(exp => {
      if (exp.description?.length > 600) hasLongBlock = true;
    });
    if (hasLongBlock) {
      readabilityScore -= 10;
      issues.push("An experience description is too long.");
      suggestions.push("Use bullet points for experience descriptions instead of long paragraphs.");
    }
    score += Math.max(readabilityScore, 0);

    const finalScore = Math.min(Math.max(score, 0), 100);
    let status = 'Low';
    if (finalScore >= 75) status = 'High';
    else if (finalScore >= 45) status = 'Medium';

    return { score: finalScore, status, issues, suggestions, missingKeywords };
  }, [debouncedCV, debouncedInputText]);
}
