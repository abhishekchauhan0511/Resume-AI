export interface AnalysisResult {
  matchPercentage: number;
  resumeSkills: string[];
  jobSkills: string[];
  missingSkills: string[];
  matchedSkills: string[];
  improvedResume: string;
  jobRecommendations: JobRecommendation[];
}

export interface JobRecommendation {
  role: string;
  company: string;
  matchPercentage: number;
  reason: string;
}
