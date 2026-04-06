export interface RealJob {
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  postedAt: string;
  applyLink: string;
  description: string;
  matchScore: number;
}

export async function fetchRealJobs(
  skills: string[],
  jobTitle?: string
): Promise<RealJob[]> {
  try {
    const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
    if (!rapidApiKey) return [];

    // Build search query from skills
    const query = jobTitle || skills.slice(0, 3).join(' ') || 'software developer';

    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=1&page=1&date_posted=week`,
      {
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) throw new Error('Jobs API failed');

    const data = await response.json();
    const jobs = data.data || [];

    return jobs.slice(0, 6).map((job: any) => {
      // Calculate match score based on skills
      const jobText = `${job.job_title} ${job.job_description || ''} ${job.job_highlights?.Qualifications?.join(' ') || ''}`.toLowerCase();
      const matchedSkills = skills.filter(skill => jobText.includes(skill.toLowerCase()));
      const matchScore = skills.length > 0
        ? Math.round((matchedSkills.length / skills.length) * 100)
        : 50;

      return {
        title: job.job_title || 'Unknown Title',
        company: job.employer_name || 'Unknown Company',
        location: job.job_city
          ? `${job.job_city}, ${job.job_country}`
          : job.job_country || 'Remote',
        salary: job.job_min_salary && job.job_max_salary
          ? `$${Math.round(job.job_min_salary / 1000)}k - $${Math.round(job.job_max_salary / 1000)}k`
          : 'Not disclosed',
        jobType: job.job_employment_type || 'Full-time',
        postedAt: job.job_posted_at_datetime_utc
          ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString()
          : 'Recently',
        applyLink: job.job_apply_link || '#',
        description: (job.job_description || '').slice(0, 150) + '...',
        matchScore: Math.max(30, Math.min(99, matchScore + 40)),
      };
    });
  } catch (e) {
    console.warn('Jobs API error:', e);
    return [];
  }
}