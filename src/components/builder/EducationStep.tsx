import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import type { EducationEntry } from '@/types/builder';

interface EducationStepProps {
  entries: EducationEntry[];
  onChange: (entries: EducationEntry[]) => void;
}

export function EducationStep({ entries, onChange }: EducationStepProps) {
  const addEntry = () => {
    onChange([
      ...entries,
      { id: crypto.randomUUID(), degree: '', institution: '', location: '', graduationDate: '', gpa: '', description: '' },
    ]);
  };

  const updateEntry = (id: string, updates: Partial<EducationEntry>) => {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const removeEntry = (id: string) => onChange(entries.filter((e) => e.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Education</h3>
          <p className="text-sm text-muted-foreground">Your educational background</p>
        </div>
        <Button variant="outline" size="sm" onClick={addEntry} className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-xl">
          No education added yet. Click "Add" to get started.
        </div>
      )}

      {entries.map((entry) => (
        <Card key={entry.id} className="p-4 space-y-3">
          <div className="flex justify-between">
            <div className="grid sm:grid-cols-2 gap-3 flex-1">
              <div className="space-y-1">
                <Label className="text-xs">Degree</Label>
                <Input value={entry.degree} onChange={(e) => updateEntry(entry.id, { degree: e.target.value })} placeholder="B.S. Computer Science" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Institution</Label>
                <Input value={entry.institution} onChange={(e) => updateEntry(entry.id, { institution: e.target.value })} placeholder="MIT" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Graduation Date</Label>
                <Input value={entry.graduationDate} onChange={(e) => updateEntry(entry.id, { graduationDate: e.target.value })} placeholder="May 2022" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">GPA (optional)</Label>
                <Input value={entry.gpa} onChange={(e) => updateEntry(entry.id, { gpa: e.target.value })} placeholder="3.8/4.0" />
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeEntry(entry.id)} className="shrink-0 ml-2 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Additional Info</Label>
            <Textarea
              value={entry.description}
              onChange={(e) => updateEntry(entry.id, { description: e.target.value })}
              placeholder="Relevant coursework, honors, activities..."
              className="min-h-[60px] resize-none text-sm"
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
