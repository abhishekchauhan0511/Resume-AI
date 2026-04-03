import { useState } from 'react';
import { Header } from '@/components/Header';
import { PersonalInfoStep } from '@/components/builder/PersonalInfoStep';
import { SummaryStep } from '@/components/builder/SummaryStep';
import { ExperienceStep } from '@/components/builder/ExperienceStep';
import { EducationStep } from '@/components/builder/EducationStep';
import { SkillsStep } from '@/components/builder/SkillsStep';
import { ProjectsStep } from '@/components/builder/ProjectsStep';
import { ResumePreview } from '@/components/builder/ResumePreview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { emptyResumeData, type ResumeData } from '@/types/builder';
import { User, FileText, Briefcase, GraduationCap, Wrench, FolderOpen, ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';

const steps = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
] as const;

const Builder = () => {
  const [data, setData] = useState<ResumeData>(emptyResumeData);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const formatResumeText = (d: ResumeData): string => {
    let text = '';
    const { personalInfo, summary, experience, education, skills, projects } = d;

    if (personalInfo.fullName) {
      text += personalInfo.fullName.toUpperCase() + '\n';
      const contactParts = [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.website].filter(Boolean);
      if (contactParts.length) text += contactParts.join(' | ') + '\n';
      text += '\n';
    }

    if (summary) text += 'PROFESSIONAL SUMMARY\n' + summary + '\n\n';

    if (experience.length) {
      text += 'EXPERIENCE\n';
      experience.forEach((exp) => {
        text += `${exp.title}${exp.company ? ' — ' + exp.company : ''}`;
        if (exp.startDate) text += ` | ${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`;
        text += '\n';
        if (exp.location) text += exp.location + '\n';
        if (exp.description) text += exp.description + '\n';
        text += '\n';
      });
    }

    if (education.length) {
      text += 'EDUCATION\n';
      education.forEach((edu) => {
        text += `${edu.degree}${edu.institution ? ' — ' + edu.institution : ''}`;
        if (edu.graduationDate) text += ` | ${edu.graduationDate}`;
        text += '\n';
        if (edu.gpa) text += 'GPA: ' + edu.gpa + '\n';
        if (edu.description) text += edu.description + '\n';
        text += '\n';
      });
    }

    if (skills.length) text += 'SKILLS\n' + skills.join(' • ') + '\n\n';

    if (projects.length) {
      text += 'PROJECTS\n';
      projects.forEach((proj) => {
        text += proj.name;
        if (proj.technologies) text += ` (${proj.technologies})`;
        text += '\n';
        if (proj.link) text += proj.link + '\n';
        if (proj.description) text += proj.description + '\n';
        text += '\n';
      });
    }

    return text.trim();
  };

  const handleDownload = () => {
    const text = formatResumeText(data);
    if (!text) { toast.error('Add some content first'); return; }
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.personalInfo.fullName || 'resume'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Resume downloaded!');
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'personal':
        return <PersonalInfoStep data={data.personalInfo} onChange={(personalInfo) => setData({ ...data, personalInfo })} />;
      case 'summary':
        return <SummaryStep value={data.summary} onChange={(summary) => setData({ ...data, summary })} resumeData={data} />;
      case 'experience':
        return <ExperienceStep entries={data.experience} onChange={(experience) => setData({ ...data, experience })} resumeData={data} />;
      case 'education':
        return <EducationStep entries={data.education} onChange={(education) => setData({ ...data, education })} />;
      case 'skills':
        return <SkillsStep skills={data.skills} onChange={(skills) => setData({ ...data, skills })} resumeData={data} />;
      case 'projects':
        return <ProjectsStep entries={data.projects} onChange={(projects) => setData({ ...data, projects })} resumeData={data} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            AI Resume <span className="gradient-text">Builder</span>
          </h2>
          <p className="text-muted-foreground">Create a professional resume with AI-powered suggestions</p>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-1 p-1 bg-muted rounded-xl overflow-x-auto">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    i === currentStep ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <div>
            <Card className="p-6">
              {renderStep()}
              <div className="flex justify-between mt-6 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="gap-1.5">
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="lg:hidden gap-1.5">
                    <Eye className="h-4 w-4" /> Preview
                  </Button>
                  {currentStep < steps.length - 1 ? (
                    <Button onClick={() => setCurrentStep(currentStep + 1)} className="gap-1.5">
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleDownload} className="gap-1.5">
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Preview */}
          <div className={`${showPreview ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Live Preview</h3>
                <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Download
                </Button>
              </div>
              <ResumePreview data={data} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Builder;
