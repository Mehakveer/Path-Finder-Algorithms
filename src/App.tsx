/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { MousePointer2, Eraser, Target, Flag, Play, Pause, Square } from 'lucide-react';
import { CellType, Point, AlgorithmType, AlgorithmResult } from './types';
import { runAlgorithm } from './algorithms';
import { Sidebar } from './components/Sidebar';
import { GridArea } from './components/GridArea';

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
  
  // Animation & Results
  const [results, setResults] = useState<Partial<Record<AlgorithmType, AlgorithmResult>>>({});
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(20);

  // Sync grid when rows/cols change
  useEffect(() => {
    setGrid(Array.from({ length: rows }, () => Array(cols).fill(CellType.EMPTY)));
    setResults({});
    setCurrentFrame(0);
    setIsPlaying(false);
  }, [rows, cols]);

  // Animation Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const res = results[algorithm];
    if (isPlaying && res && currentFrame < res.frames.length - 1) {
      timer = setTimeout(() => {
        setCurrentFrame(prev => prev + 1);
      }, speed);
    } else if (res && currentFrame >= res.frames.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentFrame, results, algorithm, speed]);

  const handleCellInteraction = useCallback((r: number, c: number) => {
    if (isPlaying) return;
    setResults({});
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

  const generateMaze = () => {
    const newGrid = grid.map(row => row.map(() => Math.random() < 0.3 ? CellType.WALL : CellType.EMPTY));
    setGrid(newGrid);
    setResults({});
    setCurrentFrame(0);
  };

  const resetAll = () => {
    setIsPlaying(false);
    setGrid(Array.from({ length: rows }, () => Array(cols).fill(CellType.EMPTY)));
    setResults({});
    setCurrentFrame(0);
  };

  const startSearch = () => {
    if (results[algorithm] && currentFrame > 0) {
      setIsPlaying(true);
      return;
    }
    const result = runAlgorithm(algorithm, grid, start, goal);
    setResults(prev => ({ ...prev, [algorithm]: result }));
    setCurrentFrame(0);
    setIsPlaying(true);
  };

  const stopSearch = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
    setResults({});
  };

  const displayGrid = results[algorithm]?.frames[currentFrame] || grid;

  return (
    <div className="h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col overflow-hidden" onMouseUp={() => setIsMouseDown(false)}>
      {/* Header */}
      <header className="h-16 border-b border-[#30363d] bg-[#161b22] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight">Path Visualizer <span className="text-xs text-[#8b949e] ml-2 font-mono">v5.0</span></h1>
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
        
        <div className="flex items-center gap-3">
          <button 
            onClick={isPlaying ? () => setIsPlaying(false) : startSearch}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${
              isPlaying ? 'bg-[#da3633]' : 'bg-[#238636] shadow-lg shadow-green-500/20'
            }`}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            {isPlaying ? 'Pause' : (results[algorithm] ? 'Resume' : 'Visualize')}
          </button>
          <button onClick={stopSearch} disabled={!results[algorithm]} className="p-2 bg-[#30363d] rounded-lg disabled:opacity-30">
            <Square size={18} fill="currentColor" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          algorithm={algorithm} setAlgorithm={setAlgorithm}
          speed={speed} setSpeed={setSpeed}
          rows={rows} setRows={setRows}
          cols={cols} setCols={setCols}
          generateMaze={generateMaze}
          resetAll={resetAll}
          results={results}
        />
        <GridArea 
          grid={displayGrid}
          start={start}
          goal={goal}
          handleMouseDown={(r, c) => { setIsMouseDown(true); handleCellInteraction(r, c); }}
          handleMouseEnter={(r, c) => isMouseDown && handleCellInteraction(r, c)}
          cols={cols}
        />
      </div>

      <footer className="h-10 bg-[#161b22] border-t border-[#30363d] flex justify-between items-center px-10 shrink-0">
        <div className="text-[10px] text-[#8b949e] uppercase tracking-widest font-bold">
          {isPlaying ? `Visualizing ${algorithm}...` : 'System Ready'}
        </div>
        {results[algorithm] && (
          <div className="flex gap-8 text-[10px] font-bold uppercase">
            <span className="text-[#8b949e]">Nodes: <span className="text-[#e6edf3]">{results[algorithm]?.nodesExpanded}</span></span>
            <span className="text-[#8b949e]">Length: <span className="text-[#00f2ff]">{results[algorithm]?.pathLength}</span></span>
            <span className="text-[#8b949e]">Time: <span className="text-[#58a6ff]">{results[algorithm]?.execTimeMs?.toFixed(1) ?? '0.0'}ms</span></span>
          </div>
        )}
      </footer>
    </div>
  );
}
