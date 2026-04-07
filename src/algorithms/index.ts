/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlgorithmType, CellType, Point, AlgorithmResult } from '../types';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { astar } from './astar';
import { greedy } from './greedy';

export const runAlgorithm = (
  type: AlgorithmType,
  grid: CellType[][],
  start: Point,
  goal: Point
): AlgorithmResult => {
  switch (type) {
    case 'BFS':
      return bfs(grid, start, goal);
    case 'DFS':
      return dfs(grid, start, goal);
    case 'A*':
      return astar(grid, start, goal);
    case 'GREEDY':
      return greedy(grid, start, goal);
    default:
      throw new Error(`Algorithm ${type} not implemented`);
  }
};
