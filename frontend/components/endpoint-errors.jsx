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

//Fetch endpoints json form API
export default function EndpointErrors() {
  const [data, setData] = useState({ endpoint: [], counts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("http://localhost:8000/metrics/endpoint-error");
        if (!res.ok) throw new Error("Failed to fetch endpoint error data.");
        const result = await res.json();
        setData(result);
      } catch (err) {
        toast.error("Error loading endpoint metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">API Endpoint Errors</h3>

      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
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
              <TableHead>Endpoint</TableHead>
              <TableHead className="text-right">Error Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.endpoint.map((ep, i) => (
              <TableRow key={i}>
                <TableCell>{ep}</TableCell>
                <TableCell className="text-right">
                  {data.counts[i].toFixed(3)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
