export enum CellType {
  EMPTY = 'EMPTY',
  WALL = 'WALL',
  START = 'START',
  GOAL = 'GOAL',
  FRONTIER = 'FRONTIER',
  EXPLORED = 'EXPLORED',
  CURRENT = 'CURRENT',
  PATH = 'PATH',
}

export type Point = {
  r: number;
  c: number;
};

export type AlgorithmResult = {
  frames: CellType[][][];
  path: Point[];
  nodesExpanded: number;
  pathLength: number;
  execTimeMs: number;
  found: boolean;
};

export type AlgorithmType = 'BFS' | 'DFS' | 'A*' | 'GREEDY';

export const ALGO_COLORS: Record<AlgorithmType, { primary: string; secondary: string; current: string; hex: string }> = {
  'BFS': { primary: 'bg-[#00d2ff]', secondary: 'bg-[#00d2ff]/20', current: 'bg-[#00d2ff]', hex: '#00d2ff' },
  'DFS': { primary: 'bg-[#ff00ff]', secondary: 'bg-[#ff00ff]/20', current: 'bg-[#ff00ff]', hex: '#ff00ff' },
  'A*': { primary: 'bg-[#00ff88]', secondary: 'bg-[#00ff88]/20', current: 'bg-[#00ff88]', hex: '#00ff88' },
  'GREEDY': { primary: 'bg-[#ff8800]', secondary: 'bg-[#ff8800]/20', current: 'bg-[#ff8800]', hex: '#ff8800' },
};

export const COLORS = {
  [CellType.EMPTY]: 'bg-[#0d1117] border-[#21262d]',
  [CellType.WALL]: 'bg-[#30363d] border-[#30363d]',
  [CellType.START]: 'bg-[#3fb950] border-[#3fb950] shadow-[0_0_15px_rgba(63,185,80,0.5)]',
  [CellType.GOAL]: 'bg-[#f85149] border-[#f85149] shadow-[0_0_15px_rgba(248,81,73,0.5)]',
  [CellType.FRONTIER]: 'bg-[#1f6feb] border-[#388bfd]',
  [CellType.EXPLORED]: 'bg-[#161b22] border-[#30363d]',
  [CellType.CURRENT]: 'bg-[#f0883e] border-[#ffa657]',
  [CellType.PATH]: 'bg-[#00f2ff] border-[#00d4e0] shadow-[0_0_10px_rgba(0,242,255,0.8)]',
};
