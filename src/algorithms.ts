import { CellType, Point, AlgorithmType } from './types';

export type SearchResult = {
  frames: CellType[][][];
  path: Point[];
  found: boolean;
};

const pointToKey = (p: Point) => `${p.r},${p.c}`;

const createSnapshot = (grid: CellType[][], explored: Set<string>, frontier: Set<string>, current: Point | null): CellType[][] => {
  return grid.map((row, r) => row.map((cell, c) => {
    if (cell === CellType.START || cell === CellType.GOAL) return cell;
    if (current && r === current.r && c === current.c) return CellType.EXPLORED;
    if (explored.has(`${r},${c}`)) return CellType.EXPLORED;
    if (frontier.has(`${r},${c}`)) return CellType.FRONTIER;
    return cell;
  }));
};

const heuristic = (a: Point, b: Point) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c);

class PriorityQueue<T> {
  private items: { item: T; priority: number }[] = [];
  push(item: T, priority: number) {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }
  pop() { return this.items.shift()?.item; }
  isEmpty() { return this.items.length === 0; }
}

export const runAlgorithm = (
  type: AlgorithmType,
  grid: CellType[][],
  start: Point,
  goal: Point
): SearchResult => {
  const rows = grid.length;
  const cols = grid[0].length;
  const frames: CellType[][][] = [];
  const explored = new Set<string>();
  const frontierSet = new Set<string>();
  const cameFrom: Record<string, Point | null> = {};
  cameFrom[pointToKey(start)] = null;

  let found = false;

  if (type === 'BFS' || type === 'DFS') {
    const list: Point[] = [start];
    frontierSet.add(pointToKey(start));

    while (list.length > 0) {
      const current = type === 'BFS' ? list.shift()! : list.pop()!;
      const key = pointToKey(current);
      frontierSet.delete(key);
      explored.add(key);

      if (current.r === goal.r && current.c === goal.c) {
        found = true;
        break;
      }

      if (explored.size % 5 === 0) frames.push(createSnapshot(grid, explored, frontierSet, current));

      const neighbors = [
        { r: current.r - 1, c: current.c },
        { r: current.r + 1, c: current.c },
        { r: current.r, c: current.c - 1 },
        { r: current.r, c: current.c + 1 },
      ];

      for (const next of neighbors) {
        if (next.r >= 0 && next.r < rows && next.c >= 0 && next.c < cols && grid[next.r][next.c] !== CellType.WALL) {
          const nextKey = pointToKey(next);
          if (!explored.has(nextKey) && !frontierSet.has(nextKey)) {
            frontierSet.add(nextKey);
            cameFrom[nextKey] = current;
            list.push(next);
          }
        }
      }
    }
  } else {
    // A* or Greedy
    const pq = new PriorityQueue<Point>();
    const costSoFar: Record<string, number> = {};
    pq.push(start, 0);
    costSoFar[pointToKey(start)] = 0;
    frontierSet.add(pointToKey(start));

    while (!pq.isEmpty()) {
      const current = pq.pop()!;
      const key = pointToKey(current);
      frontierSet.delete(key);
      explored.add(key);

      if (current.r === goal.r && current.c === goal.c) {
        found = true;
        break;
      }

      if (explored.size % 5 === 0) frames.push(createSnapshot(grid, explored, frontierSet, current));

      const neighbors = [
        { r: current.r - 1, c: current.c },
        { r: current.r + 1, c: current.c },
        { r: current.r, c: current.c - 1 },
        { r: current.r, c: current.c + 1 },
      ];

      for (const next of neighbors) {
        if (next.r >= 0 && next.r < rows && next.c >= 0 && next.c < cols && grid[next.r][next.c] !== CellType.WALL) {
          const nextKey = pointToKey(next);
          const newCost = (costSoFar[key] || 0) + 1;

          if (!costSoFar.hasOwnProperty(nextKey) || newCost < costSoFar[nextKey]) {
            costSoFar[nextKey] = newCost;
            const priority = type === 'A*' ? newCost + heuristic(next, goal) : heuristic(next, goal);
            pq.push(next, priority);
            cameFrom[nextKey] = current;
            frontierSet.add(nextKey);
          }
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

    const lastExplorationFrame = createSnapshot(grid, explored, frontierSet, null);
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
