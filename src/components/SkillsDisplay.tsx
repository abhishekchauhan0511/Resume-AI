import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface SkillsDisplayProps {
  matchedSkills: string[];
  missingSkills: string[];
  resumeSkills: string[];
  jobSkills: string[];
}

export function SkillsDisplay({ matchedSkills, missingSkills }: SkillsDisplayProps) {
  return (
    <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-accent" />
        Skills Analysis
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Matched Skills ({matchedSkills.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-success/10 text-success border-success/20">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
            <XCircle className="h-4 w-4 text-destructive" />
            Missing Skills ({missingSkills.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
