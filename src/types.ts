/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  'BFS': { primary: 'bg-blue-500', secondary: 'bg-blue-900/40', current: 'bg-blue-300', hex: '#3b82f6' },
  'DFS': { primary: 'bg-purple-500', secondary: 'bg-purple-900/40', current: 'bg-purple-300', hex: '#a855f7' },
  'A*': { primary: 'bg-emerald-500', secondary: 'bg-emerald-900/40', current: 'bg-emerald-300', hex: '#10b981' },
  'GREEDY': { primary: 'bg-orange-500', secondary: 'bg-orange-900/40', current: 'bg-orange-300', hex: '#f97316' },
};

export const COLORS = {
  [CellType.EMPTY]: 'bg-[#0d1117] border-[#21262d]',
  [CellType.WALL]: 'bg-[#30363d] border-[#30363d]',
  [CellType.START]: 'bg-[#238636] border-[#2ea043]',
  [CellType.GOAL]: 'bg-[#da3633] border-[#f85149]',
  [CellType.FRONTIER]: 'bg-[#1f6feb] border-[#388bfd]',
  [CellType.EXPLORED]: 'bg-[#161b22] border-[#30363d]',
  [CellType.CURRENT]: 'bg-[#f0883e] border-[#ffa657]',
  [CellType.PATH]: 'bg-[#00f2ff] border-[#00d4e0]',
};
