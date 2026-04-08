import React from 'react';
import { Zap, Activity, MousePointer2, Eraser, Target, Flag, Play, RotateCcw } from 'lucide-react';

interface HeaderProps {
  view: 'VISUALIZER' | 'DASHBOARD';
  setView: (view: 'VISUALIZER' | 'DASHBOARD') => void;
  editMode: 'WALL' | 'ERASE' | 'START' | 'GOAL';
  setEditMode: (mode: 'WALL' | 'ERASE' | 'START' | 'GOAL') => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  startSearch: () => void;
  hasResults: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  view, setView, editMode, setEditMode, isPlaying, setIsPlaying, startSearch, hasResults
}) => {
  return (
    <header className="h-16 border-b border-[#30363d] bg-[#161b22] px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#58a6ff] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Zap className="text-white fill-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Path Visualizer</h1>
          <p className="text-xs text-[#8b949e] font-medium uppercase tracking-wider">COMP 6721 • Intelligent Search</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {hasResults && (
          <button
            onClick={() => setView(view === 'VISUALIZER' ? 'DASHBOARD' : 'VISUALIZER')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#da3633] hover:bg-[#b62320] text-white text-sm font-bold transition-all shadow-md animate-pulse hover:animate-none"
            title={view === 'VISUALIZER' ? "View Performance Dashboard" : "Back to Visualizer"}
          >
            <Activity size={16} />
            <span className="hidden lg:inline">{view === 'VISUALIZER' ? 'Dashboard' : 'Visualizer'}</span>
          </button>
        )}
        <div className="flex bg-[#0d1117] rounded-lg p-1 border border-[#30363d]">
          {[
            { id: 'WALL', icon: MousePointer2, label: 'Wall' },
            { id: 'ERASE', icon: Eraser, label: 'Erase' },
            { id: 'START', icon: Target, label: 'Start' },
            { id: 'GOAL', icon: Flag, label: 'Goal' },
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setEditMode(tool.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
                editMode === tool.id 
                  ? 'bg-[#1f6feb] text-white shadow-md' 
                  : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#161b22]'
              }`}
              title={tool.label}
            >
              <tool.icon size={16} />
              <span className="text-sm font-medium hidden md:inline">{tool.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={isPlaying ? () => setIsPlaying(false) : startSearch}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${
            isPlaying 
              ? 'bg-[#da3633] hover:bg-[#f85149] text-white' 
              : 'bg-[#238636] hover:bg-[#2ea043] text-white shadow-lg shadow-green-500/20'
          }`}
        >
          {isPlaying ? <RotateCcw size={18} /> : <Play size={18} className="fill-current" />}
          {isPlaying ? 'Stop' : 'Start Search'}
        </button>
      </div>
    </header>
  );
};
