import type { ResumeData } from '@/types/builder';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const { personalInfo, summary, experience, education, skills, projects } = data;
  const hasContent = personalInfo.fullName || summary || experience.length || education.length || skills.length || projects.length;

  if (!hasContent) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        <p className="text-sm">Start filling in your details to see a live preview here.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card text-card-foreground text-sm leading-relaxed">
      {/* Header */}
      {personalInfo.fullName && (
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-foreground">{personalInfo.fullName}</h2>
          <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs text-muted-foreground">
            {personalInfo.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{personalInfo.location}</span>}
            {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="h-3 w-3" />{personalInfo.linkedin}</span>}
            {personalInfo.website && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{personalInfo.website}</span>}
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <>
          <Separator className="my-3" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Professional Summary</h3>
            <p className="text-foreground">{summary}</p>
          </div>
        </>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <>
          <Separator className="my-3" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Experience</h3>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-foreground">{exp.title}{exp.company && ` — ${exp.company}`}</p>
                  <p className="text-xs text-muted-foreground shrink-0 ml-2">{exp.startDate}{(exp.endDate || exp.current) && ` – ${exp.current ? 'Present' : exp.endDate}`}</p>
                </div>
                {exp.location && <p className="text-xs text-muted-foreground">{exp.location}</p>}
                {exp.description && <p className="mt-1 text-foreground whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Education */}
      {education.length > 0 && (
        <>
          <Separator className="my-3" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Education</h3>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-foreground">{edu.degree}{edu.institution && ` — ${edu.institution}`}</p>
                  <p className="text-xs text-muted-foreground shrink-0 ml-2">{edu.graduationDate}</p>
                </div>
                {edu.gpa && <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>}
                {edu.description && <p className="mt-1 text-foreground">{edu.description}</p>}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <>
          <Separator className="my-3" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Skills</h3>
            <p className="text-foreground">{skills.join(' • ')}</p>
          </div>
        </>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <>
          <Separator className="my-3" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Projects</h3>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-2 last:mb-0">
                <p className="font-semibold text-foreground">{proj.name}{proj.technologies && <span className="font-normal text-muted-foreground"> — {proj.technologies}</span>}</p>
                {proj.link && <p className="text-xs text-primary">{proj.link}</p>}
                {proj.description && <p className="mt-1 text-foreground">{proj.description}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
