/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { MousePointer2, Eraser, Target, Flag, RotateCcw, Play, Pause, Square, Gauge } from 'lucide-react';
import { CellType, Point, COLORS } from './types';
import { bfs, SearchResult } from './algorithms';

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
  
  // Animation State
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(20); // ms per frame

  // Animation Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && searchResult && currentFrame < searchResult.frames.length - 1) {
      timer = setTimeout(() => {
        setCurrentFrame(prev => prev + 1);
      }, speed);
    } else if (currentFrame >= (searchResult?.frames.length || 0) - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentFrame, searchResult, speed]);

  const handleCellInteraction = useCallback((r: number, c: number) => {
    if (isPlaying) return; // Disable editing while playing
    
    setSearchResult(null);
    setCurrentFrame(0);
    
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
  }, [editMode, isPlaying]);

  const resetGrid = () => {
    setIsPlaying(false);
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(CellType.EMPTY)));
    setStart({ r: 5, c: 5 });
    setGoal({ r: 15, c: 25 });
    setSearchResult(null);
    setCurrentFrame(0);
  };

  const startSearch = () => {
    if (searchResult && currentFrame > 0) {
      setIsPlaying(true);
      return;
    }
    const result = bfs(grid, start, goal);
    setSearchResult(result);
    setCurrentFrame(0);
    setIsPlaying(true);
  };

  const stopSearch = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
    setSearchResult(null);
  };

  const getDisplayGrid = () => {
    if (searchResult && searchResult.frames[currentFrame]) {
      return searchResult.frames[currentFrame];
    }
    return grid.map((row, r) => row.map((cell, c) => {
      if (r === start.r && c === start.c) return CellType.START;
      if (r === goal.r && c === goal.c) return CellType.GOAL;
      return cell;
    }));
  };

  const displayGrid = getDisplayGrid();

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col" onMouseUp={() => setIsMouseDown(false)}>
      {/* Header */}
      <header className="h-16 border-b border-[#30363d] bg-[#161b22] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Path Visualizer <span className="text-xs text-[#8b949e] ml-2">v3.0</span></h1>
          
          <div className="h-8 w-px bg-[#30363d] mx-2" />
          
          <div className="flex bg-[#0d1117] rounded-lg p-1 border border-[#30363d]">
            {[
              { id: 'WALL', icon: MousePointer2, label: 'Wall' },
              { id: 'ERASE', icon: Eraser, label: 'Erase' },
              { id: 'START', icon: Target, label: 'Start' },
              { id: 'GOAL', icon: Flag, label: 'Goal' },
            ].map(tool => (
              <button
                key={tool.id}
                disabled={isPlaying}
                onClick={() => setEditMode(tool.id as any)}
                className={`p-2 rounded-md transition-all ${editMode === tool.id ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e] hover:text-white'} disabled:opacity-30`}
                title={tool.label}
              >
                <tool.icon size={18} />
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-[#0d1117] px-4 py-1.5 rounded-lg border border-[#30363d]">
            <Gauge size={16} className="text-[#8b949e]" />
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={101 - speed} 
              onChange={(e) => setSpeed(101 - parseInt(e.target.value))}
              className="w-24 accent-[#1f6feb]"
            />
            <span className="text-[10px] font-bold text-[#8b949e] w-8">SPEED</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={isPlaying ? () => setIsPlaying(false) : startSearch}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                isPlaying 
                  ? 'bg-[#da3633] hover:bg-[#f85149] text-white' 
                  : 'bg-[#238636] hover:bg-[#2ea043] text-white shadow-lg shadow-green-500/20'
              }`}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              {isPlaying ? 'Pause' : (searchResult ? 'Resume' : 'Start')}
            </button>

            <button 
              onClick={stopSearch}
              disabled={!searchResult}
              className="p-2 bg-[#30363d] text-white rounded-lg hover:bg-[#484f58] disabled:opacity-30 transition-all"
            >
              <Square size={18} fill="currentColor" />
            </button>

            <button onClick={resetGrid} className="p-2 text-[#8b949e] hover:text-[#da3633] transition-colors">
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Grid Area */}
      <main className="flex-1 p-8 flex items-center justify-center">
        <div 
          className="grid gap-px bg-[#30363d] border border-[#30363d] rounded-sm overflow-hidden shadow-2xl"
          style={{ gridTemplateColumns: `repeat(${COLS}, 25px)` }}
        >
          {displayGrid.map((row, r) => (
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                onMouseDown={() => { setIsMouseDown(true); handleCellInteraction(r, c); }}
                onMouseEnter={() => isMouseDown && handleCellInteraction(r, c)}
                className={`w-[25px] h-[25px] transition-colors duration-75 cursor-crosshair ${COLORS[cell]}`}
              />
            ))
          ))}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-4 bg-[#161b22] border-t border-[#30363d] flex justify-between items-center px-10">
        <div className="text-[10px] text-[#8b949e] uppercase tracking-widest">
          {isPlaying ? 'Visualizing Algorithm...' : 'Ready to Visualize'}
        </div>
        
        {searchResult && (
          <div className="flex gap-6">
            <div className="text-[10px] font-bold text-[#8b949e] uppercase">
              Progress: <span className="text-[#e6edf3]">{Math.round((currentFrame / (searchResult.frames.length - 1)) * 100)}%</span>
            </div>
            <div className="text-[10px] font-bold text-[#8b949e] uppercase">
              Path: <span className="text-[#00f2ff]">{searchResult.found ? `${searchResult.path.length} nodes` : 'N/A'}</span>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
