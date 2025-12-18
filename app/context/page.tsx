"use client";

import { useEffect, useState, useCallback } from "react";
import { ContextForm } from "@/components/context-form";
import { ContextList } from "@/components/context-list";
import { toast } from "sonner";
import type { ContextEntry, ContextType } from "@/lib/types";

export default function ContextPage() {
  const [entries, setEntries] = useState<ContextEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/context");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (error) {
      console.error("Failed to fetch context entries:", error);
      toast.error("Failed to load context entries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleCreate = async (data: { type: ContextType; title: string; content: string }) => {
    const res = await fetch("/api/context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to create context entry");
    }

    toast.success("Context added");
    await fetchEntries();
  };

  const handleUpdate = async (
    id: string,
    data: { type: ContextType; title: string; content: string }
  ) => {
    const res = await fetch(`/api/context/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to update context entry");
    }

    toast.success("Context updated");
    await fetchEntries();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/context/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete context entry");
    }

    toast.success("Context deleted");
    await fetchEntries();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Context Manager</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Context Manager</h1>
        <p className="text-muted-foreground">
          Add business information, events, and dates to help the AI generate relevant posts
        </p>
      </div>

      <ContextForm onSubmit={handleCreate} />

      <div>
        <h2 className="text-xl font-semibold mb-4">Saved Context</h2>
        <ContextList entries={entries} onUpdate={handleUpdate} onDelete={handleDelete} />
      </div>
    </div>
  );
}
