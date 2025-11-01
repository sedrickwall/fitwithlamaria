import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatTimeAgo } from "@/lib/timeAgo";
import type { FirestoreCommunityPost } from "@/services/firestore";

interface PostCardProps {
  post: FirestoreCommunityPost;
  onCheer: (postId: string) => void;
  onComment: (postId: string) => void;
  cheeredPosts: Set<string>;
}

export function PostCard({ post, onCheer, onComment, cheeredPosts }: PostCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const hasCheeredThisPost = cheeredPosts.has(post.id);

  const handleCheer = () => {
    if (hasCheeredThisPost) return; // Prevent multiple cheers
    
    onCheer(post.id);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <Card className="p-6 bg-card border-2 border-border hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-body-lg text-foreground leading-relaxed">
            {post.text}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-body-sm text-muted-foreground" data-testid={`time-ago-${post.id}`}>
          {formatTimeAgo(post.createdAt)}
        </span>

        <div className="flex items-center gap-4">
          <button
            onClick={handleCheer}
            disabled={hasCheeredThisPost}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-body-md font-medium focus:outline-none focus:ring-4 focus:ring-ring ${
              hasCheeredThisPost
                ? "bg-accent/20 text-accent cursor-not-allowed"
                : "bg-muted hover:bg-accent/10 hover:text-accent text-muted-foreground"
            }`}
            data-testid={`button-cheer-${post.id}`}
            aria-label={`Cheer on this post. ${post.cheersCount} cheers`}
          >
            <Heart
              className={`w-5 h-5 ${hasCheeredThisPost ? "fill-accent" : ""} ${
                isAnimating ? "animate-bounce" : ""
              }`}
              aria-hidden="true"
            />
            <span>{post.cheersCount}</span>
          </button>

          <button
            onClick={() => onComment(post.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all text-body-md font-medium focus:outline-none focus:ring-4 focus:ring-ring"
            data-testid={`button-comment-${post.id}`}
            aria-label="Comment on this post"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            <span>Comment</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
