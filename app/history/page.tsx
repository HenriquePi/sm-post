"use client";

import { useEffect, useState, useCallback } from "react";
import { HistoryList } from "@/components/history-list";
import { toast } from "sonner";
import type { PostHistoryEntry } from "@/lib/types";

export default function HistoryPage() {
  const [entries, setEntries] = useState<PostHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (error) {
      console.error("Failed to fetch post history:", error);
      toast.error("Failed to load post history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleUpdate = async (id: string, data: Partial<PostHistoryEntry>) => {
    const res = await fetch(`/api/history/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to update post history");
    }

    toast.success("Post history updated");
    await fetchEntries();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/history/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete post history");
    }

    toast.success("Post history deleted");
    await fetchEntries();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Post History</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Post History</h1>
        <p className="text-muted-foreground">
          View and manage your published posts. Edit the abbreviated content used for AI context.
        </p>
      </div>

      <HistoryList entries={entries} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  );
}
