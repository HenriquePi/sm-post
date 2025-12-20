"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, MessageCircle, Share2, Send } from "lucide-react";

interface PlatformPreviewCardProps {
  platform: "facebook" | "linkedin";
  content: string;
}

export function PlatformPreviewCard({ platform, content }: PlatformPreviewCardProps) {
  if (platform === "facebook") {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-600 text-white">FB</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-sm">Your Business Page</div>
              <div className="text-xs text-muted-foreground">Just now · 🌐</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm whitespace-pre-wrap">{content || "Your post preview will appear here..."}</div>
          
          <div className="border-t pt-2 flex items-center justify-around text-muted-foreground">
            <button className="flex items-center gap-2 hover:bg-accent px-4 py-2 rounded-md transition-colors">
              <ThumbsUp className="h-4 w-4" />
              <span className="text-sm font-medium">Like</span>
            </button>
            <button className="flex items-center gap-2 hover:bg-accent px-4 py-2 rounded-md transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Comment</span>
            </button>
            <button className="flex items-center gap-2 hover:bg-accent px-4 py-2 rounded-md transition-colors">
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-blue-700 text-white">LI</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sm">Your Professional Profile</div>
            <div className="text-xs text-muted-foreground">Just now · Edited</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm whitespace-pre-wrap leading-relaxed">{content || "Your post preview will appear here..."}</div>
        
        <div className="border-t pt-3 space-y-2">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>0 reactions</span>
            <span>0 comments</span>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <button className="flex items-center gap-2 hover:bg-accent px-4 py-2 rounded-md transition-colors flex-1 justify-center">
              <ThumbsUp className="h-4 w-4" />
              <span className="text-sm font-medium">Like</span>
            </button>
            <button className="flex items-center gap-2 hover:bg-accent px-4 py-2 rounded-md transition-colors flex-1 justify-center">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Comment</span>
            </button>
            <button className="flex items-center gap-2 hover:bg-accent px-4 py-2 rounded-md transition-colors flex-1 justify-center">
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">Repost</span>
            </button>
            <button className="flex items-center gap-2 hover:bg-accent px-4 py-2 rounded-md transition-colors flex-1 justify-center">
              <Send className="h-4 w-4" />
              <span className="text-sm font-medium">Send</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
