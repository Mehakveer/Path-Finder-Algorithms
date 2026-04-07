/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { MousePointer2, Eraser, Target, Flag, RotateCcw, Play, Pause, Square, Gauge, Settings2, ChevronRight, Info } from 'lucide-react';
import { CellType, Point, COLORS, AlgorithmType, ALGO_COLORS } from './types';
import { runAlgorithm, SearchResult } from './algorithms';

export default function App() {
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(30);
  const [grid, setGrid] = useState<CellType[][]>(() => 
    Array.from({ length: 20 }, () => Array(30).fill(CellType.EMPTY))
  );
  const [start, setStart] = useState<Point>({ r: 5, c: 5 });
  const [goal, setGoal] = useState<Point>({ r: 15, c: 25 });
  const [editMode, setEditMode] = useState<'WALL' | 'ERASE' | 'START' | 'GOAL'>('WALL');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('BFS');
  
  // Animation State
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(20);

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
    if (isPlaying) return;
    setSearchResult(null);
    setCurrentFrame(0);
    
    if (editMode === 'START') setStart({ r, c });
    else if (editMode === 'GOAL') setGoal({ r, c });
    else {
      setGrid(prev => {
        const next = prev.map(row => [...row]);
        next[r][c] = editMode === 'WALL' ? CellType.WALL : CellType.EMPTY;
        return next;
      });
    }
  }, [editMode, isPlaying]);

  const resetGrid = () => {
    setIsPlaying(false);
    setGrid(Array.from({ length: rows }, () => Array(cols).fill(CellType.EMPTY)));
    setSearchResult(null);
    setCurrentFrame(0);
  };

  const startSearch = () => {
    if (searchResult && currentFrame > 0) {
      setIsPlaying(true);
      return;
    }
    const result = runAlgorithm(algorithm, grid, start, goal);
    setSearchResult(result);
    setCurrentFrame(0);
    setIsPlaying(true);
  };

  const stopSearch = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
    setSearchResult(null);
  };

  const displayGrid = searchResult?.frames[currentFrame] || grid.map((row, r) => row.map((cell, c) => {
    if (r === start.r && c === start.c) return CellType.START;
    if (r === goal.r && c === goal.c) return CellType.GOAL;
    return cell;
  }));

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col" onMouseUp={() => setIsMouseDown(false)}>
      {/* Header */}
      <header className="h-16 border-b border-[#30363d] bg-[#161b22] px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Path Visualizer <span className="text-xs text-[#8b949e] ml-2">v4.0</span></h1>
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
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-[#0d1117] px-4 py-1.5 rounded-lg border border-[#30363d]">
            <Gauge size={16} className="text-[#8b949e]" />
            <input type="range" min="1" max="100" value={101 - speed} onChange={(e) => setSpeed(101 - parseInt(e.target.value))} className="w-24 accent-[#1f6feb]" />
          </div>

          <button onClick={isPlaying ? () => setIsPlaying(false) : startSearch} className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${isPlaying ? 'bg-[#da3633]' : 'bg-[#238636] shadow-lg shadow-green-500/20'}`}>
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            {isPlaying ? 'Pause' : (searchResult ? 'Resume' : 'Visualize')}
          </button>

          <button onClick={stopSearch} disabled={!searchResult} className="p-2 bg-[#30363d] text-white rounded-lg hover:bg-[#484f58] disabled:opacity-30 transition-all">
            <Square size={18} fill="currentColor" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r border-[#30363d] bg-[#161b22] p-6 flex flex-col gap-8 overflow-y-auto">
          <section>
            <div className="flex items-center gap-2 mb-4 text-[#8b949e]">
              <Settings2 size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest">Algorithm</h2>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {(['BFS', 'DFS', 'A*', 'GREEDY'] as AlgorithmType[]).map(algo => (
                <button
                  key={algo}
                  onClick={() => { setAlgorithm(algo); setSearchResult(null); setCurrentFrame(0); }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${algorithm === algo ? 'bg-[#1f6feb]/10 border-[#1f6feb] text-white' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-[#484f58]'}`}
                >
                  <span className="font-bold">{algo}</span>
                  <div className={`w-2 h-2 rounded-full ${ALGO_COLORS[algo].primary}`} />
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 text-[#8b949e]">
              <Info size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest">Description</h2>
            </div>
            <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-[#8b949e] leading-relaxed">
              {algorithm === 'BFS' && "Breadth-First Search: Guarantees the shortest path. Explores layer by layer."}
              {algorithm === 'DFS' && "Depth-First Search: Does not guarantee shortest path. Explores as deep as possible."}
              {algorithm === 'A*' && "A* Search: Uses heuristics to find the shortest path efficiently."}
              {algorithm === 'GREEDY' && "Greedy Best-First: Uses heuristics to find a path quickly, but not always the shortest."}
            </div>
          </section>

          <div className="mt-auto">
            <button onClick={resetGrid} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-[#30363d] text-[#8b949e] hover:bg-[#da3633] hover:text-white hover:border-[#da3633] transition-all">
              <RotateCcw size={18} />
              <span className="font-bold">Reset Grid</span>
            </button>
          </div>
        </aside>

        {/* Main Grid Area */}
        <main className="flex-1 bg-[#0d1117] p-8 flex flex-col items-center justify-center overflow-auto">
          <div 
            className="grid gap-px bg-[#30363d] border border-[#30363d] rounded-sm overflow-hidden shadow-2xl"
            style={{ gridTemplateColumns: `repeat(${cols}, 25px)` }}
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
      </div>

      {/* Footer */}
      <footer className="h-12 bg-[#161b22] border-t border-[#30363d] flex justify-between items-center px-10">
        <div className="flex items-center gap-2 text-[10px] text-[#8b949e] uppercase tracking-widest">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          {isPlaying ? `Running ${algorithm}...` : 'System Ready'}
        </div>
        
        {searchResult && (
          <div className="flex gap-8 text-[10px] font-bold uppercase">
            <span className="text-[#8b949e]">Progress: <span className="text-[#e6edf3]">{Math.round((currentFrame / (searchResult.frames.length - 1)) * 100)}%</span></span>
            <span className="text-[#8b949e]">Path: <span className="text-[#00f2ff]">{searchResult.found ? `${searchResult.path.length} nodes` : 'N/A'}</span></span>
          </div>
        )}
      </footer>
    </div>
  );
}
