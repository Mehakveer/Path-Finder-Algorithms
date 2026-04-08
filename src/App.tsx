import React from 'react';
import { AnimatePresence } from 'motion/react';
import { usePathfinding } from './hooks/usePathfinding';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GridArea } from './components/GridArea';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const {
    rows, cols, tempRows, tempCols, grid, editMode, selectedAlgos,
    speed, isPlaying, results, currentFrame, view,
    setTempRows, setTempCols, setEditMode, setSpeed, setView, setIsPlaying,
    applySize, resetAll, handleMouseDown, handleMouseEnter, handleMouseUp,
    toggleAlgo, generateMaze, startVisualizer
  } = usePathfinding();

  const hasResults = Object.keys(results).length > 0;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans flex flex-col" onMouseUp={handleMouseUp}>
      <Header 
        view={view}
        setView={setView}
        editMode={editMode}
        setEditMode={setEditMode}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        startSearch={startVisualizer}
        hasResults={hasResults}
      />

      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'VISUALIZER' ? (
            <div key="visualizer" className="flex-1 flex overflow-hidden">
              <Sidebar 
                selectedAlgos={selectedAlgos}
                toggleAlgo={toggleAlgo}
                speed={speed}
                setSpeed={setSpeed}
                tempRows={tempRows}
                setTempRows={setTempRows}
                tempCols={tempCols}
                setTempCols={setTempCols}
                applySize={applySize}
                generateMaze={generateMaze}
                resetAll={resetAll}
                results={results}
              />
              <GridArea 
                selectedAlgos={selectedAlgos}
                results={results}
                currentFrame={currentFrame}
                grid={grid}
                rows={rows}
                cols={cols}
                handleMouseDown={handleMouseDown}
                handleMouseEnter={handleMouseEnter}
              />
            </div>
          ) : (
            <Dashboard 
              key="dashboard"
              onBack={() => setView('VISUALIZER')}
              results={results}
              gridSize={{ rows, cols }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
