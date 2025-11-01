import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { PremiumLockedModal } from "@/components/PremiumLockedModal";
import { PostCard } from "@/components/PostCard";
import { CommentModal } from "@/components/CommentModal";
import { useAuth } from "@/contexts/AuthContext";
import { userOperations, communityOperations, type FirestoreCommunityPost } from "@/services/firestore";
import { isFirebaseReady } from "@/services/firebase";

export default function Community() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<FirestoreCommunityPost[]>([]);
  const [cheeredPosts, setCheeredPosts] = useState<Set<string>>(new Set());
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedPostText, setSelectedPostText] = useState("");

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!isFirebaseReady() || !user) {
        setIsPremium(false);
        setShowPremiumModal(true);
        setIsLoading(false);
        return;
      }

      try {
        // TEMPORARY: Premium gating disabled for testing
        setIsPremium(true);
        
        /* PRODUCTION CODE - Uncomment to re-enable premium gating
        const firestoreUser = await userOperations.getUser(user.uid);
        const premium = firestoreUser?.premium === true;
        setIsPremium(premium);
        
        if (!premium) {
          setShowPremiumModal(true);
        }
        */
      } catch (error) {
        console.error("Error checking premium status:", error);
        setIsPremium(false);
        setShowPremiumModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user]);

  // Subscribe to realtime posts updates
  useEffect(() => {
    if (!isPremium || !isFirebaseReady()) return;

    const unsubscribe = communityOperations.subscribeToPosts(10, (updatedPosts) => {
      setPosts(updatedPosts);
    });

    return () => unsubscribe();
  }, [isPremium]);

  const handleCheer = async (postId: string) => {
    try {
      await communityOperations.cheerPost(postId);
      setCheeredPosts(prev => new Set(prev).add(postId));
    } catch (error) {
      console.error("Error cheering post:", error);
    }
  };

  const handleComment = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPostId(postId);
      setSelectedPostText(post.text);
    }
  };

  const handleCloseComments = () => {
    setSelectedPostId(null);
    setSelectedPostText("");
  };

  const handleModalClose = () => {
    setShowPremiumModal(false);
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isPremium) {
    return (
      <>
        <PremiumLockedModal
          open={showPremiumModal}
          onOpenChange={handleModalClose}
          title="Premium Feature"
          description="The Fit with LaMaria Community is part of our Premium plan. Unlock now to join others staying fit and sharp together!"
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-h1 font-bold text-foreground" data-testid="text-community-title">
              Community Feed
            </h1>
          </div>
          <p className="text-body-lg text-muted-foreground">
            Stay motivated with your community
          </p>
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Sparkles className="w-16 h-16 text-primary/40 mx-auto mb-4" aria-hidden="true" />
              <h2 className="text-h3 font-bold text-foreground mb-2">
                No posts yet
              </h2>
              <p className="text-body-lg text-muted-foreground max-w-md mx-auto">
                Complete a workout or puzzle to be the first to share your progress with the community!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onCheer={handleCheer}
                onComment={handleComment}
                cheeredPosts={cheeredPosts}
              />
            ))
          )}
        </div>
      </div>

      <CommentModal
        postId={selectedPostId}
        postText={selectedPostText}
        isOpen={selectedPostId !== null}
        onClose={handleCloseComments}
      />

      <BottomNav />
    </div>
  );
}
