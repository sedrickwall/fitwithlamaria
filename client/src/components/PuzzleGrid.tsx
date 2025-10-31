interface PuzzleGridProps {
  guesses: string[];
  currentGuess: string;
  currentRow: number;
  evaluation: Array<Array<"correct" | "present" | "absent" | "empty">>;
  wordLength: number;
  maxAttempts: number;
}

export function PuzzleGrid({ guesses, currentGuess, currentRow, evaluation, wordLength, maxAttempts }: PuzzleGridProps) {
  const rows = Array.from({ length: maxAttempts }, (_, i) => {
    if (i < guesses.length) {
      return guesses[i].padEnd(wordLength, " ");
    } else if (i === currentRow) {
      return currentGuess.padEnd(wordLength, " ");
    }
    return " ".repeat(wordLength);
  });

  const getBoxStyles = (rowIndex: number, colIndex: number) => {
    const letter = rows[rowIndex][colIndex];
    const hasLetter = letter !== " ";
    
    if (rowIndex < guesses.length && evaluation[rowIndex]) {
      const status = evaluation[rowIndex][colIndex];
      const statusStyles = {
        correct: "bg-success border-success text-success-foreground",
        present: "bg-warning border-warning text-warning-foreground",
        absent: "bg-muted border-muted-foreground/20 text-muted-foreground",
        empty: "border-border",
      };
      return statusStyles[status];
    }
    
    if (rowIndex === currentRow && hasLetter) {
      return "border-foreground border-[3px]";
    }
    
    return "border-border";
  };

  return (
    <div className="flex flex-col gap-2" data-testid="puzzle-grid">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 justify-center">
          {Array.from({ length: wordLength }).map((_, colIndex) => {
            const letter = row[colIndex];
            return (
              <div
                key={colIndex}
                className={`
                  w-16 h-16 md:w-18 md:h-18 
                  flex items-center justify-center 
                  border-[3px] rounded-lg
                  font-mono font-bold text-[40px] uppercase
                  transition-all duration-300
                  ${getBoxStyles(rowIndex, colIndex)}
                `}
                data-testid={`puzzle-cell-${rowIndex}-${colIndex}`}
                aria-label={letter !== " " ? `Letter ${letter}` : "Empty"}
              >
                {letter !== " " && letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
