/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CellType, Point, AlgorithmResult } from '../types';
import { bfs } from './bfs';

/**
 * PLACEHOLDER: Greedy Best-First Search
 * In a real implementation, you would use a Priority Queue based solely on the Heuristic (h).
 * For now, we use BFS as a placeholder to demonstrate the project structure.
 */
export const greedy = (
  grid: CellType[][],
  start: Point,
  goal: Point
): AlgorithmResult => {
  // TODO: Implement actual Greedy Search logic here
  // 1. Use a Priority Queue (f = h)
  // 2. Implement Manhattan or Euclidean heuristic
  // 3. Generate frames for visualization
  
  return bfs(grid, start, goal);
};
