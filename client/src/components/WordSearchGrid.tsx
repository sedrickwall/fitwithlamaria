import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface WordSearchGridProps {
  grid: string[][];
  words: string[];
  foundWords: string[];
  onWordFound: (word: string, coordinates: number[][]) => void;
  disabled?: boolean;
}

export function WordSearchGrid({ grid, words, foundWords, onWordFound, disabled }: WordSearchGridProps) {
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartCell, setDragStartCell] = useState<number[] | null>(null);

  const gridSize = grid.length;

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(([r, c]) => r === row && c === col);
  };

  const handleMouseDown = (row: number, col: number) => {
    if (disabled) return;
    // Mark the start of a potential drag, but don't activate dragging yet
    setDragStartCell([row, col]);
    setSelectedCells([[row, col]]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (disabled) return;
    
    // If we have a drag start cell, activate dragging mode
    if (dragStartCell && !isDragging) {
      setIsDragging(true);
    }
    
    if (!isDragging || selectedCells.length === 0) return;
    
    const lastCell = selectedCells[selectedCells.length - 1];
    if (!lastCell) return;

    const firstCell = selectedCells[0];

    // Check if new cell is in line with the first cell
    const isInLine = 
      row === firstCell[0] || // same row
      col === firstCell[1] || // same column
      Math.abs(row - firstCell[0]) === Math.abs(col - firstCell[1]); // diagonal

    // Check if the new cell is adjacent to the last selected cell
    const isAdjacent = 
      Math.abs(row - lastCell[0]) <= 1 && 
      Math.abs(col - lastCell[1]) <= 1 &&
      !(row === lastCell[0] && col === lastCell[1]);

    if (isInLine && isAdjacent && !isCellSelected(row, col)) {
      setSelectedCells([...selectedCells, [row, col]]);
    }
  };

  const handleMouseUp = () => {
    if (disabled) return;
    
    setDragStartCell(null);
    
    if (!isDragging) return;
    
    setIsDragging(false);

    // Auto-check if we have enough letters
    if (selectedCells.length >= 3) {
      checkSelectedWord();
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (disabled) return;
    
    // If we were dragging, don't process the click - drag logic already handled it
    if (isDragging) {
      return;
    }

    // If no cells selected, start a new selection
    if (selectedCells.length === 0) {
      setSelectedCells([[row, col]]);
      return;
    }

    // If clicking the same cell as the last one, check the word
    const lastCell = selectedCells[selectedCells.length - 1];
    if (lastCell[0] === row && lastCell[1] === col) {
      if (selectedCells.length >= 3) {
        checkSelectedWord();
      }
      return;
    }

    // Check if cell is already in selection (clicking backwards)
    const existingIndex = selectedCells.findIndex(([r, c]) => r === row && c === col);
    if (existingIndex !== -1) {
      // Remove all cells after this one
      setSelectedCells(selectedCells.slice(0, existingIndex + 1));
      return;
    }

    const firstCell = selectedCells[0];

    // Check if new cell is in line with the selection
    const isInLine = 
      row === firstCell[0] || // same row
      col === firstCell[1] || // same column
      Math.abs(row - firstCell[0]) === Math.abs(col - firstCell[1]); // diagonal

    if (!isInLine) {
      // Start a new selection with this cell
      setSelectedCells([[row, col]]);
      return;
    }

    // Check if the new cell is adjacent to the last selected cell
    const isAdjacent = 
      Math.abs(row - lastCell[0]) <= 1 && 
      Math.abs(col - lastCell[1]) <= 1;

    if (isAdjacent) {
      setSelectedCells([...selectedCells, [row, col]]);
    } else {
      // Not adjacent, start new selection
      setSelectedCells([[row, col]]);
    }
  };

  const checkSelectedWord = () => {
    if (disabled || selectedCells.length < 3) return;

    const selectedWord = selectedCells.map(([r, c]) => grid[r][c]).join("");
    const selectedWordReverse = selectedWord.split("").reverse().join("");

    const matchingWord = words.find(
      word => (word === selectedWord || word === selectedWordReverse) && !foundWords.includes(word)
    );

    if (matchingWord) {
      onWordFound(matchingWord, selectedCells);
    }

    setSelectedCells([]);
  };

  const handleClearSelection = () => {
    setSelectedCells([]);
  };

  const isCellInFoundWord = (row: number, col: number) => {
    return false;
  };

  return (
    <div 
      className="inline-block select-none"
      onMouseLeave={() => {
        if (isDragging) {
          setIsDragging(false);
          if (selectedCells.length >= 3) {
            checkSelectedWord();
          } else {
            setSelectedCells([]);
          }
        }
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
                  onClick={() => handleCellClick(rowIndex, colIndex)}
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

      {/* Selection Controls */}
      {selectedCells.length > 0 && !disabled && (
        <div className="mt-3 sm:mt-4 flex gap-2 justify-center">
          <Button
            onClick={checkSelectedWord}
            disabled={selectedCells.length < 3}
            className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-body-lg font-semibold bg-gradient-to-br from-primary-start to-primary-end hover:opacity-90"
            data-testid="button-check-word"
          >
            Check Word ({selectedCells.length} letters)
          </Button>
          <Button
            onClick={handleClearSelection}
            variant="outline"
            className="h-12 sm:h-14 px-4 sm:px-6"
            data-testid="button-clear-selection"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

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
