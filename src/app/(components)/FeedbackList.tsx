"use client";

import { useEffect, useMemo, useState } from "react";
import { Feedback } from "../../../types/admin";
import FeedbackItem from "./FeedbackItem";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [category, setCategory] = useState("all");

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({ from: undefined, to: undefined });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function fetchFeedbacks() {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        params.append("page", String(page));
        params.append("limit", "10");

        if (debouncedSearch) params.append("search", debouncedSearch);
        if (sortOrder) params.append("sort", sortOrder);
        if (category !== "all") params.append("category", category);

        if (dateRange?.from) {
          params.append("from", format(dateRange.from, "yyyy-MM-dd"));
        }
        if (dateRange?.to) {
          params.append("to", format(dateRange.to, "yyyy-MM-dd"));
        }

        const res = await fetch(`/api/admin/fetch-feedback?${params}`);
        const data = await res.json();

        if (data.success && data.data) {
          setFeedbacks(data.data.feedbacks || []);
          setTotalPages(data.data.pagination?.totalPages || 1);
        }
      } catch (err) {
        console.error("Failed to compile feedback data streams:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedbacks();
  }, [page, debouncedSearch, sortOrder, category, dateRange]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    feedbacks.forEach((f: any) => f.category && set.add(f.category));
    return ["all", ...Array.from(set)];
  }, [feedbacks]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif text-white">
          Application Feedback Registry
        </h2>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Search feedback..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-slate-950 border-slate-800 text-white"
        />

        <Select
          value={sortOrder}
          onValueChange={(v) => {
            setPage(1);
            setSortOrder(v as "newest" | "oldest");
          }}
        >
          <SelectTrigger className="w-35 bg-slate-950 border-slate-800 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-950 border-slate-800 text-white">
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={category}
          onValueChange={(v) => {
            setPage(1);
            setCategory(v);
          }}
        >
          <SelectTrigger className="w-[160px] bg-slate-950 border-slate-800 text-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-slate-950 border-slate-800 text-white">
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[240px] justify-start text-left font-normal bg-slate-950 border-slate-800 text-white"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                "Pick date range"
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            className="w-auto p-0 bg-slate-950 border-slate-800 text-white"
          >
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                setPage(1);
                setDateRange(range || { from: undefined, to: undefined });
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {(dateRange.from || dateRange.to) && (
          <button
            onClick={() => {
              setPage(1);
              setDateRange({ from: undefined, to: undefined });
            }}
            className="text-xs text-red-400 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="overflow-hidden border border-slate-900 rounded-2xl bg-slate-950/20 backdrop-blur-md">
        <div className="divide-y divide-slate-900">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="p-4 animate-pulse border-b border-slate-800"
              >
                <div className="h-4 bg-slate-800 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-slate-800 rounded w-2/3"></div>
              </div>
            ))
          ) : feedbacks.length > 0 ? (
            feedbacks.map((item, idx) => (
              <FeedbackItem key={item._id || idx} item={item} />
            ))
          ) : (
            <div className="text-center py-6 text-slate-400">
              No results found.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 text-sm bg-slate-800 text-white rounded disabled:opacity-40 transition-opacity"
        >
          Prev
        </button>

        <span className="text-sm text-slate-400">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 text-sm bg-slate-800 text-white rounded disabled:opacity-40 transition-opacity"
        >
          Next
        </button>
      </div>
    </div>
  );
}