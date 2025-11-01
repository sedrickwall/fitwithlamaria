import { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatTimeAgo } from "@/lib/timeAgo";
import { communityOperations, type FirestoreCommunityComment } from "@/services/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CommentModalProps {
  postId: string | null;
  postText: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentModal({ postId, postText, isOpen, onClose }: CommentModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<FirestoreCommunityComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const unsubscribe = communityOperations.subscribeToComments(postId, (updatedComments) => {
      setComments(updatedComments);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !postId || !user) return;
    
    if (newComment.length > 100) {
      toast({
        title: "Comment too long",
        description: "Please keep comments under 100 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await communityOperations.addComment(postId, {
        userId: user.uid,
        userName: user.displayName || "Member",
        text: newComment.trim(),
      });
      
      setNewComment("");
      
      toast({
        title: "Comment posted!",
        description: "Your encouragement has been shared.",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Failed to post comment",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-h3 font-bold pr-8">Comments</DialogTitle>
          <p className="text-body-md text-muted-foreground mt-2 italic">
            "{postText}"
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-body-lg text-muted-foreground">
                No comments yet. Be the first to encourage this member!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-muted/50 rounded-lg"
                data-testid={`comment-${comment.id}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-body-md text-foreground">
                    {comment.userName}
                  </p>
                  <span className="text-body-sm text-muted-foreground">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-body-md text-foreground">{comment.text}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-border pt-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write an encouraging message..."
              maxLength={100}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-border focus:border-primary focus:outline-none text-body-md"
              data-testid="input-comment"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-ring"
              data-testid="button-send-comment"
              aria-label="Send comment"
            >
              <Send className="w-5 h-5" aria-hidden="true" />
              <span>Send</span>
            </button>
          </div>
          <p className="text-body-sm text-muted-foreground mt-2">
            {newComment.length}/100 characters
          </p>
        </form>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-4 focus:ring-ring"
          data-testid="button-close-modal"
          aria-label="Close comments"
        >
          <X className="w-6 h-6" aria-hidden="true" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
