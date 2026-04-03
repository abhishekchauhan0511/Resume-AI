import { Card } from '@/components/ui/card';
import type { ATSResult } from '@/lib/ats-checker';
import { CheckCircle, XCircle, AlertCircle, Shield } from 'lucide-react';

interface ATSScoreProps {
  result: ATSResult;
}

export function ATSScore({ result }: ATSScoreProps) {
  const gradeColor =
    result.grade === 'Excellent' ? 'text-green-500' :
    result.grade === 'Good' ? 'text-blue-500' :
    result.grade === 'Fair' ? 'text-yellow-500' : 'text-red-500';

  const gradeBackground =
    result.grade === 'Excellent' ? 'bg-green-50 border-green-200' :
    result.grade === 'Good' ? 'bg-blue-50 border-blue-200' :
    result.grade === 'Fair' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

  const scoreColor =
    result.overallScore >= 80 ? '#22c55e' :
    result.overallScore >= 60 ? '#3b82f6' :
    result.overallScore >= 40 ? '#eab308' : '#ef4444';

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">ATS Compatibility Score</h3>
      </div>

      {/* Score Circle */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-36 h-36">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="50"
              fill="none"
              stroke={scoreColor}
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - result.overallScore / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: scoreColor }}>
              {result.overallScore}%
            </span>
            <span className={`text-sm font-semibold ${gradeColor}`}>{result.grade}</span>
          </div>
        </div>

        {/* Summary Badge */}
        <div className={`mt-4 px-4 py-2 rounded-full border text-sm text-center max-w-xs ${gradeBackground}`}>
          {result.summary}
        </div>
      </div>

      {/* Individual Checks */}
      <div className="space-y-3">
        {result.checks.map((check, index) => (
          <div key={index} className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {check.passed ? (
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                ) : check.score > 0 ? (
                  <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                )}
                <span className="text-sm font-medium">{check.category}</span>
              </div>
              <span className="text-sm font-bold">
                {check.score}/{check.maxScore}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${(check.score / check.maxScore) * 100}%`,
                  backgroundColor: check.passed ? '#22c55e' : check.score > 0 ? '#eab308' : '#ef4444',
                }}
              />
            </div>

            <p className="text-xs text-muted-foreground">{check.message}</p>
            {!check.passed && (
              <p className="text-xs text-blue-600 mt-1">
                💡 {check.tip}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}