import { useState } from "react";
import { Facebook, Share2, Copy, Check, Twitter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SocialShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement: string;
  shareText: string;
}

export function SocialShareModal({ 
  open, 
  onOpenChange, 
  achievement,
  shareText 
}: SocialShareModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Construct share URL (use current domain in production)
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  
  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    window.open(facebookUrl, 'facebook-share', 'width=600,height=400');
    
    toast({
      title: "Opening Facebook",
      description: "Share your achievement with friends!",
    });
  };

  const handleShareX = () => {
    const hashtags = 'FitWithLaMaria,SeniorFitness,BrainHealth';
    const xUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${hashtags}`;
    window.open(xUrl, 'x-share', 'width=600,height=400');
    
    toast({
      title: "Opening X",
      description: "Share your achievement on X!",
    });
  };

  const handleCopyLink = async () => {
    const copyText = `${shareText}\n\nJoin me at ${shareUrl}`;
    
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      
      toast({
        title: "Copied to clipboard!",
        description: "Now you can paste this in Instagram or any other app",
      });

      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  // Native share API for mobile devices
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Fit with LaMaria',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled share
        console.log('Share cancelled');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-h3 text-center">
            🎉 Share Your Achievement!
          </DialogTitle>
          <DialogDescription className="text-body-md text-center pt-2">
            {achievement}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-4">
          <Button
            onClick={handleShareFacebook}
            size="lg"
            variant="outline"
            className="w-full h-14 text-body-md font-semibold gap-3 bg-[#1877f2] hover:bg-[#1877f2]/90 text-white border-0"
            data-testid="button-share-facebook"
          >
            <Facebook className="w-5 h-5" />
            Share on Facebook
          </Button>

          <Button
            onClick={handleShareX}
            size="lg"
            variant="outline"
            className="w-full h-14 text-body-md font-semibold gap-3 bg-black hover:bg-black/90 text-white border-0"
            data-testid="button-share-x"
          >
            <Twitter className="w-5 h-5" />
            Share on X
          </Button>

          <Button
            onClick={handleCopyLink}
            size="lg"
            variant="outline"
            className="w-full h-14 text-body-md font-semibold gap-3"
            data-testid="button-copy-link"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy for Instagram
              </>
            )}
          </Button>

          {typeof navigator !== 'undefined' && typeof navigator.share !== 'undefined' && (
            <Button
              onClick={handleNativeShare}
              size="lg"
              variant="outline"
              className="w-full h-14 text-body-md font-semibold gap-3"
              data-testid="button-native-share"
            >
              <Share2 className="w-5 h-5" />
              Share via...
            </Button>
          )}
        </div>

        <p className="text-body-sm text-muted-foreground text-center pt-4">
          Inspire others to join you on your fitness journey!
        </p>
      </DialogContent>
    </Dialog>
  );
}
