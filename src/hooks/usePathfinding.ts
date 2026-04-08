import { useState, useEffect, useCallback } from 'react';
import { CellType, Point, AlgorithmResult, AlgorithmType } from '../types';
import { runAlgorithm } from '../algorithms';

const DEFAULT_ROWS = 20;
const DEFAULT_COLS = 30;

export const usePathfinding = () => {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [tempRows, setTempRows] = useState(DEFAULT_ROWS);
  const [tempCols, setTempCols] = useState(DEFAULT_COLS);
  const [grid, setGrid] = useState<CellType[][]>(() => 
    Array.from({ length: DEFAULT_ROWS }, () => Array(DEFAULT_COLS).fill(CellType.EMPTY))
  );
  const [start, setStart] = useState<Point>({ r: 5, c: 5 });
  const [goal, setGoal] = useState<Point>({ r: 15, c: 25 });
  const [editMode, setEditMode] = useState<'WALL' | 'ERASE' | 'START' | 'GOAL'>('WALL');
  const [selectedAlgos, setSelectedAlgos] = useState<AlgorithmType[]>(['BFS']);
  const [speed, setSpeed] = useState<number>(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [results, setResults] = useState<Partial<Record<AlgorithmType, AlgorithmResult>>>({});
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [view, setView] = useState<'VISUALIZER' | 'DASHBOARD'>('VISUALIZER');

  // Sync grid with start/goal positions and handle resizing
  useEffect(() => {
    setGrid(prev => {
      if (prev.length !== rows || (prev[0] && prev[0].length !== cols)) {
        const newGrid = Array.from({ length: rows }, () => Array(cols).fill(CellType.EMPTY));
        if (newGrid[start.r] && newGrid[start.r][start.c] !== undefined) {
          newGrid[start.r][start.c] = CellType.START;
        }
        if (newGrid[goal.r] && newGrid[goal.r][goal.c] !== undefined) {
          newGrid[goal.r][goal.c] = CellType.GOAL;
        }
        return newGrid;
      }

      const next = prev.map(row => row.map(cell => 
        (cell === CellType.START || cell === CellType.GOAL) ? CellType.EMPTY : cell
      ));

      if (next[start.r] && next[start.r][start.c] !== undefined) {
        next[start.r][start.c] = CellType.START;
      }
      if (next[goal.r] && next[goal.r][goal.c] !== undefined) {
        next[goal.r][goal.c] = CellType.GOAL;
      }
      return next;
    });
  }, [start, goal, rows, cols]);

  // Ensure start and goal are always within bounds
  useEffect(() => {
    const safeStart = { 
      r: Math.max(0, Math.min(start.r, rows - 1)), 
      c: Math.max(0, Math.min(start.c, cols - 1)) 
    };
    const safeGoal = { 
      r: Math.max(0, Math.min(goal.r, rows - 1)), 
      c: Math.max(0, Math.min(goal.c, cols - 1)) 
    };
    
    if (safeStart.r !== start.r || safeStart.c !== start.c) {
      setStart(safeStart);
    }
    if (safeGoal.r !== goal.r || safeGoal.c !== goal.c) {
      setGoal(safeGoal);
    }
  }, [rows, cols]);

  // Animation loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const maxFrames = Math.max(...Object.values(results).map(r => (r as AlgorithmResult)?.frames?.length || 0));
    
    if (isPlaying && maxFrames > 0 && currentFrame < maxFrames - 1) {
      timer = setTimeout(() => {
        setCurrentFrame(prev => prev + 1);
      }, speed);
    } else if (currentFrame >= maxFrames - 1 && maxFrames > 0) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, results, currentFrame, speed]);

  const applySize = () => {
    setIsPlaying(false);
    setResults({});
    setCurrentFrame(0);
    setRows(tempRows);
    setCols(tempCols);
  };

  const resetAll = () => {
    setIsPlaying(false);
    setResults({});
    setCurrentFrame(0);
    setRows(DEFAULT_ROWS);
    setCols(DEFAULT_COLS);
    setTempRows(DEFAULT_ROWS);
    setTempCols(DEFAULT_COLS);
    setStart({ r: 5, c: 5 });
    setGoal({ r: 15, c: 25 });
    setSpeed(2);
    setSelectedAlgos(['BFS']);
    setGrid(Array.from({ length: DEFAULT_ROWS }, () => Array(DEFAULT_COLS).fill(CellType.EMPTY)));
  };

  const handleCellInteraction = useCallback((r: number, c: number) => {
    if (isPlaying) return;

    setGrid(prev => {
      const next = prev.map(row => [...row]);
      const current = next[r][c];

      if (editMode === 'START') {
        if (current !== CellType.GOAL && current !== CellType.WALL) {
          setStart({ r, c });
        }
      } else if (editMode === 'GOAL') {
        if (current !== CellType.START && current !== CellType.WALL) {
          setGoal({ r, c });
        }
      } else if (editMode === 'WALL') {
        if (current === CellType.EMPTY) {
          next[r][c] = CellType.WALL;
        }
      } else if (editMode === 'ERASE') {
        if (current === CellType.WALL) {
          next[r][c] = CellType.EMPTY;
        }
      }
      return next;
    });
    setResults({});
  }, [editMode, isPlaying]);

  const handleMouseDown = (r: number, c: number) => {
    setIsMouseDown(true);
    handleCellInteraction(r, c);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (isMouseDown) {
      handleCellInteraction(r, c);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const toggleAlgo = (algo: AlgorithmType) => {
    setSelectedAlgos(prev => {
      if (prev.includes(algo)) {
        if (prev.length === 1) return prev;
        return prev.filter(a => a !== algo);
      }
      return [...prev, algo];
    });
  };

  const generateMaze = () => {
    setIsPlaying(false);
    setResults({});
    setCurrentFrame(0);
    const newGrid = Array.from({ length: rows }, () => Array(cols).fill(CellType.EMPTY));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if ((r === start.r && c === start.c) || (r === goal.r && c === goal.c)) continue;
        if (Math.random() < 0.3) {
          newGrid[r][c] = CellType.WALL;
        }
      }
    }
    setGrid(newGrid);
  };

  const startVisualizer = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setCurrentFrame(0);
    const newResults: Partial<Record<AlgorithmType, AlgorithmResult>> = {};
    selectedAlgos.forEach(algo => {
      newResults[algo] = runAlgorithm(algo, grid, start, goal);
    });
    setResults(newResults);
    setIsPlaying(true);
  };

  return {
    rows, cols, tempRows, tempCols, grid, start, goal, editMode, selectedAlgos,
    speed, isPlaying, results, currentFrame, isMouseDown, view,
    setTempRows, setTempCols, setEditMode, setSpeed, setView, setIsPlaying,
    applySize, resetAll, handleMouseDown, handleMouseEnter, handleMouseUp,
    toggleAlgo, generateMaze, startVisualizer
  };
};
