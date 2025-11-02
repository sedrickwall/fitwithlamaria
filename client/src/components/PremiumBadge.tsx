import { Crown } from "lucide-react";

interface PremiumBadgeProps {
  className?: string;
}

/**
 * Premium badge indicator showing unlimited puzzle access
 * Displayed on Puzzle and WordSearch pages for premium users
 */
export function PremiumBadge({ className = "" }: PremiumBadgeProps) {
  return (
    <div 
      className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-full text-sm font-semibold shadow-lg ${className}`}
      data-testid="badge-premium"
    >
      <Crown className="w-5 h-5" />
      <span>Premium: Unlimited Puzzles</span>
    </div>
  );
}
