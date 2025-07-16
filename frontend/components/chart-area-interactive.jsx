"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const dailyUsersConfig = {
  dates: {
    label: "Date",
  },
  counts: {
    label: "Daily Active Users",
    color: "var(--primary)",
  },
};

const apiRequestsConfig = {
  hours: {
    label: "Hour",
  },
  counts: {
    label: "API Calls",
    color: "var(--accent)",
  },
};

function DailyActiveUsersChart() {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          "http://localhost:8000/metrics/daily-active-users"
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();

        if (
          !json.dates ||
          !json.counts ||
          !Array.isArray(json.dates) ||
          !Array.isArray(json.counts)
        ) {
          throw new Error(
            "Invalid response format: missing dates or counts arrays"
          );
        }

        if (json.dates.length !== json.counts.length) {
          throw new Error(
            "Invalid response format: dates and counts arrays have different lengths"
          );
        }

        const combined = json.dates.map((dates, idx) => ({
          dates,
          counts: json.counts[idx],
        }));

        setChartData(combined);
      } catch (err) {
        console.error("Error fetching daily users data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  //Getting the count of yesterday's active users for comparison
  const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  };
  //Time filters - 30 and 7 days from today
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.dates);
    const referenceDate = getYesterday();
    let daysToSubtract = 30;
    if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="flex-1">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Daily Active Users</CardTitle>
            <CardDescription className="text-sm">
              Last {timeRange === "30d" ? "30" : "7"} days
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden md:flex"
            >
              <ToggleGroupItem value="30d" className="text-xs px-3">
                30d
              </ToggleGroupItem>
              <ToggleGroupItem value="7d" className="text-xs px-3">
                7d
              </ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-20 md:hidden" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">30d</SelectItem>
                <SelectItem value="7d">7d</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      {/*Show if error while loading data*/}
      <CardContent className="pt-0">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start gap-2">
              <span className="text-red-400 text-sm">⚠️</span>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Error loading data
                </h3>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="h-[200px] w-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-xs text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={dailyUsersConfig}
            className="aspect-auto h-[200px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-counts)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-counts)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="dates"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="counts"
                type="natural"
                fill="url(#fillUsers)"
                stroke="var(--color-counts)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}

        <div className="mt-3 text-xs text-muted-foreground">
          {loading
            ? "Loading..."
            : `${
                filteredData.length
              } data points (up to ${getYesterday().toLocaleDateString()})`}
        </div>
      </CardContent>
    </Card>
  );
}

function ApiRequestsChart() {
  const [timeRange, setTimeRange] = React.useState("24h");
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:8000/metrics/api-requests");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();

        if (
          !json.hours ||
          !json.counts ||
          !Array.isArray(json.hours) ||
          !Array.isArray(json.counts)
        ) {
          throw new Error(
            "Invalid response format: missing hours or counts arrays"
          );
        }

        if (json.hours.length !== json.counts.length) {
          throw new Error(
            "Invalid response format: hours and counts arrays have different lengths"
          );
        }

        const combined = json.hours.map((hours, idx) => ({
          hours,
          counts: json.counts[idx],
        }));

        setChartData(combined);
      } catch (err) {
        console.error("Error fetching API requests data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredData = chartData.filter((item, index) => {
    if (timeRange === "24h") {
      return index >= Math.max(0, chartData.length - 24);
    } else if (timeRange === "12h") {
      return index >= Math.max(0, chartData.length - 12);
    }
    return true;
  });
  //Filters - last 24 or 12 hours (default - 24h)
  return (
    <Card className="flex-1">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">API Requests</CardTitle>
            <CardDescription className="text-sm">
              Last {timeRange === "24h" ? "24" : "12"} hours
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden md:flex"
            >
              <ToggleGroupItem value="24h" className="text-xs px-3">
                24h
              </ToggleGroupItem>
              <ToggleGroupItem value="12h" className="text-xs px-3">
                12h
              </ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-20 md:hidden" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="12h">12h</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      {/*Show error if loading data fails*/}
      <CardContent className="pt-0">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start gap-2">
              <span className="text-red-400 text-sm">⚠️</span>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Error loading data
                </h3>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="h-[200px] w-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-2 text-xs text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={apiRequestsConfig}
            className="aspect-auto h-[200px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillApi" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-counts)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-counts)"
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hours"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  // Format hour string to display time
                  const date = new Date(value);
                  return date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="counts"
                type="natural"
                fill="url(#fillApi)"
                stroke="var(--color-counts)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}

        <div className="mt-3 text-xs text-muted-foreground">
          {loading
            ? "Loading..."
            : `${filteredData.length} data points for last ${timeRange}`}
        </div>
      </CardContent>
    </Card>
  );
}

function NewSignupsChart() {
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:8000/metrics/new-signups");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();

        if (
          !json.dates ||
          !json.counts ||
          !Array.isArray(json.dates) ||
          !Array.isArray(json.counts)
        ) {
          throw new Error(
            "Invalid response format: missing dates or counts arrays"
          );
        }

        if (json.dates.length !== json.counts.length) {
          throw new Error("dates and counts arrays have different lengths");
        }

        const combined = json.dates.map((date, idx) => ({
          date,
          count: json.counts[idx],
        }));

        setChartData(combined);
      } catch (err) {
        console.error("Error fetching new signups data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <Card className="flex-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">New Signups</CardTitle>
        <CardDescription className="text-sm">Last 7 days</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start gap-2">
              <span className="text-red-400 text-sm">⚠️</span>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Error loading data
                </h3>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="h-[200px] w-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-xs text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={{
              date: { label: "Date" },
              count: { label: "New Signups", color: "var(--primary)" },
            }}
            className="aspect-auto h-[200px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillSignups" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="count"
                type="natural"
                fill="url(#fillSignups)"
                stroke="var(--color-count)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}

        <div className="mt-3 text-xs text-muted-foreground">
          {loading
            ? "Loading..."
            : `${chartData.length} data points from signup API`}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TripleChartsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <DailyActiveUsersChart />
        <ApiRequestsChart />
        <NewSignupsChart />
      </div>
    </div>
  );
}

export { DailyActiveUsersChart, ApiRequestsChart };
