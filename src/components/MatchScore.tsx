import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';

interface MatchScoreProps {
  percentage: number;
}

export function MatchScore({ percentage }: MatchScoreProps) {
  const getColor = () => {
    if (percentage >= 75) return 'text-success';
    if (percentage >= 50) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="p-6 card-elevated animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        Match Score
      </h3>
      <div className="text-center mb-4">
        <span className={`text-5xl font-bold ${getColor()}`}>{percentage}%</span>
        <p className="text-sm text-muted-foreground mt-1">Resume-to-Job Match</p>
      </div>
      <Progress value={percentage} className="h-3" />
    </Card>
  );
}
