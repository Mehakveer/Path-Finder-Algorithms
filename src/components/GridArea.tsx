import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AlgorithmType, CellType, AlgorithmResult, COLORS, ALGO_COLORS } from '../types';

interface GridAreaProps {
  selectedAlgos: AlgorithmType[];
  results: Partial<Record<AlgorithmType, AlgorithmResult>>;
  currentFrame: number;
  grid: CellType[][];
  rows: number;
  cols: number;
  handleMouseDown: (r: number, c: number) => void;
  handleMouseEnter: (r: number, c: number) => void;
}

export const GridArea: React.FC<GridAreaProps> = ({
  selectedAlgos, results, currentFrame, grid, rows, cols, handleMouseDown, handleMouseEnter
}) => {
  const getCellColor = (algo: AlgorithmType, cell: CellType) => {
    if (cell === CellType.EXPLORED) return ALGO_COLORS[algo].secondary;
    if (cell === CellType.FRONTIER) return ALGO_COLORS[algo].primary;
    if (cell === CellType.CURRENT) return ALGO_COLORS[algo].current;
    return COLORS[cell];
  };

  const getCellAnimation = (cell: CellType) => {
    if (cell === CellType.EXPLORED || cell === CellType.FRONTIER || cell === CellType.CURRENT) return 'animate-cell-pop';
    if (cell === CellType.PATH) return 'animate-path-flow';
    return '';
  };

  return (
    <main className="flex-1 bg-[#0d1117] p-4 flex flex-col items-center justify-start overflow-auto custom-scrollbar">
      <div className={`grid gap-4 w-full ${
        selectedAlgos.length === 1 ? 'grid-cols-1' : 
        selectedAlgos.length === 2 ? 'grid-cols-2' : 
        'grid-cols-2 grid-rows-2'
      }`}
      style={{ height: '650px' }}
      >
        {selectedAlgos.map(algo => {
          const res = results[algo];
          const frame = res ? res.frames[Math.min(currentFrame, res.frames.length - 1)] : grid;
          
          return (
            <div key={algo} className="relative flex flex-col bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-lg h-full">
              <div className="h-6 bg-[#0d1117] border-b border-[#30363d] px-2 flex items-center justify-between shrink-0">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#8b949e]">{algo} View</span>
                {res?.found && <CheckCircle2 size={10} className="text-[#3fb950]" />}
              </div>
              
              <div className="flex-1 p-2 flex items-center justify-center overflow-hidden">
                <div 
                  className="grid gap-px bg-[#30363d] border border-[#30363d] rounded-sm overflow-hidden"
                  style={{ 
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    width: '100%',
                    height: '100%',
                    maxHeight: '100%',
                    aspectRatio: `${cols}/${rows}`
                  }}
                >
                  {frame.map((row, r) => (
                    row.map((cell, c) => (
                      <div
                        key={`${r}-${c}`}
                        onMouseDown={() => handleMouseDown(r, c)}
                        onMouseEnter={() => handleMouseEnter(r, c)}
                        className={`relative w-full h-full transition-all duration-200 cursor-crosshair ${getCellColor(algo, cell)} ${getCellAnimation(cell)}`}
                      />
                    ))
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Label Section */}
      <div className="mt-6 w-full max-w-4xl bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-3 text-[#8b949e]">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Label</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            { label: 'Start', type: CellType.START },
            { label: 'Goal', type: CellType.GOAL },
            { label: 'Wall', type: CellType.WALL },
            { label: 'Path', type: CellType.PATH },
            { label: 'Frontier', type: CellType.FRONTIER },
            { label: 'Explored', type: CellType.EXPLORED },
            { label: 'Current', type: CellType.CURRENT },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 group">
              <div className={`w-4 h-4 rounded-md border border-white/10 shadow-sm transition-transform group-hover:scale-110 ${COLORS[item.type].split(' ')[0]}`} />
              <span className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider group-hover:text-[#e6edf3] transition-colors">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
