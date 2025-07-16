"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  response: {
    label: "Response Time",
    color: "var(--color-primary)",
    icon: Timer,
  },
};

//Fetch response time per endpoint from API
export default function ResponseTimeChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/metrics/response-times");
        const json = await res.json();
        setData(json);
      } catch (err) {
        toast.error("Failed to fetch response time metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //Loading state placeholders
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>API Response Times</CardTitle>
          <CardDescription>Loading metrics...</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] sm:h-[400px] md:h-[500px]">
          <Skeleton className="w-full h-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.endpoint || !data.response_time) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>API Response Times</CardTitle>
          <CardDescription>Could not load metrics.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { endpoint, response_time } = data;

  return (
    <Tabs defaultValue={endpoint[0]} className="w-full">
      <div className="overflow-x-auto">
        <TabsList className="inline-flex w-max whitespace-nowrap gap-1">
          {endpoint.map((ep, i) => (
            <TabsTrigger key={i} value={ep}>
              {ep}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {endpoint.map((ep, i) => {
        const bins = response_time[i].bins_left_edge;
        const counts = response_time[i].counts;

        const chartData = bins.map((binStart, idx) => {
          const binEnd = bins[idx + 1] || "∞";
          return {
            label: `${binStart}-${binEnd}ms`,
            value: counts[idx],
          };
        });

        return (
          <TabsContent key={ep} value={ep}>
            <Card className="h-full mt-0">
              <CardHeader>
                <CardTitle>{ep} Response Time</CardTitle>
                <CardDescription>
                  Distribution of response times (ms)
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[400px] md:h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer
                    config={chartConfig}
                    className="w-full h-full"
                  >
                    <BarChart
                      data={chartData}
                      margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        // Recharts will auto-skip labels if too crowded
                      />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                      <ChartTooltip
                        cursor={{ fill: "transparent" }}
                        content={<ChartTooltipContent />}
                      />
                      <Bar
                        dataKey="value"
                        fill="var(--color-response)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
