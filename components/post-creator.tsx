"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformSelector } from "./platform-selector";
import { PlatformConnector } from "./platform-connector";
import { toast } from "sonner";

export function PostCreator() {
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [savingManual, setSavingManual] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          platforms: selectedPlatforms,
          includeContext: true,
          includeHistory: true,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate post");
      }

      const data = await res.json();
      setGeneratedContent(data.content);
      toast.success("Post generated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate post");
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedContent.trim()) {
      toast.error("No content to publish");
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    setPublishing(true);
    const results: { platform: string; success: boolean; error?: string }[] = [];

    for (const platform of selectedPlatforms) {
      try {
        const res = await fetch(`/api/platforms/${platform}/post`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: generatedContent }),
        });

        const data = await res.json();
        results.push({ platform, success: data.success, error: data.error });

        let summary = generatedContent.substring(0, 100);
        try {
          const summaryRes = await fetch("/api/ai/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: generatedContent, platform }),
          });
          if (summaryRes.ok) {
            const summaryData = await summaryRes.json();
            summary = summaryData.summary;
          }
        } catch {
          // Fall back to truncated content
        }

        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform,
            abbreviatedContent: summary,
            fullContent: generatedContent,
            postedAt: new Date().toISOString(),
            status: data.success ? "published" : "failed",
          }),
        });
      } catch (error) {
        results.push({
          platform,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    if (successCount > 0) {
      toast.success(`Published to ${successCount} platform(s)`);
    }
    if (failCount > 0) {
      const failedPlatforms = results
        .filter((r) => !r.success)
        .map((r) => `${r.platform}: ${r.error}`)
        .join(", ");
      toast.error(`Failed on ${failCount} platform(s): ${failedPlatforms}`);
    }

    if (successCount === selectedPlatforms.length) {
      setPrompt("");
      setGeneratedContent("");
      setSelectedPlatforms([]);
    }

    setPublishing(false);
  };

  const handleMarkAsPosted = async () => {
    if (!generatedContent.trim()) {
      toast.error("No content to save");
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    setSavingManual(true);
    try {
      for (const platform of selectedPlatforms) {
        let summary = generatedContent.substring(0, 100);
        try {
          const summaryRes = await fetch("/api/ai/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: generatedContent, platform }),
          });
          if (summaryRes.ok) {
            const summaryData = await summaryRes.json();
            summary = summaryData.summary;
          }
        } catch {
          // Fall back to truncated content
        }

        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform,
            abbreviatedContent: summary,
            fullContent: generatedContent,
            postedAt: new Date().toISOString(),
            status: "published",
          }),
        });
      }

      toast.success(`Marked as posted to ${selectedPlatforms.length} platform(s)`);
      setPrompt("");
      setGeneratedContent("");
      setSelectedPlatforms([]);
    } catch (error) {
      toast.error("Failed to save post history");
    } finally {
      setSavingManual(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">What would you like to post about?</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Announce our new product launch next week..."
              rows={4}
            />
          </div>

          <PlatformConnector />

          <Button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="w-full"
          >
            {generating ? "Generating..." : "Generate Post"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Generated Content</Label>
            <Textarea
              id="content"
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              placeholder="Generated post will appear here..."
              rows={8}
            />
          </div>

          <PlatformSelector
            selected={selectedPlatforms}
            onChange={setSelectedPlatforms}
          />

          <div className="flex gap-2">
            <Button
              onClick={handlePublish}
              disabled={publishing || savingManual || !generatedContent.trim() || selectedPlatforms.length === 0}
              className="flex-1"
            >
              {publishing ? "Publishing..." : "Publish via API"}
            </Button>
            <Button
              onClick={handleMarkAsPosted}
              disabled={publishing || savingManual || !generatedContent.trim() || selectedPlatforms.length === 0}
              variant="secondary"
              className="flex-1"
            >
              {savingManual ? "Saving..." : "Posted Manually"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
