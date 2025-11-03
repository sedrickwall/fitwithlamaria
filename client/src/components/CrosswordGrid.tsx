import { useState } from "react";

interface CrosswordClue {
  number: number;
  direction: "across" | "down";
  clue: string;
  answer: string;
  row: number;
  col: number;
}

interface CrosswordGridProps {
  size: number;
  clues: CrosswordClue[];
  answers: Record<number, string>;
  onAnswerChange: (clueNumber: number, value: string) => void;
  results: Record<number, boolean>;
  disabled?: boolean;
}

export function CrosswordGrid({ size, clues, answers, onAnswerChange, results, disabled }: CrosswordGridProps) {
  const [selectedClue, setSelectedClue] = useState<number | null>(null);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Clues Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground mb-2 sm:mb-3">Across</h3>
          <div className="space-y-1.5 sm:space-y-2">
            {clues
              .filter(c => c.direction === "across")
              .map(clue => (
                <div
                  key={clue.number}
                  className={`p-2 sm:p-3 rounded-md sm:rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedClue === clue.number
                      ? "bg-primary/10 border-primary"
                      : results[clue.number] === true
                      ? "bg-success/10 border-success"
                      : results[clue.number] === false
                      ? "bg-destructive/10 border-destructive"
                      : "bg-card border-border hover:border-muted-foreground"
                  }`}
                  onClick={() => setSelectedClue(clue.number)}
                  data-testid={`clue-${clue.number}`}
                >
                  <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">
                    {clue.number}. {clue.clue}
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground mb-2 sm:mb-3">Down</h3>
          <div className="space-y-1.5 sm:space-y-2">
            {clues
              .filter(c => c.direction === "down")
              .map(clue => (
                <div
                  key={clue.number}
                  className={`p-2 sm:p-3 rounded-md sm:rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedClue === clue.number
                      ? "bg-primary/10 border-primary"
                      : results[clue.number] === true
                      ? "bg-success/10 border-success"
                      : results[clue.number] === false
                      ? "bg-destructive/10 border-destructive"
                      : "bg-card border-border hover:border-muted-foreground"
                  }`}
                  onClick={() => setSelectedClue(clue.number)}
                  data-testid={`clue-${clue.number}`}
                >
                  <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">
                    {clue.number}. {clue.clue}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Answer Input Section */}
      {selectedClue !== null && (
        <div className="p-3 sm:p-4 bg-secondary/10 border-2 border-secondary rounded-lg">
          <div className="space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-secondary">
              ANSWER FOR CLUE #{selectedClue}
            </p>
            <input
              type="text"
              value={answers[selectedClue] || ""}
              onChange={(e) => onAnswerChange(selectedClue, e.target.value.toUpperCase())}
              disabled={disabled}
              placeholder="Type your answer..."
              className="w-full h-12 sm:h-14 px-3 sm:px-4 text-lg sm:text-xl font-mono font-bold uppercase border-2 border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              maxLength={15}
              data-testid={`input-answer-${selectedClue}`}
            />
            {results[selectedClue] === true && (
              <p className="text-xs sm:text-sm font-semibold text-success">✓ Correct!</p>
            )}
            {results[selectedClue] === false && (
              <p className="text-xs sm:text-sm font-semibold text-destructive">✗ Not quite - try again!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
