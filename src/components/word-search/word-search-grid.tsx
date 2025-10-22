'use client';

import { useState, useEffect, useRef } from 'react';
import { GenerateWordSearchOutput } from '@/ai/flows/generate-word-search';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, RefreshCw } from 'lucide-react';

interface WordSearchGridProps {
  puzzle: GenerateWordSearchOutput;
  onGameWon: () => void;
  onPlayAgain: () => void;
}

type Cell = { row: number; col: number };

export function WordSearchGrid({ puzzle, onGameWon, onPlayAgain }: WordSearchGridProps) {
  const { grid, words } = puzzle;
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selection, setSelection] = useState<Cell[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (foundWords.length > 0 && foundWords.length === words.length) {
      onGameWon();
    }
  }, [foundWords, words, onGameWon]);
  
  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const handleInteractionStart = (row: number, col: number) => {
    setIsMouseDown(true);
    setSelection([{ row, col }]);
  };

  const handleInteractionMove = (row: number, col: number) => {
    if (!isMouseDown || selection.length === 0) return;

    const startCell = selection[0];
    const endCell = { row, col };
    
    // Check for straight line (horizontal, vertical, or diagonal)
    const dx = Math.abs(endCell.col - startCell.col);
    const dy = Math.abs(endCell.row - startCell.row);

    if (dx === 0 || dy === 0 || dx === dy) {
      const newSelection: Cell[] = [];
      const steps = Math.max(dx, dy);
      for (let i = 0; i <= steps; i++) {
        const currentCol = startCell.col + (endCell.col - startCell.col) * i / (steps || 1);
        const currentRow = startCell.row + (endCell.row - startCell.row) * i / (steps || 1);
        newSelection.push({ row: Math.round(currentRow), col: Math.round(currentCol) });
      }
      setSelection(newSelection);
    }
  };

  const handleInteractionEnd = () => {
    if (!isMouseDown) return;
    setIsMouseDown(false);
    
    if (selection.length > 1) {
      let selectedWord = '';
      selection.forEach(cell => {
        selectedWord += grid[cell.row][cell.col];
      });

      const selectedWordReversed = selectedWord.split('').reverse().join('');

      const wordToFind = words.find(w => w === selectedWord || w === selectedWordReversed);

      if (wordToFind && !foundWords.includes(wordToFind)) {
        setFoundWords(prev => [...prev, wordToFind]);
        const newFoundCells = new Set(foundCells);
        selection.forEach(cell => newFoundCells.add(getCellKey(cell.row, cell.col)));
        setFoundCells(newFoundCells);
      }
    }
    
    setSelection([]);
  };
  
  const isSelected = (row: number, col: number) => {
      return selection.some(cell => cell.row === row && cell.col === col);
  };
  
  const isFound = (row: number, col: number) => {
      return foundCells.has(getCellKey(row,col));
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center items-start" onMouseUp={handleInteractionEnd} onMouseLeave={handleInteractionEnd}>
        <Card className="w-full md:w-auto shadow-xl">
            <CardHeader>
                <CardTitle>Sopa de Letras</CardTitle>
                <CardDescription>Haz clic y arrastra para seleccionar palabras.</CardDescription>
            </CardHeader>
            <CardContent>
                <div 
                    ref={gridRef}
                    className="grid bg-card border rounded-lg p-2 select-none shadow-inner" 
                    style={{ 
                        gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
                        touchAction: 'none' // Prevent scrolling on touch devices
                    }}
                    onMouseDown={() => false} // Prevent text selection on grid
                >
                {grid.map((row, rowIndex) =>
                    row.map((letter, colIndex) => (
                    <div
                        key={getCellKey(rowIndex, colIndex)}
                        onMouseDown={() => handleInteractionStart(rowIndex, colIndex)}
                        onMouseEnter={() => handleInteractionMove(rowIndex, colIndex)}
                        onTouchStart={(e) => {
                            const touch = e.touches[0];
                            const element = document.elementFromPoint(touch.clientX, touch.clientY);
                            const r = element?.getAttribute('data-row');
                            const c = element?.getAttribute('data-col');
                            if(r && c) handleInteractionStart(parseInt(r), parseInt(c));
                        }}
                        onTouchMove={(e) => {
                            const touch = e.touches[0];
                            const element = document.elementFromPoint(touch.clientX, touch.clientY);
                            const r = element?.getAttribute('data-row');
                            const c = element?.getAttribute('data-col');
                            if(r && c) handleInteractionMove(parseInt(r), parseInt(c));
                        }}
                        onTouchEnd={handleInteractionEnd}
                        data-row={rowIndex}
                        data-col={colIndex}
                        className={cn(
                        "flex items-center justify-center aspect-square text-lg md:text-xl font-bold font-code cursor-pointer transition-all duration-150 ease-in-out",
                        isFound(rowIndex, colIndex) ? 'bg-primary/80 text-primary-foreground rounded-full scale-105 shadow-md' : 
                        isSelected(rowIndex, colIndex) ? 'bg-accent text-accent-foreground rounded-md scale-110' :
                        'text-foreground hover:bg-muted'
                        )}
                    >
                        {letter}
                    </div>
                    ))
                )}
                </div>
            </CardContent>
        </Card>
        
        <div className="w-full md:w-64">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><ListChecks className="mr-2 h-6 w-6 text-accent"/> Palabras a Encontrar</CardTitle>
                    <CardDescription>{foundWords.length} de {words.length} encontradas</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {words.map(word => (
                            <li key={word} className={cn(
                                "text-lg font-medium transition-all",
                                foundWords.includes(word) ? 'line-through text-muted-foreground' : 'text-foreground'
                            )}>
                                {word}
                            </li>
                        ))}
                    </ul>
                </CardContent>
                 <CardFooter className="flex-col items-stretch space-y-2">
                     {foundWords.length === words.length && (
                         <p className="text-center font-semibold text-green-600 p-2 bg-green-100 rounded-md">¡Excelente trabajo!</p>
                     )}
                    <Button onClick={onPlayAgain} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Jugar de Nuevo
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
