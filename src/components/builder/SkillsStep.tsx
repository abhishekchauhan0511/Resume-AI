import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { generateAIContent } from '@/lib/ai-builder';
import type { ResumeData } from '@/types/builder';
import { toast } from 'sonner';

interface SkillsStepProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  resumeData: ResumeData;
}

export function SkillsStep({ skills, onChange, resumeData }: SkillsStepProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  };

  const removeSkill = (skill: string) => onChange(skills.filter((s) => s !== skill));

  const suggestSkills = async () => {
    setLoading(true);
    try {
      const result = await generateAIContent('skills', resumeData);
      const suggested = result.split(',').map((s: string) => s.trim()).filter((s: string) => s && !skills.includes(s));
      onChange([...skills, ...suggested]);
      toast.success(`Added ${suggested.length} suggested skills!`);
    } catch {
      toast.error('Failed to suggest skills');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Skills</h3>
          <p className="text-sm text-muted-foreground">Technical and soft skills</p>
        </div>
        <Button variant="outline" size="sm" onClick={suggestSkills} disabled={loading} className="gap-1.5 shrink-0">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-accent" />}
          AI Suggest
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter..."
          className="flex-1"
        />
        <Button variant="outline" size="icon" onClick={addSkill}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {skills.length === 0 && <p className="text-sm text-muted-foreground">No skills added yet</p>}
        {skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="gap-1 pr-1">
            {skill}
            <button onClick={() => removeSkill(skill)} className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
