"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContextForm } from "./context-form";
import type { ContextEntry, ContextType } from "@/lib/types";

interface ContextListProps {
  entries: ContextEntry[];
  onUpdate: (id: string, data: { type: ContextType; title: string; content: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const typeLabels: Record<ContextType, string> = {
  business: "Business",
  event: "Event",
  date: "Date",
  general: "General",
};

const typeColours: Record<ContextType, string> = {
  business: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  event: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  date: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  general: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

export function ContextList({ entries, onUpdate, onDelete }: ContextListProps) {
  const [editingEntry, setEditingEntry] = useState<ContextEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUpdate = async (data: { type: ContextType; title: string; content: string }) => {
    if (!editingEntry) return;
    await onUpdate(editingEntry.id, data);
    setEditingEntry(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No context entries yet. Add some context to help the AI generate better posts.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{entry.title}</CardTitle>
                <Badge className={typeColours[entry.type]} variant="secondary">
                  {typeLabels[entry.type]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {entry.content}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingEntry(entry)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                >
                  {deletingId === entry.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingEntry} onOpenChange={() => setEditingEntry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Context</DialogTitle>
          </DialogHeader>
          {editingEntry && (
            <ContextForm
              entry={editingEntry}
              onSubmit={handleUpdate}
              onCancel={() => setEditingEntry(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
