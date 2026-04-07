/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CellType, Point, COLORS } from '../types';

interface GridAreaProps {
  grid: CellType[][];
  start: Point;
  goal: Point;
  handleMouseDown: (r: number, c: number) => void;
  handleMouseEnter: (r: number, c: number) => void;
  cols: number;
}

export const GridArea: React.FC<GridAreaProps> = ({
  grid, start, goal, handleMouseDown, handleMouseEnter, cols
}) => {
  return (
    <main className="flex-1 bg-[#0d1117] p-8 flex flex-col items-center justify-center overflow-auto">
      <div 
        className="grid gap-px bg-[#30363d] border border-[#30363d] rounded-sm overflow-hidden shadow-2xl"
        style={{ gridTemplateColumns: `repeat(${cols}, 25px)` }}
      >
        {grid.map((row, r) => (
          row.map((cell, c) => {
            let displayCell = cell;
            if (r === start.r && c === start.c) displayCell = CellType.START;
            else if (r === goal.r && c === goal.c) displayCell = CellType.GOAL;

            return (
              <div
                key={`${r}-${c}`}
                onMouseDown={() => handleMouseDown(r, c)}
                onMouseEnter={() => handleMouseEnter(r, c)}
                className={`w-[25px] h-[25px] transition-colors duration-75 cursor-crosshair ${COLORS[displayCell]}`}
              />
            );
          })
        ))}
      </div>

      {/* Label Section */}
      <div className="mt-8 w-full max-w-3xl bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-wrap justify-center gap-6">
        {[
          { label: 'Start', type: CellType.START },
          { label: 'Goal', type: CellType.GOAL },
          { label: 'Wall', type: CellType.WALL },
          { label: 'Path', type: CellType.PATH },
          { label: 'Frontier', type: CellType.FRONTIER },
          { label: 'Explored', type: CellType.EXPLORED },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm ${COLORS[item.type].split(' ')[0]}`} />
            <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
    </main>
  );
};
