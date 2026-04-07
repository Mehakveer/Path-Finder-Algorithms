/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CellType, Point } from '../types';

export const pointToKey = (p: Point) => `${p.r},${p.c}`;

export const getNeighbors = (p: Point, rows: number, cols: number, grid: CellType[][]) => {
  const neighbors: Point[] = [];
  const dirs = [
    { r: -1, c: 0 }, { r: 1, c: 0 },
    { r: 0, c: -1 }, { r: 0, c: 1 }
  ];
  for (const d of dirs) {
    const nr = p.r + d.r;
    const nc = p.c + d.c;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== CellType.WALL) {
      neighbors.push({ r: nr, c: nc });
    }
  }
  return neighbors;
};

export const createSnapshot = (
  grid: CellType[][],
  current: Point | null,
  frontier: Set<string>,
  explored: Set<string>
): CellType[][] => {
  return grid.map((row, r) => row.map((cell, c) => {
    if (cell === CellType.START || cell === CellType.GOAL) return cell;
    const key = `${r},${c}`;
    if (current && r === current.r && c === current.c) return CellType.CURRENT;
    if (explored.has(key)) return CellType.EXPLORED;
    if (frontier.has(key)) return CellType.FRONTIER;
    return cell;
  }));
};
