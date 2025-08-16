import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Icons } from './ui/icons';
import { Progress } from './ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardMetrics {
  totalJobs: number;
  totalApplications: number;
  totalViews: number;
  totalMatches: number;
  conversionRate: number;
  profileCompleteness: number;
  skillMatchRate: number;
  responseTime: number;
}

interface TimeSeriesData {
  date: string;
  jobs: number;
  applications: number;
  views: number;
  matches: number;
}

interface SkillData {
  name: string;
  demand: number;
  salary: number;
  color: string;
}

interface LocationData {
  name: string;
  jobs: number;
  applications: number;
}

const mockMetrics: DashboardMetrics = {
  totalJobs: 247,
  totalApplications: 89,
  totalViews: 1542,
  totalMatches: 23,
  conversionRate: 36.2,
  profileCompleteness: 85,
  skillMatchRate: 78,
  responseTime: 2.4
};

const mockTimeSeriesData: TimeSeriesData[] = [
  { date: '2024-01-01', jobs: 20, applications: 5, views: 120, matches: 2 },
  { date: '2024-01-02', jobs: 25, applications: 8, views: 145, matches: 3 },
  { date: '2024-01-03', jobs: 18, applications: 6, views: 110, matches: 1 },
  { date: '2024-01-04', jobs: 32, applications: 12, views: 180, matches: 4 },
  { date: '2024-01-05', jobs: 28, applications: 10, views: 165, matches: 3 },
  { date: '2024-01-06', jobs: 35, applications: 15, views: 200, matches: 5 },
  { date: '2024-01-07', jobs: 30, applications: 11, views: 175, matches: 4 },
];

const mockSkillData: SkillData[] = [
  { name: 'React', demand: 95, salary: 120000, color: '#61DAFB' },
  { name: 'TypeScript', demand: 88, salary: 115000, color: '#3178C6' },
  { name: 'Node.js', demand: 82, salary: 110000, color: '#339933' },
  { name: 'Python', demand: 90, salary: 118000, color: '#3776AB' },
  { name: 'AWS', demand: 85, salary: 125000, color: '#FF9900' },
  { name: 'Docker', demand: 78, salary: 108000, color: '#2496ED' },
];

const mockLocationData: LocationData[] = [
  { name: 'Zurich', jobs: 89, applications: 23 },
  { name: 'Geneva', jobs: 67, applications: 18 },
  { name: 'Basel', jobs: 45, applications: 12 },
  { name: 'Bern', jobs: 32, applications: 8 },
  { name: 'Lausanne', jobs: 28, applications: 7 },
];

export function EnhancedAnalyticsDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>(mockTimeSeriesData);
  const [skillData, setSkillData] = useState<SkillData[]>(mockSkillData);
  const [locationData, setLocationData] = useState<LocationData[]>(mockLocationData);
  const [loading, setLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Real-time data updates
  useEffect(() => {
    if (!user) return;

    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // Try to fetch real data from Supabase
        const { data: jobs, error: jobsError } = await supabase
          .from('jobs')
          .select('id, created_at, title, location');

        const { data: applications, error: appsError } = await supabase
          .from('applications')
          .select('id, created_at, job_id')
          .eq('candidate_id', user.id);

        if (!jobsError && jobs) {
          setMetrics(prev => ({
            ...prev,
            totalJobs: jobs.length,
            totalApplications: applications?.length || 0
          }));
        }
      } catch (error) {
        console.log('Using mock data for analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Set up real-time subscription for live updates
    const channel = supabase
      .channel('analytics_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => {
        fetchMetrics();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => {
        fetchMetrics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const MetricCard = ({ title, value, change, icon: Icon, color }: {
    title: string;
    value: string | number;
    change: number;
    icon: any;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              <div className="flex items-center mt-2">
                <Badge
                  variant={change >= 0 ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {change >= 0 ? '+' : ''}{change}%
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">vs last period</span>
              </div>
            </div>
            <div className={`p-3 rounded-full ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights into your job search</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={selectedTimeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={selectedTimeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={selectedTimeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('90d')}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Job Views"
          value={metrics.totalViews.toLocaleString()}
          change={12.5}
          icon={Icons.eye}
          color="bg-blue-500"
        />
        <MetricCard
          title="Applications Sent"
          value={metrics.totalApplications}
          change={8.2}
          icon={Icons.send}
          color="bg-green-500"
        />
        <MetricCard
          title="Profile Matches"
          value={metrics.totalMatches}
          change={-2.4}
          icon={Icons.target}
          color="bg-purple-500"
        />
        <MetricCard
          title="Response Rate"
          value={`${metrics.conversionRate}%`}
          change={5.1}
          icon={Icons.trendingUp}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.chart className="h-5 w-5" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="applications" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="matches" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skill Demand */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.graduation className="h-5 w-5" />
              Top Skills in Demand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => 
                  name === 'demand' ? [`${value}%`, 'Demand'] : [`CHF ${value.toLocaleString()}`, 'Avg Salary']
                } />
                <Bar dataKey="demand" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lower Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Location Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.mapPin className="h-5 w-5" />
              Jobs by Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="jobs"
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profile Completeness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.user className="h-5 w-5" />
              Profile Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Profile Completeness</span>
                <span>{metrics.profileCompleteness}%</span>
              </div>
              <Progress value={metrics.profileCompleteness} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Skill Match Rate</span>
                <span>{metrics.skillMatchRate}%</span>
              </div>
              <Progress value={metrics.skillMatchRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Response Time</span>
                <span>{metrics.responseTime}h avg</span>
              </div>
              <Progress value={(24 - metrics.responseTime) / 24 * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Icons.upload className="h-4 w-4 mr-2" />
              Update CV
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Icons.target className="h-4 w-4 mr-2" />
              Find New Matches
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Icons.bell className="h-4 w-4 mr-2" />
              Set Job Alerts
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Icons.share className="h-4 w-4 mr-2" />
              Share Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Real-time updates active</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
              <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
                <Icons.spinner className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EnhancedAnalyticsDashboard;
