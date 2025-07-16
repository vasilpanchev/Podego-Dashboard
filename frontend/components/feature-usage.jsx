"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Fetch feature usage from API
export default function FeatureUsage() {
  const [data, setData] = useState({ feature: [], fraction: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatureUsage = async () => {
      try {
        const res = await fetch("http://localhost:8000/metrics/feature-usage");
        if (!res.ok) throw new Error("Failed to fetch feature usage data.");
        const result = await res.json();
        setData(result);
      } catch (err) {
        toast.error("Error loading feature usage metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeatureUsage();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Feature Usage Metrics</h3>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              <TableHead className="text-right">Usage Fraction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.feature.map((f, i) => (
              <TableRow key={i}>
                <TableCell>{f}</TableCell>
                <TableCell className="text-right">
                  {data.fraction[i].toFixed(3)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
