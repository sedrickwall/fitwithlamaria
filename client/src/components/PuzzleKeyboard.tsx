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
    <div className="flex flex-col gap-2 sm:gap-3 w-full max-w-2xl mx-auto" data-testid="puzzle-keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 sm:gap-2 justify-center">
          {rowIndex === 2 && (
            <button
              onClick={onEnter}
              disabled={disabled}
              data-testid="key-enter"
              className="min-w-[70px] sm:min-w-[90px] h-14 sm:h-16 px-3 sm:px-4 rounded-lg border-2 bg-primary text-primary-foreground border-primary font-bold text-sm sm:text-base disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-ring transition-all active:scale-95 shadow-md"
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
                min-w-[38px] sm:min-w-[48px] h-14 sm:h-16 px-2 sm:px-3 rounded-lg border-2
                font-bold text-2xl sm:text-3xl
                disabled:opacity-50
                focus:outline-none focus:ring-4 focus:ring-ring
                transition-all active:scale-95 shadow-md
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
              className="min-w-[70px] sm:min-w-[90px] h-14 sm:h-16 px-3 sm:px-4 rounded-lg border-2 bg-secondary text-secondary-foreground border-border hover:bg-secondary/80 font-bold text-sm sm:text-base disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-ring transition-all active:scale-95 shadow-md flex items-center justify-center gap-1.5 sm:gap-2"
              aria-label="Delete"
            >
              <Delete className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
              <span className="hidden xs:inline">DEL</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
