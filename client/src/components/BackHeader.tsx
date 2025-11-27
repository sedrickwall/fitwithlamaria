import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

interface BackHeaderProps {
  title: string;
  subtitle?: string;
  backPath?: string;
}

export function BackHeader({ title, subtitle, backPath = "/more" }: BackHeaderProps) {
  const [, navigate] = useLocation();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    if (isLeftSwipe) {
      navigate(backPath);
    }
  };

  const handleBack = () => {
    navigate(backPath);
  };

  return {
    swipeHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
    HeaderComponent: (
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 min-h-[56px] px-4 py-3 -ml-4 rounded-xl text-primary hover:bg-primary/10 active:bg-primary/20 transition-colors mb-2"
          data-testid="button-back"
          aria-label="Go back"
        >
          <ArrowLeft className="w-7 h-7" strokeWidth={2.5} />
          <span className="text-lg font-semibold">Back</span>
        </button>
        <h1 className="text-h1 font-bold text-foreground mb-2" data-testid="text-page-title">
          {title}
        </h1>
        {subtitle && (
          <p className="text-body-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    ),
  };
}
