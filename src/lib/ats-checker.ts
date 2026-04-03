export interface ATSResult {
  overallScore: number;
  grade: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  checks: {
    category: string;
    passed: boolean;
    score: number;
    maxScore: number;
    message: string;
    tip: string;
  }[];
  summary: string;
}

export function checkATSCompatibility(
  resumeText: string,
  jobDescription: string
): ATSResult {
  const checks = [];
  const text = resumeText.toLowerCase();
  const jobText = jobDescription.toLowerCase();

  // ── 1. Contact Information (15 points) ──
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+?\d[\d\s\-().]{7,}\d)/.test(resumeText);
  const hasLinkedIn = text.includes('linkedin');
  const contactScore = (hasEmail ? 6 : 0) + (hasPhone ? 6 : 0) + (hasLinkedIn ? 3 : 0);
  checks.push({
    category: 'Contact Information',
    passed: contactScore >= 12,
    score: contactScore,
    maxScore: 15,
    message: hasEmail && hasPhone
      ? 'Email and phone number found ✓'
      : !hasEmail
      ? 'No email address detected'
      : 'No phone number detected',
    tip: 'Include email, phone number, and LinkedIn profile URL at the top of your resume.',
  });

  // ── 2. Essential Sections (20 points) ──
  const hasExperience = text.includes('experience') || text.includes('work history') || text.includes('employment');
  const hasEducation = text.includes('education') || text.includes('degree') || text.includes('university') || text.includes('college');
  const hasSkills = text.includes('skills') || text.includes('technologies') || text.includes('competencies');
  const hasSummary = text.includes('summary') || text.includes('objective') || text.includes('profile') || text.includes('about');
  const sectionScore = (hasExperience ? 7 : 0) + (hasEducation ? 5 : 0) + (hasSkills ? 5 : 0) + (hasSummary ? 3 : 0);
  checks.push({
    category: 'Essential Sections',
    passed: sectionScore >= 15,
    score: sectionScore,
    maxScore: 20,
    message: `Found: ${[hasExperience && 'Experience', hasEducation && 'Education', hasSkills && 'Skills', hasSummary && 'Summary'].filter(Boolean).join(', ') || 'No standard sections found'}`,
    tip: 'Use clear headings: "Work Experience", "Education", "Skills", and "Professional Summary".',
  });

  // ── 3. Keyword Match (25 points) ──
  const jobWords = jobText
    .split(/\W+/)
    .filter((w) => w.length > 4)
    .filter((w) => !['about', 'their', 'which', 'would', 'could', 'should', 'after', 'before'].includes(w));
  const uniqueJobWords = [...new Set(jobWords)];
  const matchedWords = uniqueJobWords.filter((w) => text.includes(w));
  const keywordRatio = uniqueJobWords.length > 0 ? matchedWords.length / uniqueJobWords.length : 0;
  const keywordScore = Math.round(keywordRatio * 25);
  checks.push({
    category: 'Keyword Match',
    passed: keywordScore >= 15,
    score: keywordScore,
    maxScore: 25,
    message: `${matchedWords.length} of ${uniqueJobWords.length} job keywords found in resume`,
    tip: 'Mirror the exact keywords from the job description in your resume naturally.',
  });

  // ── 4. Resume Length (10 points) ──
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  const lengthScore = wordCount >= 300 && wordCount <= 800
    ? 10
    : wordCount >= 200 && wordCount < 300
    ? 6
    : wordCount > 800 && wordCount <= 1000
    ? 6
    : wordCount > 100
    ? 3
    : 0;
  checks.push({
    category: 'Resume Length',
    passed: lengthScore >= 6,
    score: lengthScore,
    maxScore: 10,
    message: `${wordCount} words detected — ${
      wordCount < 200 ? 'Too short' : wordCount > 1000 ? 'Too long' : 'Good length'
    }`,
    tip: 'Ideal resume length is 300-800 words (1 page for freshers, 2 pages for experienced).',
  });

  // ── 5. Action Verbs (10 points) ──
  const actionVerbs = [
    'developed', 'built', 'created', 'designed', 'implemented', 'managed',
    'led', 'achieved', 'improved', 'increased', 'reduced', 'delivered',
    'launched', 'optimized', 'collaborated', 'analyzed', 'solved', 'maintained',
    'automated', 'deployed', 'integrated', 'established', 'coordinated',
  ];
  const foundVerbs = actionVerbs.filter((v) => text.includes(v));
  const verbScore = foundVerbs.length >= 5 ? 10 : foundVerbs.length >= 3 ? 7 : foundVerbs.length >= 1 ? 4 : 0;
  checks.push({
    category: 'Action Verbs',
    passed: verbScore >= 7,
    score: verbScore,
    maxScore: 10,
    message: foundVerbs.length > 0
      ? `Found ${foundVerbs.length} action verbs: ${foundVerbs.slice(0, 4).join(', ')}...`
      : 'No strong action verbs detected',
    tip: 'Start bullet points with strong action verbs like "Developed", "Led", "Optimized".',
  });

  // ── 6. Quantified Achievements (10 points) ──
  const hasNumbers = /\d+%|\d+x|\$\d+|\d+ (users|clients|projects|team|members|hours|days|months|years|million|thousand)/i.test(resumeText);
  const hasMetrics = /increased|decreased|reduced|improved|grew|saved|generated/i.test(resumeText);
  const achievementScore = hasNumbers && hasMetrics ? 10 : hasNumbers || hasMetrics ? 5 : 0;
  checks.push({
    category: 'Quantified Achievements',
    passed: achievementScore >= 5,
    score: achievementScore,
    maxScore: 10,
    message: hasNumbers
      ? 'Numerical achievements found ✓'
      : 'No quantified achievements detected',
    tip: 'Add numbers to your achievements e.g. "Improved performance by 30%" or "Managed team of 5".',
  });

  // ── 7. Formatting Safety (10 points) ──
  const hasSpecialChars = /[│┌┐└┘├┤┬┴┼═╔╗╚╝]/.test(resumeText);
  const hasTables = (resumeText.match(/\t/g) || []).length > 10;
  const formatScore = !hasSpecialChars && !hasTables ? 10 : hasSpecialChars ? 3 : 6;
  checks.push({
    category: 'ATS-Safe Formatting',
    passed: formatScore >= 6,
    score: formatScore,
    maxScore: 10,
    message: hasSpecialChars
      ? 'Special characters detected — may confuse ATS'
      : hasTables
      ? 'Table formatting detected — ATS may misread'
      : 'Clean formatting detected ✓',
    tip: 'Avoid tables, columns, graphics, and special characters. Use simple bullet points.',
  });

  // ── Calculate Total ──
  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxScore, 0);
  const overallScore = Math.round((totalScore / maxScore) * 100);
  const grade =
    overallScore >= 80 ? 'Excellent' :
    overallScore >= 60 ? 'Good' :
    overallScore >= 40 ? 'Fair' : 'Poor';

  const summary =
    grade === 'Excellent'
      ? 'Your resume is highly ATS-friendly! It should pass most ATS filters.'
      : grade === 'Good'
      ? 'Your resume is fairly ATS-compatible. A few improvements will boost your chances.'
      : grade === 'Fair'
      ? 'Your resume needs improvements to pass ATS filters. Follow the tips below.'
      : 'Your resume is likely to be rejected by ATS. Significant improvements needed.';

  return { overallScore, grade, checks, summary };
}