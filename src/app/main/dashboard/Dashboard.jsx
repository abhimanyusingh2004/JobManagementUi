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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { API_URL } from '@/lib/contant';
import { cn } from '@/lib/utils';

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
  const [fromDate, setFromDate] = useState(new Date(2025, 11, 1));
  const [toDate, setToDate] = useState(new Date(2025, 11, 31));
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    const fetchGeneralData = async () => {
      console.log('Fetching general dashboard data...');
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
      const fromDateStr = format(fromDate, 'yyyy-MM-dd');
      const toDateStr = format(toDate, 'yyyy-MM-dd');
      
      const res = await axios.get(`${API_URL}/JobAnalyst/date-range-wise`, {
        params: {
          fromDate: `${fromDateStr}T00:00:00Z`,
          toDate: `${toDateStr}T23:59:59Z`,
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
              <ChartContainer
                config={{
                  total: {
                    label: "Total Resumes",
                    color: "hsl(217, 91%, 60%)",
                  },
                  active: {
                    label: "Active",
                    color: "hsl(142, 76%, 36%)",
                  },
                  inactive: {
                    label: "Inactive",
                    color: "hsl(0, 84%, 60%)",
                  },
                }}
                className="h-[500px] w-full"
              >
                <BarChart 
                  data={jobTitleData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                  barGap={4}
                  barCategoryGap="15%"
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="jobTitle"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar 
                    dataKey="total" 
                    fill="var(--color-total)" 
                    radius={[6, 6, 0, 0]}
                    maxBarSize={50}
                  />
                  <Bar 
                    dataKey="active" 
                    fill="var(--color-active)" 
                    radius={[6, 6, 0, 0]}
                    maxBarSize={50}
                  />
                  <Bar 
                    dataKey="inactive" 
                    fill="var(--color-inactive)" 
                    radius={[6, 6, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ChartContainer>
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
                <Label htmlFor="from" className="mb-2">From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="from"
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal mt-1',
                        !fromDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={(date) => date && setFromDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1">
                <Label htmlFor="to" className="mb-2">To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="to"
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal mt-1',
                        !toDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={(date) => date && setToDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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

\      </div>
    </div>
  );
};

export default Dashboard;