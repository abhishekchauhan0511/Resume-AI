import type { ResumeData } from '@/types/builder';

type ContentType = 'summary' | 'experience' | 'skills' | 'project';

export async function generateAIContent(
  type: ContentType,
  resumeData: ResumeData,
  context?: Record<string, string>
): Promise<string> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const response = await fetch(`${supabaseUrl}/functions/v1/resume-builder-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ type, resumeData, context }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.content;
      }
    }
  } catch (e) {
    console.warn('Edge function unavailable, using fallback:', e);
  }

  return fallbackGenerate(type, resumeData, context);
}

function fallbackGenerate(type: ContentType, data: ResumeData, context?: Record<string, string>): string {
  const name = data.personalInfo.fullName || 'the candidate';
  const skillsList = data.skills.join(', ') || 'various technologies';

  switch (type) {
    case 'summary':
      return `Results-driven professional with expertise in ${skillsList}. Proven track record of delivering high-quality solutions and collaborating effectively with cross-functional teams. Passionate about continuous learning and leveraging technology to solve complex problems.`;
    case 'experience':
      return `• Led development of key features for ${context?.company || 'the organization'}, improving system performance and user satisfaction\n• Collaborated with cross-functional teams to deliver projects on time and within budget\n• Implemented best practices in code quality, testing, and documentation\n• Mentored junior team members and contributed to technical decision-making`;
    case 'skills':
      return 'JavaScript, TypeScript, React, Node.js, Python, SQL, Git, Docker, AWS, REST APIs, Agile, Problem Solving';
    case 'project':
      return `• Built ${context?.name || 'the project'} using ${context?.technologies || 'modern technologies'}, serving 1000+ users\n• Implemented key features including authentication, real-time updates, and responsive design\n• Achieved 95% test coverage and maintained clean, documented codebase\n• Deployed using CI/CD pipelines with automated testing and monitoring`;
    default:
      return '';
  }
}
