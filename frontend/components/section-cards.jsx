"use client";

import React from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function TotalUsersCard() {
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [percentageChange, setPercentageChange] = React.useState(null);

  //Fetch daily active users metrics from API
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

        if (
          json.dates.length !== json.counts.length ||
          json.counts.length < 2
        ) {
          throw new Error(
            "dates and counts must match in length and have at least two entries"
          );
        }

        //Calculate the latest day users to the previus one (in percentage)
        const latestCount = json.counts.at(-1);
        const previousCount = json.counts.at(-2);

        setTotalUsers(latestCount);

        if (previousCount > 0) {
          const delta = ((latestCount - previousCount) / previousCount) * 100;
          setPercentageChange(delta);
        } else {
          setPercentageChange(null);
        }
      } catch (err) {
        console.error("Error fetching daily users data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Active Users (Today)</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {loading
            ? "Loading..."
            : error
            ? "Error"
            : totalUsers.toLocaleString()}
        </CardTitle>
        <CardAction>
          {percentageChange !== null && (
            <Badge
              variant={
                percentageChange >= 0 ? "statistic_up" : "statistic_down"
              }
            >
              {percentageChange >= 0 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {percentageChange.toFixed(1)}%
            </Badge>
          )}
        </CardAction>
      </CardHeader>
      {/*Handle not loaded state*/}
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {loading
            ? "Fetching data..."
            : error
            ? "Could not load stats"
            : "Total unique users active today"}
        </div>
        <div className="text-muted-foreground">Compared to yesterday's</div>
      </CardFooter>
    </Card>
  );
}

function ApiRequestsCard() {
  const [latestRequests, setLatestRequests] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [percentageChange, setPercentageChange] = React.useState(null);
  //Fetch api requests metrics from API
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

        if (
          json.hours.length !== json.counts.length ||
          json.counts.length < 2
        ) {
          throw new Error("hours and counts arrays mismatch or too short");
        }

        //Calculate the difference to the previus hour (in percentage)
        const currentHour = json.counts.at(-1);
        const previousHour = json.counts.at(-2);

        setLatestRequests(currentHour);

        if (previousHour > 0) {
          const delta = ((currentHour - previousHour) / previousHour) * 100;
          setPercentageChange(delta);
        } else {
          setPercentageChange(null);
        }
      } catch (err) {
        console.error("Error fetching API requests data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>API Requests (Last Hour)</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {loading
            ? "Loading..."
            : error
            ? "Error"
            : latestRequests.toLocaleString()}
        </CardTitle>
        <CardAction>
          {percentageChange !== null && (
            <Badge
              variant={
                percentageChange >= 0 ? "statistic_up" : "statistic_down"
              }
            >
              {percentageChange >= 0 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {percentageChange.toFixed(1)}%
            </Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {loading
            ? "Fetching data..."
            : error
            ? "Could not load stats"
            : "Requests made in the last hour"}
        </div>
        <div className="text-muted-foreground">
          Compared to the previous hour
        </div>
      </CardFooter>
    </Card>
  );
}

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
      <TotalUsersCard />

      <ApiRequestsCard />
    </div>
  );
}
