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
}

export type Point = {
  r: number;
  c: number;
};

export const COLORS = {
  [CellType.EMPTY]: 'bg-[#0d1117] border-[#21262d]',
  [CellType.WALL]: 'bg-[#30363d] border-[#30363d]',
  [CellType.START]: 'bg-[#238636] border-[#2ea043]',
  [CellType.GOAL]: 'bg-[#da3633] border-[#f85149]',
  [CellType.EXPLORED]: 'bg-[#1f6feb]/30 border-[#1f6feb]/50',
  [CellType.PATH]: 'bg-[#00f2ff] border-[#00d4e0]',
};
