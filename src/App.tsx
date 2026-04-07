/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { MousePointer2, Eraser, Target, Flag, RotateCcw } from 'lucide-react';
import { CellType, Point, COLORS } from './types';

const ROWS = 20;
const COLS = 30;

export default function App() {
  const [grid, setGrid] = useState<CellType[][]>(() => 
    Array.from({ length: ROWS }, () => Array(COLS).fill(CellType.EMPTY))
  );
  const [start, setStart] = useState<Point>({ r: 5, c: 5 });
  const [goal, setGoal] = useState<Point>({ r: 15, c: 25 });
  const [editMode, setEditMode] = useState<'WALL' | 'ERASE' | 'START' | 'GOAL'>('WALL');
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Helper to update grid based on current edit mode
  const handleCellInteraction = useCallback((r: number, c: number) => {
    if (editMode === 'START') {
      setStart({ r, c });
    } else if (editMode === 'GOAL') {
      setGoal({ r, c });
    } else {
      setGrid(prev => {
        const next = prev.map(row => [...row]);
        next[r][c] = editMode === 'WALL' ? CellType.WALL : CellType.EMPTY;
        return next;
      });
    }
  }, [editMode]);

  const resetGrid = () => {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(CellType.EMPTY)));
    setStart({ r: 5, c: 5 });
    setGoal({ r: 15, c: 25 });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col" onMouseUp={() => setIsMouseDown(false)}>
      {/* Header */}
      <header className="h-16 border-b border-[#30363d] bg-[#161b22] px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Path Visualizer <span className="text-xs text-[#8b949e] ml-2">v1.0</span></h1>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-[#0d1117] rounded-lg p-1 border border-[#30363d]">
            {[
              { id: 'WALL', icon: MousePointer2, label: 'Wall' },
              { id: 'ERASE', icon: Eraser, label: 'Erase' },
              { id: 'START', icon: Target, label: 'Start' },
              { id: 'GOAL', icon: Flag, label: 'Goal' },
            ].map(tool => (
              <button
                key={tool.id}
                onClick={() => setEditMode(tool.id as any)}
                className={`p-2 rounded-md transition-all ${editMode === tool.id ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:text-white'}`}
                title={tool.label}
              >
                <tool.icon size={18} />
              </button>
            ))}
          </div>
          <button onClick={resetGrid} className="p-2 text-[#8b949e] hover:text-[#da3633] transition-colors">
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      {/* Grid Area */}
      <main className="flex-1 p-8 flex items-center justify-center">
        <div 
          className="grid gap-px bg-[#30363d] border border-[#30363d] rounded-sm overflow-hidden shadow-2xl"
          style={{ gridTemplateColumns: `repeat(${COLS}, 25px)` }}
        >
          {grid.map((row, r) => (
            row.map((cell, c) => {
              // Determine what to show in this cell
              let displayCell = cell;
              if (r === start.r && c === start.c) displayCell = CellType.START;
              else if (r === goal.r && c === goal.c) displayCell = CellType.GOAL;

              return (
                <div
                  key={`${r}-${c}`}
                  onMouseDown={() => { setIsMouseDown(true); handleCellInteraction(r, c); }}
                  onMouseEnter={() => isMouseDown && handleCellInteraction(r, c)}
                  className={`w-[25px] h-[25px] transition-colors duration-200 cursor-crosshair ${COLORS[displayCell]}`}
                />
              );
            })
          ))}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-4 text-center text-[10px] text-[#8b949e] uppercase tracking-widest border-t border-[#30363d]">
        Click and drag to draw walls • Move start and goal points
      </footer>
    </div>
  );
}
