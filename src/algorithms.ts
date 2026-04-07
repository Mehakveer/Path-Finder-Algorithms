/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CellType, Point } from './types';

export type SearchResult = {
  explored: Set<string>;
  path: Point[];
  found: boolean;
};

const pointToKey = (p: Point) => `${p.r},${p.c}`;

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
  
  explored.add(pointToKey(start));
  cameFrom[pointToKey(start)] = null;

  let found = false;

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.r === goal.r && current.c === goal.c) {
      found = true;
      break;
    }

    const neighbors = [
      { r: current.r - 1, c: current.c }, // Up
      { r: current.r + 1, c: current.c }, // Down
      { r: current.r, c: current.c - 1 }, // Left
      { r: current.r, c: current.c + 1 }, // Right
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
  }

  return { explored, path, found };
};
