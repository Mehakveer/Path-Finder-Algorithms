/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CellType, Point, AlgorithmResult } from '../types';
import { bfs } from './bfs';

/**
 * PLACEHOLDER: DFS Algorithm
 * In a real implementation, you would use a Stack (LIFO) instead of a Queue (FIFO).
 * For now, we use BFS as a placeholder to demonstrate the project structure.
 */
export const dfs = (
  grid: CellType[][],
  start: Point,
  goal: Point
): AlgorithmResult => {
  // TODO: Implement actual Depth-First Search logic here
  // 1. Use a Stack for LIFO exploration
  // 2. Track visited nodes
  // 3. Generate frames for visualization
  
  return bfs(grid, start, goal);
};
