import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Building2, Briefcase } from 'lucide-react';
import type { JobRecommendation } from '@/types/resume';

interface JobRecommendationsProps {
  recommendations: JobRecommendation[];
}

export function JobRecommendations({ recommendations }: JobRecommendationsProps) {
  return (
    <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        Job & Company Recommendations
      </h3>
      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <div key={i} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-foreground flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-accent" />
                  {rec.role}
                </p>
                <p className="text-sm text-muted-foreground">{rec.company}</p>
              </div>
              <Badge variant="outline" className="text-primary border-primary/30">
                {rec.matchPercentage}%
              </Badge>
            </div>
            <Progress value={rec.matchPercentage} className="h-1.5 mb-2" />
            <p className="text-xs text-muted-foreground">{rec.reason}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
