import { supabase } from '@/integrations/supabase/client';

export async function saveAnalysis(
  matchPercentage: number,
  atsScore: number,
  matchedSkills: string[],
  missingSkills: string[],
  jobDescription: string
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('resume_analyses').insert({
      user_id: user.id,
      match_percentage: matchPercentage,
      ats_score: atsScore,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      job_description_snippet: jobDescription.slice(0, 200),
    });
  } catch (e) {
    console.warn('Could not save analysis:', e);
  }
}

export async function getUserAnalyses() {
  try {
    const { data, error } = await supabase
      .from('resume_analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn('Could not fetch analyses:', e);
    return [];
  }
}

export async function getAnalyticsData() {
  try {
    const data = await getUserAnalyses();
    if (data.length === 0) return null;

    const avgMatch = Math.round(
      data.reduce((sum, a) => sum + a.match_percentage, 0) / data.length
    );
    const avgATS = Math.round(
      data.reduce((sum, a) => sum + (a.ats_score || 0), 0) / data.length
    );

    // Count missing skills frequency
    const skillCount: Record<string, number> = {};
    data.forEach((a) => {
      (a.missing_skills || []).forEach((skill: string) => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });

    const topMissingSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([skill, count]) => ({ skill, count }));

    const last7 = data.slice(0, 7).reverse().map((a, i) => ({
      name: `Analysis ${i + 1}`,
      match: a.match_percentage,
      ats: a.ats_score || 0,
    }));

    return {
      totalAnalyses: data.length,
      avgMatch,
      avgATS,
      topMissingSkills,
      last7,
      bestMatch: Math.max(...data.map((a) => a.match_percentage)),
    };
  } catch (e) {
    return null;
  }
}