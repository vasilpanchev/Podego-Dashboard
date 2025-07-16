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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const chartConfig = {
  country: {
    label: "Country",
    color: "var(--color-accent)",
    icon: Activity,
  },
};

//Get top 15 countries by percentage of users count
export default function CountryBarChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/metrics/country-metrics"
        );
        const json = await res.json();

        const total = json.counts.reduce((a, b) => a + b, 0);
        const formatted = json.country.map((code, i) => ({
          country: code || "N/A",
          value: parseFloat(((json.counts[i] / total) * 100).toFixed(2)),
        }));

        const sorted = formatted
          .filter((d) => d.country !== "")
          .sort((a, b) => b.value - a.value)
          .slice(0, 15);

        setChartData(sorted);
      } catch (err) {
        toast.error("Failed to fetch country-metrics");
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Country Usage</CardTitle>
        <CardDescription>Top 15 countries by usage (%)</CardDescription>
      </CardHeader>
      <CardContent className="h-full sm:h-full md:h-full">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="country"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />

              <YAxis
                tickFormatter={(val) => `${val}%`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={{ fill: "transparent" }}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="value"
                fill="var(--color-country)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
