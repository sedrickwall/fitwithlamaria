import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status: "complete" | "locked" | "unlocked" | "pending";
  testId: string;
  onClick?: () => void;
}

export function StatusCard({ icon: Icon, title, description, status, testId, onClick }: StatusCardProps) {
  const statusColors = {
    complete: "bg-card border-success",
    unlocked: "bg-card border-primary",
    locked: "bg-muted border-border",
    pending: "bg-card border-border",
  };

  const iconColors = {
    complete: "text-success",
    unlocked: "text-primary",
    locked: "text-muted-foreground",
    pending: "text-muted-foreground",
  };

  return (
    <div
      className={`p-8 rounded-lg border-2 ${statusColors[status]} shadow-md transition-all hover:shadow-lg ${onClick ? 'cursor-pointer' : ''}`}
      data-testid={testId}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="flex items-start gap-6">
        <div 
          className={`w-16 h-16 flex items-center justify-center rounded-full ${
            status === "complete" ? "bg-card border-2 border-success" : 
            status === "unlocked" ? "bg-card border-2 border-primary" : 
            "bg-muted"
          }`}
        >
          <Icon className={`w-8 h-8 ${iconColors[status]}`} aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="text-h3 font-semibold text-card-foreground mb-2">
            {title}
          </h3>
          <p className="text-body-md text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
