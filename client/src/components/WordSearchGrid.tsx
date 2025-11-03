import { useState } from "react";

interface WordSearchGridProps {
  grid: string[][];
  words: string[];
  foundWords: string[];
  onWordFound: (word: string, coordinates: number[][]) => void;
  disabled?: boolean;
}

export function WordSearchGrid({ grid, words, foundWords, onWordFound, disabled }: WordSearchGridProps) {
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const gridSize = grid.length;

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(([r, c]) => r === row && c === col);
  };

  const handleMouseDown = (row: number, col: number) => {
    if (disabled) return;
    setIsSelecting(true);
    setSelectedCells([[row, col]]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || disabled) return;
    
    const lastCell = selectedCells[selectedCells.length - 1];
    if (!lastCell) return;

    const isInLine = 
      row === lastCell[0] || // same row
      col === lastCell[1] || // same column
      Math.abs(row - lastCell[0]) === Math.abs(col - lastCell[1]); // diagonal

    if (isInLine && !isCellSelected(row, col)) {
      setSelectedCells([...selectedCells, [row, col]]);
    }
  };

  const handleMouseUp = () => {
    if (!isSelecting || disabled) return;
    setIsSelecting(false);

    if (selectedCells.length >= 3) {
      const selectedWord = selectedCells.map(([r, c]) => grid[r][c]).join("");
      const selectedWordReverse = selectedWord.split("").reverse().join("");

      const matchingWord = words.find(
        word => (word === selectedWord || word === selectedWordReverse) && !foundWords.includes(word)
      );

      if (matchingWord) {
        onWordFound(matchingWord, selectedCells);
      }
    }

    setSelectedCells([]);
  };

  const isCellInFoundWord = (row: number, col: number) => {
    return false;
  };

  return (
    <div 
      className="inline-block select-none w-full" 
      onMouseLeave={() => {
        setIsSelecting(false);
        setSelectedCells([]);
      }}
      data-testid="word-search-grid"
    >
      <div className="grid gap-0.5 sm:gap-1">
        {grid.map((rowData, rowIndex) => (
          <div key={rowIndex} className="flex gap-0.5 sm:gap-1">
            {rowData.map((letter, colIndex) => {
              const isSelected = isCellSelected(rowIndex, colIndex);
              const isFound = isCellInFoundWord(rowIndex, colIndex);

              return (
                <div
                  key={colIndex}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  onMouseUp={handleMouseUp}
                  className={`
                    w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12
                    flex items-center justify-center
                    font-mono font-bold text-sm sm:text-xl md:text-2xl uppercase
                    border sm:border-2 rounded sm:rounded-lg cursor-pointer
                    transition-all duration-150
                    ${isSelected ? "bg-primary text-primary-foreground border-primary scale-105" : ""}
                    ${isFound ? "bg-success/30 text-success border-success" : ""}
                    ${!isSelected && !isFound ? "bg-secondary/20 border-border hover:bg-secondary/40" : ""}
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  data-testid={`word-search-cell-${rowIndex}-${colIndex}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-4 sm:mt-6">
        <h3 className="text-base sm:text-h4 font-semibold text-foreground mb-2 sm:mb-3">
          Find these words:
        </h3>
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          {words.map((word) => {
            const isFound = foundWords.includes(word);
            return (
              <div
                key={word}
                className={`
                  text-sm sm:text-body-md font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg
                  ${isFound ? "bg-success/20 text-success line-through" : "bg-muted text-foreground"}
                `}
                data-testid={`word-${word.toLowerCase()}`}
              >
                {word}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
