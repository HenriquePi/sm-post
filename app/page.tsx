import { PostCreator } from "@/components/post-creator";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Post</h1>
        <p className="text-muted-foreground">
          Generate AI-powered social media posts with context awareness
        </p>
      </div>
      <PostCreator />
    </div>
  );
}
