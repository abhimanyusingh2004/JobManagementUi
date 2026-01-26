'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { API_URL } from '@/lib/contant';

const Dashboard = () => {
  const [stats, setStats] = useState({
    monthly: 0,
    weekly: 0,
    yearly: 0,
    total: 0,
  });

  const [weeklyInfo, setWeeklyInfo] = useState({
    week: 'N/A',
    year: 'N/A',
  });

  const [jobTitleData, setJobTitleData] = useState([]); // For chart
  const [dateRangeData, setDateRangeData] = useState([]);
  const [fromDate, setFromDate] = useState('2025-12-01');
  const [toDate, setToDate] = useState('2025-12-31');
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const [monthlyRes, weeklyRes, yearlyRes, jobTitleRes] = await Promise.all([
          axios.get(`${API_URL}/JobAnalyst/monthly-wise`),
          axios.get(`${API_URL}/JobAnalyst/weekly-wise`),
          axios.get(`${API_URL}/JobAnalyst/yearly-wise`),
          axios.get(`${API_URL}/JobAnalyst/jobtitle-wise`),
        ]);

        const monthly = monthlyRes.data.data?.[0]?.totalResumes || 0;
        const weeklyItem = weeklyRes.data.data?.[0] || {};
        const weekly = weeklyItem.totalResumes || 0;
        const yearly = yearlyRes.data.data?.[0]?.totalResumes || 0;

        setStats({ monthly, weekly, yearly, total: yearly });
        setWeeklyInfo({ week: weeklyItem.week ?? 'N/A', year: weeklyItem.year ?? 'N/A' });

        // Process job title data for chart
        const chartData = (jobTitleRes.data.data || [])
          .filter((item) => item.total > 0)
          .map((item) => ({
            jobTitle: item.jobTitle || 'Unknown',
            total: item.total,
            active: item.active,
            inactive: item.inactive,
          }))
          .sort((a, b) => b.total - a.total); // Sort by total descending

        setJobTitleData(chartData);
      } catch (error) {
        console.error('Error fetching general data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, []);

  const fetchDateRangeData = async () => {
    if (!fromDate || !toDate || fromDate > toDate) {
      alert('Please select valid from and to dates');
      return;
    }

    setTableLoading(true);
    try {
      const res = await axios.get(`${API_URL}/JobAnalyst/date-range-wise`, {
        params: {
          fromDate: `${fromDate}T00:00:00Z`,
          toDate: `${toDate}T23:59:59Z`,
        },
      });

      setDateRangeData(res.data.data || []);
    } catch (error) {
      console.error('Error fetching date range:', error);
      setDateRangeData([]);
      alert('Failed to load data.');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchDateRangeData();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full space-y-10 p-6 md:p-10">
        {/* Header */}
    

        {/* Stats Cards - Wide & Short */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-5 w-24 mb-3" />
                <Skeleton className="h-12 w-32" />
              </Card>
            ))
          ) : (
            <>
              <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-700 dark:text-blue-400">
                    {stats.monthly}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Resumes received</p>
                </CardContent>
              </Card>

              <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
                    This Week
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit text-xs">
                    W{weeklyInfo.week} • {weeklyInfo.year}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-700 dark:text-green-400">
                    {stats.weekly}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Resumes received</p>
                </CardContent>
              </Card>

              <Card className="p-6 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">
                    This Year
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-purple-700 dark:text-purple-400">
                    {stats.yearly}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total resumes</p>
                </CardContent>
              </Card>

              <Card className="p-6 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400">
                    All Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-orange-700 dark:text-orange-400">
                    {stats.total}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Across all positions</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Job Title Distribution Chart */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-2xl">Resumes by Job Title</CardTitle>
            <CardDescription>
              Distribution of applications across active job openings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-96 w-full rounded-lg" />
            ) : jobTitleData.length > 0 ? (
              <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={jobTitleData} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                    barGap={8}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis
                      dataKey="jobTitle"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      label={{ value: 'Number of Resumes', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="rect"
                    />
                    <Bar 
                      dataKey="total" 
                      fill="#3b82f6" 
                      name="Total Resumes" 
                      radius={[8, 8, 0, 0]}
                      maxBarSize={80}
                    />
                    <Bar 
                      dataKey="active" 
                      fill="#10b981" 
                      name="Active" 
                      radius={[8, 8, 0, 0]}
                      maxBarSize={80}
                    />
                    <Bar 
                      dataKey="inactive" 
                      fill="#ef4444" 
                      name="Inactive" 
                      radius={[8, 8, 0, 0]}
                      maxBarSize={80}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-16">
                No job title data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Date Range Table */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-2xl">Custom Date Range Analysis</CardTitle>
            <CardDescription>
              View resume count per job title in a selected period
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-end justify-center max-w-2xl mx-auto">
              <div className="flex-1">
                <Label htmlFor="from">From Date</Label>
                <Input
                  id="from"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="to">To Date</Label>
                <Input
                  id="to"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <Button onClick={fetchDateRangeData} disabled={tableLoading}>
                {tableLoading ? 'Loading...' : 'Apply Filter'}
              </Button>
            </div>

            {tableLoading ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : dateRangeData.length > 0 ? (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead className="text-right">Resumes Received</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dateRangeData.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium capitalize">
                          {item.jobTitle || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-right font-bold text-lg">
                          {item.totalResumes}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                No data found for the selected date range.
              </p>
            )}
          </CardContent>
        </Card>

        <footer className="text-center text-sm text-muted-foreground py-8">
          Resume Analytics • Powered by JobAnalyst API
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;