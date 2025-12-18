"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlatformStatus {
  linkedin: boolean;
  facebook: boolean;
}

const platforms = [
  { id: "linkedin", name: "LinkedIn" },
  { id: "facebook", name: "Facebook" },
];

export function PlatformConnector() {
  const [status, setStatus] = useState<PlatformStatus>({ linkedin: false, facebook: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/platforms/status");
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch (error) {
        console.error("Failed to fetch platform status:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  const connectPlatform = (platformId: string) => {
    window.location.href = `/api/platforms/${platformId}/auth`;
  };

  const disconnectPlatform = async (platformId: string) => {
    try {
      await fetch(`/api/platforms/${platformId}/disconnect`, { method: "POST" });
      setStatus((prev) => ({ ...prev, [platformId]: false }));
    } catch (error) {
      console.error("Failed to disconnect platform:", error);
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading connections...</div>;
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Platform Connections</label>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => {
          const isConnected = status[platform.id as keyof PlatformStatus];

          return (
            <div key={platform.id} className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <Badge variant="default" className="bg-green-600">
                    {platform.name} Connected
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => disconnectPlatform(platform.id)}
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => connectPlatform(platform.id)}
                >
                  Connect {platform.name}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
