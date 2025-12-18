"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { PostHistoryEntry, PostStatus } from "@/lib/types";

interface HistoryListProps {
  entries: PostHistoryEntry[];
  onUpdate: (id: string, data: Partial<PostHistoryEntry>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const statusColours: Record<PostStatus, string> = {
  published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const platformColours: Record<string, string> = {
  linkedin: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  facebook: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
};

export function HistoryList({ entries, onUpdate, onDelete }: HistoryListProps) {
  const [editingEntry, setEditingEntry] = useState<PostHistoryEntry | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const openEdit = (entry: PostHistoryEntry) => {
    setEditingEntry(entry);
    setEditContent(entry.abbreviatedContent);
  };

  const handleUpdate = async () => {
    if (!editingEntry) return;
    setSaving(true);
    try {
      await onUpdate(editingEntry.id, { abbreviatedContent: editContent.trim() });
      setEditingEntry(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No posts yet. Create your first post to see it here.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Badge className={platformColours[entry.platform] ?? "bg-gray-100"}>
                    {entry.platform}
                  </Badge>
                  <Badge className={statusColours[entry.status]} variant="secondary">
                    {entry.status}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDate(entry.postedAt)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{entry.abbreviatedContent}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(entry)}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Abbreviated Content</Label>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {editContent.length}/100 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEntry(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
