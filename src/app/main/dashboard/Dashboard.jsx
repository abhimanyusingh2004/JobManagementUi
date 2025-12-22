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

const API_BASE = 'https://localhost:7245/api/JobAnalyst';

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

  const [jobTitles, setJobTitles] = useState([]);
  const [dateRangeData, setDateRangeData] = useState([]);
  const [fromDate, setFromDate] = useState('2025-12-01');
  const [toDate, setToDate] = useState('2025-12-31');
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const [monthlyRes, weeklyRes, yearlyRes, jobTitleRes] = await Promise.all([
          axios.get(`${API_BASE}/monthly-wise`),
          axios.get(`${API_BASE}/weekly-wise`),
          axios.get(`${API_BASE}/yearly-wise`),
          axios.get(`${API_BASE}/jobtitle-wise`),
        ]);

        const monthly = monthlyRes.data.data?.[0]?.totalResumes || 0;
        const weeklyItem = weeklyRes.data.data?.[0] || {};
        const weekly = weeklyItem.totalResumes || 0;
        const yearly = yearlyRes.data.data?.[0]?.totalResumes || 0;

        setStats({ monthly, weekly, yearly, total: yearly });
        setWeeklyInfo({ week: weeklyItem.week ?? 'N/A', year: weeklyItem.year ?? 'N/A' });

        const jobData = (jobTitleRes.data.data || [])
          .filter((item) => item.totalResumes > 0)
          .map((item) => ({
            jobTitle: item.jobTitle || 'Unknown',
            totalResumes: item.totalResumes,
          }));

        setJobTitles(jobData);
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
      const res = await axios.get(`${API_BASE}/date-range-wise`, {
        params: {
          fromDate: `${fromDate}T12:00:00Z`,
          toDate: `${toDate}T12:00:00Z`,
        },
      });

      const data = res.data.data || [];
      setDateRangeData(data);
    } catch (error) {
      console.error('Error fetching date range:', error);
      setDateRangeData([]);
      alert('Failed to load data. Check console.');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchDateRangeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Resume Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Current as of December 22, 2025
          </p>
        </div>

        {/* Key Number Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader><Skeleton className="h-6 w-32 mx-auto" /></CardHeader>
                <CardContent className="text-center"><Skeleton className="h-16 w-32 mx-auto" /></CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">This Month</CardTitle>
                  <Badge variant="secondary" className="mt-2">December 2025</Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.monthly}
                  </div>
                  <p className="text-muted-foreground mt-3">Resumes Received</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">This Week</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    Week {weeklyInfo.week} • {weeklyInfo.year}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-5xl font-bold text-green-600 dark:text-green-400">
                    {stats.weekly}
                  </div>
                  <p className="text-muted-foreground mt-3">Resumes Received</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">This Year</CardTitle>
                  <Badge variant="secondary" className="mt-2">2025</Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-5xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.yearly}
                  </div>
                  <p className="text-muted-foreground mt-3">Total Resumes</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">All Time</CardTitle>
                  <Badge variant="outline" className="mt-2">Total</Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-5xl font-bold text-orange-600 dark:text-orange-400">
                    {stats.total}
                  </div>
                  <p className="text-muted-foreground mt-3">Across All Jobs</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Job Titles List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Resumes by Job Title</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : jobTitles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {jobTitles.map((job, i) => (
                  <div
                    key={i}
                    className="text-center p-6 bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <p className="text-xl font-semibold">{job.jobTitle}</p>
                    <p className="text-5xl font-bold text-primary mt-4">
                      {job.totalResumes}
                    </p>
                    <p className="text-muted-foreground mt-2">applications</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-10">
                No job title data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Date Range Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Resumes by Job Title (Date Range)
            </CardTitle>
            <CardDescription className="text-center">
              Select a date range to filter by job title
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-end justify-center">
              <div>
                <Label htmlFor="from">From Date</Label>
                <Input
                  id="from"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="to">To Date</Label>
                <Input
                  id="to"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <Button onClick={fetchDateRangeData} disabled={tableLoading}>
                {tableLoading ? 'Loading...' : 'Load Data'}
              </Button>
            </div>

            {tableLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : dateRangeData.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead className="text-right">Total Resumes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dateRangeData.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
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
                No resumes found in the selected date range.
              </p>
            )}
          </CardContent>
        </Card>

        <footer className="text-center text-muted-foreground py-6">
          Last updated: {new Date().toLocaleString()}
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;