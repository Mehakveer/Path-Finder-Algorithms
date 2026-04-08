import React from 'react';
import { Settings2, CheckCircle2, Grid3X3, Dices, RotateCcw, Info, ChevronRight, Palette } from 'lucide-react';
import { AlgorithmType, AlgorithmResult, CellType, COLORS } from '../types';

const ALGORITHMS: AlgorithmType[] = ['BFS', 'DFS', 'A*', 'GREEDY'];

interface SidebarProps {
  selectedAlgos: AlgorithmType[];
  toggleAlgo: (algo: AlgorithmType) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  tempRows: number;
  setTempRows: (rows: number) => void;
  tempCols: number;
  setTempCols: (cols: number) => void;
  applySize: () => void;
  generateMaze: () => void;
  resetAll: () => void;
  results: Partial<Record<AlgorithmType, AlgorithmResult>>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedAlgos, toggleAlgo, speed, setSpeed, tempRows, setTempRows, tempCols, setTempCols,
  applySize, generateMaze, resetAll, results
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
            <label className="text-xs font-bold text-[#8b949e] mb-2 block">Select Algorithms</label>
            <div className="grid grid-cols-1 gap-2">
              {ALGORITHMS.map(algo => (
                <button
                  key={algo}
                  onClick={() => toggleAlgo(algo)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                    selectedAlgos.includes(algo)
                      ? 'bg-[#1f6feb]/10 border-[#1f6feb] text-[#58a6ff]'
                      : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-[#8b949e]'
                  }`}
                >
                  <span className="text-sm font-bold">{algo}</span>
                  {selectedAlgos.includes(algo) && <CheckCircle2 size={16} />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#8b949e] mb-2 block flex justify-between">
              Animation Speed <span>{speed}ms</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="1"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
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
              Rows <span>{tempRows}</span>
            </label>
            <input 
              type="range" 
              min="5" 
              max="40" 
              value={tempRows}
              onChange={(e) => setTempRows(parseInt(e.target.value))}
              className="w-full accent-[#58a6ff]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#8b949e] mb-1 block flex justify-between">
              Columns <span>{tempCols}</span>
            </label>
            <input 
              type="range" 
              min="5" 
              max="60" 
              value={tempCols}
              onChange={(e) => setTempCols(parseInt(e.target.value))}
              className="w-full accent-[#58a6ff]"
            />
          </div>
          <button 
            onClick={applySize}
            className="w-full py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
          >
            Apply Dimensions
          </button>
        </div>
      </section>

      <section className="border-t border-[#30363d] pt-6">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={generateMaze}
            className="flex flex-col items-center gap-2 p-3 bg-[#0d1117] border border-[#30363d] rounded-xl hover:border-[#8b949e] transition-all group"
          >
            <Dices size={20} className="text-[#58a6ff] group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Maze</span>
          </button>
          <button 
            onClick={resetAll}
            className="flex flex-col items-center gap-2 p-3 bg-[#0d1117] border border-[#30363d] rounded-xl hover:border-[#da3633] transition-all group"
          >
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
          {selectedAlgos.map(algo => {
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
                    <p className="text-[10px] font-mono text-[#58a6ff]">{res ? `${res.execTimeMs.toFixed(1)}ms` : '—'}</p>
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
