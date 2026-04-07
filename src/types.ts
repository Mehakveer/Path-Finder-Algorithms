/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum CellType {
  EMPTY = 'EMPTY',
  WALL = 'WALL',
  START = 'START',
  GOAL = 'GOAL',
  EXPLORED = 'EXPLORED',
  PATH = 'PATH',
  FRONTIER = 'FRONTIER',
}

export type Point = {
  r: number;
  c: number;
};

export type AlgorithmType = 'BFS' | 'DFS' | 'A*' | 'GREEDY';

export const ALGO_COLORS: Record<AlgorithmType, { primary: string; secondary: string; hex: string }> = {
  'BFS': { primary: 'bg-blue-500', secondary: 'bg-blue-900/40', hex: '#3b82f6' },
  'DFS': { primary: 'bg-purple-500', secondary: 'bg-purple-900/40', hex: '#a855f7' },
  'A*': { primary: 'bg-emerald-500', secondary: 'bg-emerald-900/40', hex: '#10b981' },
  'GREEDY': { primary: 'bg-orange-500', secondary: 'bg-orange-900/40', hex: '#f97316' },
};

export const COLORS = {
  [CellType.EMPTY]: 'bg-[#0d1117] border-[#21262d]',
  [CellType.WALL]: 'bg-[#30363d] border-[#30363d]',
  [CellType.START]: 'bg-[#238636] border-[#2ea043]',
  [CellType.GOAL]: 'bg-[#da3633] border-[#f85149]',
  [CellType.EXPLORED]: 'bg-[#1f6feb]/20 border-[#1f6feb]/30',
  [CellType.PATH]: 'bg-[#00f2ff] border-[#00d4e0]',
  [CellType.FRONTIER]: 'bg-[#1f6feb]/40 border-[#388bfd]',
};
