import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { generateAIContent } from '@/lib/ai-builder';
import type { ResumeData } from '@/types/builder';
import { toast } from 'sonner';

interface SummaryStepProps {
  value: string;
  onChange: (value: string) => void;
  resumeData: ResumeData;
}

export function SummaryStep({ value, onChange, resumeData }: SummaryStepProps) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateAIContent('summary', resumeData);
      onChange(result);
      toast.success('Summary generated!');
    } catch {
      toast.error('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Professional Summary</h3>
          <p className="text-sm text-muted-foreground">A brief overview of your career and strengths</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading} className="gap-1.5 shrink-0">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-accent" />}
          AI Generate
        </Button>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Results-driven software engineer with 5+ years of experience..."
        className="min-h-[160px] resize-none"
      />
    </div>
  );
}
