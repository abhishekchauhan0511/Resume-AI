import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { getAnalyticsData } from '@/lib/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, FileText, Target, Award, Loader2 } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-6xl text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold mb-2">No Data Yet!</h2>
        <p className="text-muted-foreground">
          Analyze your first resume to see your analytics dashboard.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            📊 Your Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track your resume performance over time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FileText, label: 'Total Analyses', value: data.totalAnalyses, color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: Target, label: 'Avg Match Score', value: `${data.avgMatch}%`, color: 'text-green-500', bg: 'bg-green-50' },
            { icon: Award, label: 'Avg ATS Score', value: `${data.avgATS}%`, color: 'text-purple-500', bg: 'bg-purple-50' },
            { icon: TrendingUp, label: 'Best Match', value: `${data.bestMatch}%`, color: 'text-orange-500', bg: 'bg-orange-50' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4">
              <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* Match Score Trend */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">📈 Match Score Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.last7}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="match" stroke="#4f46e5" strokeWidth={2} dot={{ fill: '#4f46e5' }} name="Match %" />
                <Line type="monotone" dataKey="ats" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} name="ATS %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Missing Skills */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">🎯 Top Missing Skills</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.topMissingSkills} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="skill" type="category" tick={{ fontSize: 11 }} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} name="Times Missing" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Comparison */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Match vs ATS Score Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.last7}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="match" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Match %" />
              <Bar dataKey="ats" fill="#22c55e" radius={[4, 4, 0, 0]} name="ATS %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </main>
    </div>
  );
}