/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CellType, Point } from './types';

export type SearchResult = {
  frames: CellType[][][];
  path: Point[];
  found: boolean;
};

const pointToKey = (p: Point) => `${p.r},${p.c}`;

const createSnapshot = (grid: CellType[][], explored: Set<string>, current: Point | null): CellType[][] => {
  return grid.map((row, r) => row.map((cell, c) => {
    if (cell === CellType.START || cell === CellType.GOAL) return cell;
    if (current && r === current.r && c === current.c) return CellType.EXPLORED; // Highlight current
    if (explored.has(`${r},${c}`)) return CellType.EXPLORED;
    return cell;
  }));
};

export const bfs = (
  grid: CellType[][],
  start: Point,
  goal: Point
): SearchResult => {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue: Point[] = [start];
  const explored = new Set<string>();
  const cameFrom: Record<string, Point | null> = {};
  const frames: CellType[][][] = [];
  
  explored.add(pointToKey(start));
  cameFrom[pointToKey(start)] = null;

  let found = false;

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.r === goal.r && current.c === goal.c) {
      found = true;
      break;
    }

    // Add a frame every few steps to keep animation smooth but not too slow
    if (explored.size % 5 === 0) {
      frames.push(createSnapshot(grid, explored, current));
    }

    const neighbors = [
      { r: current.r - 1, c: current.c },
      { r: current.r + 1, c: current.c },
      { r: current.r, c: current.c - 1 },
      { r: current.r, c: current.c + 1 },
    ];

    for (const next of neighbors) {
      if (
        next.r >= 0 && next.r < rows && 
        next.c >= 0 && next.c < cols && 
        grid[next.r][next.c] !== CellType.WALL
      ) {
        const key = pointToKey(next);
        if (!explored.has(key)) {
          explored.add(key);
          cameFrom[key] = current;
          queue.push(next);
        }
      }
    }
  }

  const path: Point[] = [];
  if (found) {
    let curr: Point | null = goal;
    while (curr) {
      path.push(curr);
      curr = cameFrom[pointToKey(curr)] || null;
    }
    path.reverse();

    // Add path animation frames
    const lastExplorationFrame = createSnapshot(grid, explored, null);
    for (let i = 0; i < path.length; i++) {
      const pathSnapshot = lastExplorationFrame.map((row, r) => row.map((cell, c) => {
        const isPathNode = path.slice(0, i + 1).some(p => p.r === r && p.c === c);
        if (isPathNode && cell !== CellType.START && cell !== CellType.GOAL) return CellType.PATH;
        return cell;
      }));
      frames.push(pathSnapshot);
    }
  }

  return { frames, path, found };
};
