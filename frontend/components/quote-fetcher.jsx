"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

//Fetch n quotes
export default function QuoteFetcher() {
  const [n, setN] = useState(3);
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [error, setError] = useState(null);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8000/quotes?n=${n}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setQuotes(data);
    } catch (err) {
      toast.error("Failed to fetch quotes.");
      setError(err.message);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Quotes</h1>
      <div className="flex items-center gap-4">
        <Input
          type="number"
          min="1"
          value={n}
          onChange={(e) => setN(e.target.value)}
          className="w-24"
          placeholder="Number of quotes"
        />
        <Button onClick={fetchQuotes}>Generate Quotes</Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(n)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ))}
        </div>
      ) : quotes.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote</TableHead>
              <TableHead>Author</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="whitespace-normal break-words">
                  {item.quote}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.author}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        !error && <p className="text-muted-foreground">No quotes loaded.</p>
      )}
    </div>
  );
}
