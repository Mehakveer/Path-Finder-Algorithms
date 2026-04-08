import { CellType, Point } from '../types';

export class PriorityQueue<T> {
  private items: { item: T; priority: number }[] = [];

  push(item: T, priority: number) {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  pop(): T | undefined {
    return this.items.shift()?.item;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

export const getNeighbors = (p: Point, rows: number, cols: number, grid: CellType[][]) => {
  const neighbors: Point[] = [];
  const directions = [
    { r: -1, c: 0 }, // Up
    { r: 1, c: 0 },  // Down
    { r: 0, c: -1 }, // Left
    { r: 0, c: 1 },  // Right
  ];

  for (const d of directions) {
    const nr = p.r + d.r;
    const nc = p.c + d.c;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== CellType.WALL) {
      neighbors.push({ r: nr, c: nc });
    }
  }
  return neighbors;
};

export const heuristic = (a: Point, b: Point) => {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
};

export const pointToKey = (p: Point) => `${p.r},${p.c}`;

export const createSnapshot = (
  grid: CellType[][],
  current: Point,
  frontierSet: Set<string>,
  explored: Set<string>
) => {
  return grid.map((row, r) =>
    row.map((cell, c) => {
      const key = pointToKey({ r, c });
      if (cell === CellType.START || cell === CellType.GOAL || cell === CellType.WALL) return cell;
      if (r === current.r && c === current.c) return CellType.CURRENT;
      if (frontierSet.has(key)) return CellType.FRONTIER;
      if (explored.has(key)) return CellType.EXPLORED;
      return CellType.EMPTY;
    })
  );
};
