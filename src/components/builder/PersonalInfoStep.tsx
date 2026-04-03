import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ResumeData } from '@/types/builder';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface PersonalInfoStepProps {
  data: ResumeData['personalInfo'];
  onChange: (data: ResumeData['personalInfo']) => void;
}

const fields = [
  { key: 'fullName', label: 'Full Name', icon: User, placeholder: 'John Doe' },
  { key: 'email', label: 'Email', icon: Mail, placeholder: 'john@example.com' },
  { key: 'phone', label: 'Phone', icon: Phone, placeholder: '+1 (555) 123-4567' },
  { key: 'location', label: 'Location', icon: MapPin, placeholder: 'San Francisco, CA' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/johndoe' },
  { key: 'website', label: 'Website', icon: Globe, placeholder: 'johndoe.dev' },
] as const;

export function PersonalInfoStep({ data, onChange }: PersonalInfoStepProps) {
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
        <p className="text-sm text-muted-foreground">Basic contact details for your resume header</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key} className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-sm">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              {label}
            </Label>
            <Input
              value={data[key]}
              onChange={(e) => update(key, e.target.value)}
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
