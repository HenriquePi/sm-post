"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlatformSelectorProps {
  selected: string[];
  onChange: (platforms: string[]) => void;
}

const platforms = [
  { id: "linkedin", name: "LinkedIn" },
  { id: "facebook", name: "Facebook" },
];

export function PlatformSelector({ selected, onChange }: PlatformSelectorProps) {
  const togglePlatform = (platformId: string) => {
    if (selected.includes(platformId)) {
      onChange(selected.filter((p) => p !== platformId));
    } else {
      onChange([...selected, platformId]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Post to Platforms</label>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => {
          const isSelected = selected.includes(platform.id);

          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => togglePlatform(platform.id)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-accent border-input"
              )}
            >
              {platform.name}
              {isSelected && <Badge variant="secondary" className="text-xs">✓</Badge>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
