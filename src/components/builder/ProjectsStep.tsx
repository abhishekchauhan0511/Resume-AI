import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { ProjectEntry, ResumeData } from '@/types/builder';
import { generateAIContent } from '@/lib/ai-builder';
import { toast } from 'sonner';

interface ProjectsStepProps {
  entries: ProjectEntry[];
  onChange: (entries: ProjectEntry[]) => void;
  resumeData: ResumeData;
}

export function ProjectsStep({ entries, onChange, resumeData }: ProjectsStepProps) {
  const [aiLoadingId, setAiLoadingId] = useState<string | null>(null);

  const addEntry = () => {
    onChange([...entries, { id: crypto.randomUUID(), name: '', technologies: '', description: '', link: '' }]);
  };

  const updateEntry = (id: string, updates: Partial<ProjectEntry>) => {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const removeEntry = (id: string) => onChange(entries.filter((e) => e.id !== id));

  const enhanceDescription = async (entry: ProjectEntry) => {
    setAiLoadingId(entry.id);
    try {
      const result = await generateAIContent('project', resumeData, {
        name: entry.name,
        technologies: entry.technologies,
        description: entry.description,
      });
      updateEntry(entry.id, { description: result });
      toast.success('Description enhanced!');
    } catch {
      toast.error('Failed to enhance');
    } finally {
      setAiLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Projects</h3>
          <p className="text-sm text-muted-foreground">Showcase your best work</p>
        </div>
        <Button variant="outline" size="sm" onClick={addEntry} className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-xl">
          No projects added yet. Click "Add" to get started.
        </div>
      )}

      {entries.map((entry) => (
        <Card key={entry.id} className="p-4 space-y-3">
          <div className="flex justify-between">
            <div className="grid sm:grid-cols-2 gap-3 flex-1">
              <div className="space-y-1">
                <Label className="text-xs">Project Name</Label>
                <Input value={entry.name} onChange={(e) => updateEntry(entry.id, { name: e.target.value })} placeholder="E-commerce Platform" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Technologies</Label>
                <Input value={entry.technologies} onChange={(e) => updateEntry(entry.id, { technologies: e.target.value })} placeholder="React, Node.js, PostgreSQL" />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <Label className="text-xs">Link (optional)</Label>
                <Input value={entry.link} onChange={(e) => updateEntry(entry.id, { link: e.target.value })} placeholder="github.com/user/project" />
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeEntry(entry.id)} className="shrink-0 ml-2 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Description</Label>
              <Button variant="ghost" size="sm" onClick={() => enhanceDescription(entry)} disabled={aiLoadingId === entry.id} className="h-7 text-xs gap-1">
                {aiLoadingId === entry.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-accent" />}
                AI Enhance
              </Button>
            </div>
            <Textarea
              value={entry.description}
              onChange={(e) => updateEntry(entry.id, { description: e.target.value })}
              placeholder="Describe the project, your role, and key outcomes..."
              className="min-h-[80px] resize-none text-sm"
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
