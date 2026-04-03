import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { ExperienceEntry, ResumeData } from '@/types/builder';
import { generateAIContent } from '@/lib/ai-builder';
import { toast } from 'sonner';

interface ExperienceStepProps {
  entries: ExperienceEntry[];
  onChange: (entries: ExperienceEntry[]) => void;
  resumeData: ResumeData;
}

export function ExperienceStep({ entries, onChange, resumeData }: ExperienceStepProps) {
  const [aiLoadingId, setAiLoadingId] = useState<string | null>(null);

  const addEntry = () => {
    onChange([
      ...entries,
      { id: crypto.randomUUID(), title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' },
    ]);
  };

  const updateEntry = (id: string, updates: Partial<ExperienceEntry>) => {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const removeEntry = (id: string) => onChange(entries.filter((e) => e.id !== id));

  const enhanceDescription = async (entry: ExperienceEntry) => {
    setAiLoadingId(entry.id);
    try {
      const result = await generateAIContent('experience', resumeData, {
        title: entry.title,
        company: entry.company,
        description: entry.description,
      });
      updateEntry(entry.id, { description: result });
      toast.success('Description enhanced!');
    } catch {
      toast.error('Failed to enhance description');
    } finally {
      setAiLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Work Experience</h3>
          <p className="text-sm text-muted-foreground">Add your professional experience</p>
        </div>
        <Button variant="outline" size="sm" onClick={addEntry} className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-xl">
          No experience added yet. Click "Add" to get started.
        </div>
      )}

      {entries.map((entry) => (
        <Card key={entry.id} className="p-4 space-y-3">
          <div className="flex justify-between">
            <div className="grid sm:grid-cols-2 gap-3 flex-1">
              <div className="space-y-1">
                <Label className="text-xs">Job Title</Label>
                <Input value={entry.title} onChange={(e) => updateEntry(entry.id, { title: e.target.value })} placeholder="Software Engineer" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Company</Label>
                <Input value={entry.company} onChange={(e) => updateEntry(entry.id, { company: e.target.value })} placeholder="Google" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Location</Label>
                <Input value={entry.location} onChange={(e) => updateEntry(entry.id, { location: e.target.value })} placeholder="Mountain View, CA" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Start</Label>
                  <Input value={entry.startDate} onChange={(e) => updateEntry(entry.id, { startDate: e.target.value })} placeholder="Jan 2022" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">End</Label>
                  <Input
                    value={entry.current ? 'Present' : entry.endDate}
                    onChange={(e) => updateEntry(entry.id, { endDate: e.target.value })}
                    placeholder="Present"
                    disabled={entry.current}
                  />
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeEntry(entry.id)} className="shrink-0 ml-2 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox checked={entry.current} onCheckedChange={(c) => updateEntry(entry.id, { current: !!c, endDate: c ? '' : entry.endDate })} />
            <Label className="text-xs text-muted-foreground">Currently working here</Label>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Description</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => enhanceDescription(entry)}
                disabled={aiLoadingId === entry.id}
                className="h-7 text-xs gap-1"
              >
                {aiLoadingId === entry.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-accent" />}
                AI Enhance
              </Button>
            </div>
            <Textarea
              value={entry.description}
              onChange={(e) => updateEntry(entry.id, { description: e.target.value })}
              placeholder="Describe your responsibilities and achievements using bullet points..."
              className="min-h-[100px] resize-none text-sm"
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
