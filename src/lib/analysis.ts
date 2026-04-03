import type { AnalysisResult } from '@/types/resume';

// Client-side analysis fallback using basic NLP techniques
export async function analyzeResume(
  resumeText: string,
  jobDescription: string
): Promise<AnalysisResult> {
  // Try edge function first, fall back to client-side
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const response = await fetch(`${supabaseUrl}/functions/v1/analyze-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      if (response.ok) {
        return await response.json();
      }
    }
  } catch (e) {
    console.warn('Edge function unavailable, using client-side analysis:', e);
  }

  return clientSideAnalysis(resumeText, jobDescription);
}

function clientSideAnalysis(resumeText: string, jobDescription: string): AnalysisResult {
  const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift',
    'react', 'angular', 'vue', 'next.js', 'node.js', 'express', 'django', 'flask', 'spring',
    'html', 'css', 'sass', 'tailwind', 'bootstrap',
    'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd',
    'git', 'agile', 'scrum', 'jira', 'rest api', 'graphql',
    'machine learning', 'deep learning', 'nlp', 'data science', 'pandas', 'numpy',
    'figma', 'photoshop', 'ui/ux', 'responsive design',
    'project management', 'leadership', 'communication', 'problem solving',
    'testing', 'jest', 'cypress', 'selenium', 'tdd',
  ];

  const extractSkills = (text: string): string[] => {
    const lower = text.toLowerCase();
    return commonSkills.filter((skill) => lower.includes(skill));
  };

  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobDescription);
  const matchedSkills = resumeSkills.filter((s) => jobSkills.includes(s));
  const missingSkills = jobSkills.filter((s) => !resumeSkills.includes(s));

  const matchPercentage = jobSkills.length > 0
    ? Math.round((matchedSkills.length / jobSkills.length) * 100)
    : 0;

  const improvedResume = generateImprovedResume(resumeText, missingSkills);
  const jobRecommendations = generateRecommendations(resumeSkills, matchedSkills);

  return {
    matchPercentage,
    resumeSkills,
    jobSkills,
    matchedSkills,
    missingSkills,
    improvedResume,
    jobRecommendations,
  };
}

function generateImprovedResume(originalText: string, missingSkills: string[]): string {
  let improved = originalText;

  if (missingSkills.length > 0) {
    improved += '\n\n--- SUGGESTED ADDITIONS ---\n\n';
    improved += 'ADDITIONAL SKILLS:\n';
    improved += missingSkills.map((s) => `• ${s.charAt(0).toUpperCase() + s.slice(1)}`).join('\n');
    improved += '\n\nTIP: Consider adding relevant experience or projects that demonstrate these skills.';
  }

  return improved;
}

function generateRecommendations(
  resumeSkills: string[],
  _matchedSkills: string[]
): { role: string; company: string; matchPercentage: number; reason: string }[] {
  const roleMap: Record<string, { roles: string[]; companies: string[] }> = {
    frontend: {
      roles: ['Frontend Developer', 'UI Engineer', 'React Developer'],
      companies: ['Vercel', 'Stripe', 'Airbnb', 'Shopify'],
    },
    backend: {
      roles: ['Backend Developer', 'API Engineer', 'Platform Engineer'],
      companies: ['AWS', 'Cloudflare', 'Twilio', 'Supabase'],
    },
    fullstack: {
      roles: ['Full Stack Developer', 'Software Engineer', 'Web Developer'],
      companies: ['Google', 'Meta', 'Netflix', 'Spotify'],
    },
    data: {
      roles: ['Data Scientist', 'ML Engineer', 'Data Analyst'],
      companies: ['OpenAI', 'DeepMind', 'Databricks', 'Snowflake'],
    },
  };

  const hasFrontend = resumeSkills.some((s) => ['react', 'angular', 'vue', 'css', 'html'].includes(s));
  const hasBackend = resumeSkills.some((s) => ['node.js', 'python', 'java', 'django', 'flask'].includes(s));
  const hasData = resumeSkills.some((s) => ['machine learning', 'data science', 'pandas', 'numpy'].includes(s));

  const categories: string[] = [];
  if (hasFrontend && hasBackend) categories.push('fullstack');
  else if (hasFrontend) categories.push('frontend');
  else if (hasBackend) categories.push('backend');
  if (hasData) categories.push('data');
  if (categories.length === 0) categories.push('fullstack');

  const recs: { role: string; company: string; matchPercentage: number; reason: string }[] = [];

  for (const cat of categories) {
    const { roles, companies } = roleMap[cat];
    for (let i = 0; i < Math.min(2, roles.length); i++) {
      recs.push({
        role: roles[i],
        company: companies[i],
        matchPercentage: Math.max(50, Math.min(95, 60 + resumeSkills.length * 3)),
        reason: `Based on your ${cat} skills: ${resumeSkills.slice(0, 3).join(', ')}`,
      });
    }
  }

  return recs.slice(0, 5);
}
