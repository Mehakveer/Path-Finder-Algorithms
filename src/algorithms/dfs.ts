import { CellType, Point, AlgorithmResult } from '../types';
import { getNeighbors, pointToKey, createSnapshot } from './utils';

export const dfs = (
  grid: CellType[][],
  start: Point,
  goal: Point
): AlgorithmResult => {
  const rows = grid.length;
  const cols = grid[0].length;
  const t0 = performance.now();

  const frames: CellType[][][] = [];
  const explored = new Set<string>();
  const frontierSet = new Set<string>();
  const cameFrom: Record<string, Point | null> = {};
  cameFrom[pointToKey(start)] = null;

  let nodesExpanded = 0;
  let found = false;

  const stack: Point[] = [start];
  frontierSet.add(pointToKey(start));

  while (stack.length > 0) {
    const current = stack.pop()!;
    const key = pointToKey(current);
    frontierSet.delete(key);

    if (explored.has(key)) continue;
    explored.add(key);
    nodesExpanded++;

    if (nodesExpanded % 2 === 0 || (current.r === goal.r && current.c === goal.c)) {
      frames.push(createSnapshot(grid, current, frontierSet, explored));
    }

    if (current.r === goal.r && current.c === goal.c) {
      found = true;
      break;
    }

    for (const next of getNeighbors(current, rows, cols, grid)) {
      const nextKey = pointToKey(next);
      if (!explored.has(nextKey)) {
        cameFrom[nextKey] = current;
        stack.push(next);
        frontierSet.add(nextKey);
      }
    }
  }

  const execTimeMs = performance.now() - t0;
  const path: Point[] = [];
  if (found) {
    let curr: Point | null = goal;
    while (curr) {
      path.push(curr);
      curr = cameFrom[pointToKey(curr)] || null;
    }
    path.reverse();

    const lastFrame = frames[frames.length - 1];
    for (let i = 0; i < path.length; i++) {
      const pathFrame = lastFrame.map((row, r) =>
        row.map((cell, c) => {
          const isPath = path.slice(0, i + 1).some(p => p.r === r && p.c === c);
          if (isPath && cell !== CellType.START && cell !== CellType.GOAL) return CellType.PATH;
          return cell;
        })
      );
      frames.push(pathFrame);
    }
  }

  return {
    frames,
    path,
    nodesExpanded,
    pathLength: path.length > 0 ? path.length - 1 : 0,
    execTimeMs,
    found,
  };
};
