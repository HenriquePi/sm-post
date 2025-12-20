"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformSelector } from "./platform-selector";
import { PlatformConnector } from "./platform-connector";
import { PlatformPreviewCard } from "./platform-preview-card";
import { toast } from "sonner";

export function PostCreator() {
  const [prompt, setPrompt] = useState("");
  const [linkedinContent, setLinkedinContent] = useState("");
  const [facebookContent, setFacebookContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [savingManual, setSavingManual] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    setGenerating(true);
    try {
      for (const platform of selectedPlatforms) {
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: prompt.trim(),
            platforms: [platform],
            includeContext: true,
            includeHistory: true,
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to generate post");
        }

        const data = await res.json();
        if (platform === "linkedin") {
          setLinkedinContent(data.content);
        } else if (platform === "facebook") {
          setFacebookContent(data.content);
        }
      }
      toast.success("Post generated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate post");
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    const hasContent = selectedPlatforms.some(platform => {
      if (platform === "linkedin" && linkedinContent.trim()) return true;
      if (platform === "facebook" && facebookContent.trim()) return true;
      return false;
    });

    if (!hasContent) {
      toast.error("No content to publish");
      return;
    }

    setPublishing(true);
    const results: { platform: string; success: boolean; error?: string }[] = [];

    for (const platform of selectedPlatforms) {
      const content = platform === "linkedin" ? linkedinContent : facebookContent;
      
      if (!content.trim()) {
        results.push({
          platform,
          success: false,
          error: "No content for this platform",
        });
        continue;
      }

      try {
        const res = await fetch(`/api/platforms/${platform}/post`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        const data = await res.json();
        results.push({ platform, success: data.success, error: data.error });

        let summary = content.substring(0, 100);
        try {
          const summaryRes = await fetch("/api/ai/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, platform }),
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
            fullContent: content,
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
      setLinkedinContent("");
      setFacebookContent("");
      setSelectedPlatforms([]);
    }

    setPublishing(false);
  };

  const handleMarkAsPosted = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    const hasContent = selectedPlatforms.some(platform => {
      if (platform === "linkedin" && linkedinContent.trim()) return true;
      if (platform === "facebook" && facebookContent.trim()) return true;
      return false;
    });

    if (!hasContent) {
      toast.error("No content to save");
      return;
    }

    setSavingManual(true);
    try {
      for (const platform of selectedPlatforms) {
        const content = platform === "linkedin" ? linkedinContent : facebookContent;
        
        if (!content.trim()) {
          continue;
        }

        let summary = content.substring(0, 100);
        try {
          const summaryRes = await fetch("/api/ai/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, platform }),
          });
          if (summaryRes.ok) {
            const summaryData = await summaryRes.json();
            summary = summaryData.summary;
          }
        } catch {
          // Fall back to truncated content
        }

        const historyRes = await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform,
            abbreviatedContent: summary,
            fullContent: content,
            postedAt: new Date().toISOString(),
            status: "published",
          }),
        });

        if (!historyRes.ok) {
          const errorData = await historyRes.json();
          throw new Error(errorData.error || "Failed to save to history");
        }
      }

      toast.success(`Marked as posted to ${selectedPlatforms.length} platform(s)`);
      setPrompt("");
      setLinkedinContent("");
      setFacebookContent("");
      setSelectedPlatforms([]);
    } catch (error) {
      console.error("Error marking as posted:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save post history");
    } finally {
      setSavingManual(false);
    }
  };

  const hasAnyContent = linkedinContent.trim() || facebookContent.trim();

  return (
    <div className="space-y-6">
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

          <PlatformSelector
            selected={selectedPlatforms}
            onChange={setSelectedPlatforms}
          />

          <Button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim() || selectedPlatforms.length === 0}
            className="w-full"
          >
            {generating ? "Generating..." : "Generate Post"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedPlatforms.includes("linkedin") && (
            <div className="space-y-2">
              <Label htmlFor="linkedin-content">LinkedIn Content</Label>
              <Textarea
                id="linkedin-content"
                value={linkedinContent}
                onChange={(e) => setLinkedinContent(e.target.value)}
                placeholder="LinkedIn post will appear here..."
                rows={8}
              />
            </div>
          )}

          {selectedPlatforms.includes("facebook") && (
            <div className="space-y-2">
              <Label htmlFor="facebook-content">Facebook Content</Label>
              <Textarea
                id="facebook-content"
                value={facebookContent}
                onChange={(e) => setFacebookContent(e.target.value)}
                placeholder="Facebook post will appear here..."
                rows={8}
              />
            </div>
          )}

          {selectedPlatforms.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              Select platforms and generate content to see it here
            </div>
          )}

          {selectedPlatforms.length > 0 && (
            <div className="flex gap-2">
              <Button
                onClick={handlePublish}
                disabled={publishing || savingManual || !hasAnyContent || selectedPlatforms.length === 0}
                className="flex-1"
              >
                {publishing ? "Publishing..." : "Publish via API"}
              </Button>
              <Button
                onClick={handleMarkAsPosted}
                disabled={publishing || savingManual || !hasAnyContent || selectedPlatforms.length === 0}
                variant="secondary"
                className="flex-1"
              >
                {savingManual ? "Saving..." : "Posted Manually"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {hasAnyContent && selectedPlatforms.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Platform Previews</h3>
          <div className="grid gap-6 lg:grid-cols-2">
            {selectedPlatforms.includes("facebook") && facebookContent && (
              <div className="space-y-2">
                <Label className="text-base">Facebook Preview</Label>
                <PlatformPreviewCard platform="facebook" content={facebookContent} />
              </div>
            )}
            {selectedPlatforms.includes("linkedin") && linkedinContent && (
              <div className="space-y-2">
                <Label className="text-base">LinkedIn Preview</Label>
                <PlatformPreviewCard platform="linkedin" content={linkedinContent} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
