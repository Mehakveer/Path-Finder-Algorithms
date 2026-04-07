/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Settings2, CheckCircle2, Grid3X3, Dices, RotateCcw, Info, ChevronRight } from 'lucide-react';
import { AlgorithmType, AlgorithmResult, ALGO_COLORS } from '../types';

const ALGORITHMS: AlgorithmType[] = ['BFS', 'DFS', 'A*', 'GREEDY'];

interface SidebarProps {
  algorithm: AlgorithmType;
  setAlgorithm: (algo: AlgorithmType) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  rows: number;
  setRows: (rows: number) => void;
  cols: number;
  setCols: (cols: number) => void;
  generateMaze: () => void;
  resetAll: () => void;
  results: Partial<Record<AlgorithmType, AlgorithmResult>>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  algorithm, setAlgorithm, speed, setSpeed, rows, setRows, cols, setCols,
  generateMaze, resetAll, results
}) => {
  return (
    <aside className="w-80 border-r border-[#30363d] bg-[#161b22] p-6 flex flex-col gap-6 overflow-y-auto shrink-0">
      <section>
        <div className="flex items-center gap-2 mb-4 text-[#8b949e]">
          <Settings2 size={18} />
          <h2 className="text-sm font-bold uppercase tracking-widest">Configuration</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#8b949e] mb-2 block">Select Algorithm</label>
            <div className="grid grid-cols-1 gap-2">
              {ALGORITHMS.map(algo => (
                <button
                  key={algo}
                  onClick={() => setAlgorithm(algo)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                    algorithm === algo
                      ? 'bg-[#1f6feb]/10 border-[#1f6feb] text-[#58a6ff]'
                      : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-[#8b949e]'
                  }`}
                >
                  <span className="text-sm font-bold">{algo}</span>
                  <div className={`w-2 h-2 rounded-full ${ALGO_COLORS[algo].primary}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#8b949e] mb-2 block flex justify-between">
              Animation Speed <span>{speed}ms</span>
            </label>
            <input 
              type="range" min="1" max="100" step="1"
              value={101 - speed}
              onChange={(e) => setSpeed(101 - parseInt(e.target.value))}
              className="w-full accent-[#58a6ff]"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-[#30363d] pt-6">
        <div className="flex items-center gap-2 mb-4 text-[#8b949e]">
          <Grid3X3 size={18} />
          <h2 className="text-sm font-bold uppercase tracking-widest">Grid Size</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#8b949e] mb-1 block flex justify-between">
              Rows <span>{rows}</span>
            </label>
            <input type="range" min="10" max="30" value={rows} onChange={(e) => setRows(parseInt(e.target.value))} className="w-full accent-[#58a6ff]" />
          </div>
          <div>
            <label className="text-xs font-bold text-[#8b949e] mb-1 block flex justify-between">
              Columns <span>{cols}</span>
            </label>
            <input type="range" min="10" max="50" value={cols} onChange={(e) => setCols(parseInt(e.target.value))} className="w-full accent-[#58a6ff]" />
          </div>
        </div>
      </section>

      <section className="border-t border-[#30363d] pt-6">
        <div className="grid grid-cols-2 gap-3">
          <button onClick={generateMaze} className="flex flex-col items-center gap-2 p-3 bg-[#0d1117] border border-[#30363d] rounded-xl hover:border-[#8b949e] transition-all group">
            <Dices size={20} className="text-[#58a6ff] group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Maze</span>
          </button>
          <button onClick={resetAll} className="flex flex-col items-center gap-2 p-3 bg-[#0d1117] border border-[#30363d] rounded-xl hover:border-[#da3633] transition-all group">
            <RotateCcw size={20} className="text-[#da3633] group-hover:-rotate-45 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Reset</span>
          </button>
        </div>
      </section>

      <section className="mt-auto bg-[#0d1117] border border-[#30363d] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3 text-[#58a6ff]">
          <Info size={16} />
          <h3 className="text-[10px] font-bold uppercase tracking-widest">Algorithm Stats</h3>
        </div>
        <div className="space-y-3">
          {ALGORITHMS.map(algo => {
            const res = results[algo];
            return (
              <div key={algo} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${res?.found ? 'bg-[#3fb950]' : 'bg-[#8b949e]'}`} />
                  <span className="text-[10px] font-bold text-[#e6edf3]">{algo}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-[8px] font-bold text-[#8b949e] uppercase text-right">Time</p>
                    <p className="text-[10px] font-mono text-[#58a6ff]">{res?.execTimeMs !== undefined ? `${res.execTimeMs.toFixed(1)}ms` : '—'}</p>
                  </div>
                  <ChevronRight size={12} className="text-[#30363d] group-hover:text-[#8b949e] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </aside>
  );
};
