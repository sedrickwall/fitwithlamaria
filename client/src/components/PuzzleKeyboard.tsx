import { Delete } from "lucide-react";

interface PuzzleKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  letterStatus: Record<string, "correct" | "present" | "absent" | "unused">;
  disabled?: boolean;
}

export function PuzzleKeyboard({ onKeyPress, onDelete, onEnter, letterStatus, disabled }: PuzzleKeyboardProps) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const getKeyStyles = (letter: string) => {
    const status = letterStatus[letter] || "unused";
    const statusStyles = {
      correct: "bg-success text-success-foreground border-success",
      present: "bg-warning text-warning-foreground border-warning",
      absent: "bg-muted text-muted-foreground border-muted",
      unused: "bg-secondary text-secondary-foreground border-border hover:bg-secondary/80",
    };
    return statusStyles[status];
  };

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 w-full max-w-2xl mx-auto" data-testid="puzzle-keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 sm:gap-2 justify-center">
          {rowIndex === 2 && (
            <button
              onClick={onEnter}
              disabled={disabled}
              data-testid="key-enter"
              className="min-w-[60px] sm:min-w-[80px] h-11 sm:h-14 px-2 sm:px-4 rounded-md sm:rounded-lg border-2 bg-primary text-primary-foreground border-primary font-semibold text-xs sm:text-body-md disabled:opacity-50 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-ring transition-all active:scale-95"
              aria-label="Enter"
            >
              ENTER
            </button>
          )}
          {row.map((letter) => (
            <button
              key={letter}
              onClick={() => onKeyPress(letter)}
              disabled={disabled}
              data-testid={`key-${letter.toLowerCase()}`}
              className={`
                min-w-[32px] sm:min-w-[44px] h-11 sm:h-14 px-2 sm:px-3 rounded-md sm:rounded-lg border-2
                font-semibold text-xl sm:text-[28px]
                disabled:opacity-50
                focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-ring
                transition-all active:scale-95
                ${getKeyStyles(letter)}
              `}
              aria-label={`Letter ${letter}`}
            >
              {letter}
            </button>
          ))}
          {rowIndex === 2 && (
            <button
              onClick={onDelete}
              disabled={disabled}
              data-testid="key-delete"
              className="min-w-[60px] sm:min-w-[80px] h-11 sm:h-14 px-2 sm:px-4 rounded-md sm:rounded-lg border-2 bg-secondary text-secondary-foreground border-border hover:bg-secondary/80 font-semibold text-xs sm:text-body-md disabled:opacity-50 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-ring transition-all active:scale-95 flex items-center justify-center gap-1 sm:gap-2"
              aria-label="Delete"
            >
              <Delete className="w-4 h-4 sm:w-6 sm:h-6" aria-hidden="true" />
              <span className="hidden xs:inline">DEL</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
