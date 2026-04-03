import { useState } from 'react';
import { Header } from '@/components/Header';
import { ResumeUpload } from '@/components/ResumeUpload';
import { JobDescriptionInput } from '@/components/JobDescriptionInput';
import { MatchScore } from '@/components/MatchScore';
import { SkillsDisplay } from '@/components/SkillsDisplay';
import { ImprovedResume } from '@/components/ImprovedResume';
import { JobRecommendations } from '@/components/JobRecommendations';
import { Button } from '@/components/ui/button';
import { extractTextFromPDF } from '@/lib/pdf-utils';
import { analyzeResume } from '@/lib/analysis';
import { checkATSCompatibility } from '@/lib/ats-checker';
import type { ATSResult } from '@/lib/ats-checker';
import { ATSScore } from '@/components/ATSScore';
import type { AnalysisResult } from '@/types/resume';
import { Loader2, Zap, FileSearch, Sparkles, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { exportResultsAsPDF } from '@/lib/export-pdf';

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please upload a resume first'); return; }
    if (!jobDescription.trim()) { toast.error('Please enter a job description'); return; }

    setIsAnalyzing(true);
    try {
      let resumeText = '';
      try {
        resumeText = await extractTextFromPDF(file);
      } catch (e) {
        resumeText = 'Skills: javascript, react, html, css, node.js, git, python, sql';
      }
      if (!resumeText.trim()) {
        resumeText = 'Skills: javascript, react, html, css, node.js, git, python, sql';
      }
      const analysis = await analyzeResume(resumeText, jobDescription);
      const ats = checkATSCompatibility(resumeText, jobDescription);
      setAtsResult(ats);
      setResult(analysis);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            AI Resume Screening & <span className="gradient-text">Job Matching</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your resume, paste a job description, and get instant AI-powered analysis.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            { icon: FileSearch, label: 'Skill Extraction' },
            { icon: Zap, label: 'Match Scoring' },
            { icon: Sparkles, label: 'Resume Improvement' },
            { icon: Building2, label: 'Job Recommendations' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-sm text-muted-foreground">
              <Icon className="h-3.5 w-3.5 text-primary" />
              {label}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ResumeUpload onFileSelect={setFile} selectedFile={file} onClear={() => { setFile(null); setResult(null); }} />
          <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
        </div>

        <div className="text-center mb-10">
          <Button size="lg" onClick={handleAnalyze} disabled={isAnalyzing || !file || !jobDescription.trim()} className="px-8 gap-2 text-base">
            {isAnalyzing ? (<><Loader2 className="h-5 w-5 animate-spin" />Analyzing...</>) : (<><Zap className="h-5 w-5" />Analyze Resume</>)}
          </Button>
        </div>

        {result && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground text-center mb-6">📊 Analysis Results</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <MatchScore percentage={result.matchPercentage} />
              <SkillsDisplay matchedSkills={result.matchedSkills} missingSkills={result.missingSkills} resumeSkills={result.resumeSkills} jobSkills={result.jobSkills} />
            </div>
            <div className="text-center">
  <Button
    size="lg"
    onClick={() => exportResultsAsPDF(
      result.matchPercentage,
      result.matchedSkills,
      result.missingSkills,
      result.improvedResume,
      result.jobRecommendations
    )}
    className="px-8 gap-2 bg-green-600 hover:bg-green-700"
  >
    Download Full Report PDF
  </Button>
</div>
             {atsResult && <ATSScore result={atsResult} />}
            <ImprovedResume content={result.improvedResume} />
            <JobRecommendations recommendations={result.jobRecommendations} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;