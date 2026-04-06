import { useEffect, useState } from 'react';
import { fetchRealJobs, type RealJob } from '@/lib/jobs-api';
import { ExternalLink, MapPin, Building2, Clock, DollarSign, Loader2 } from 'lucide-react';

interface RealJobsProps {
  skills: string[];
}

export function RealJobs({ skills }: RealJobsProps) {
  const [jobs, setJobs] = useState<RealJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (skills.length > 0) {
      fetchRealJobs(skills).then((data) => {
        setJobs(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [skills]);

  if (loading) return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">🌐 Real Job Openings</h3>
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Fetching live jobs...</span>
      </div>
    </div>
  );

  if (jobs.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">🌐 Real Job Openings For You</h3>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          Live from LinkedIn & Indeed
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map((job, index) => (
          <div key={index} className="border border-border rounded-lg p-4 hover:border-primary transition-colors">

            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-sm leading-tight">
                  {job.title}
                </h4>
                <div className="flex items-center gap-1 mt-1">
                  <Building2 className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{job.company}</span>
                </div>
              </div>

              {/* Match Score */}
              <div className={`px-2 py-1 rounded-full text-xs font-bold ml-2 ${
                job.matchScore >= 70
                  ? 'bg-green-100 text-green-700'
                  : job.matchScore >= 50
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {job.matchScore}%
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{job.salary}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{job.postedAt} • {job.jobType}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {job.description}
            </p>

            {/* Apply Button */}
            <a
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Apply Now
            </a>

          </div>
        ))}
      </div>
    </div>
  );
}
