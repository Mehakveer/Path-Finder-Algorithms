import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Award, Timer, Zap as ZapIcon, Route, Layers, ShieldCheck, TrendingDown, Activity } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { AlgorithmType, AlgorithmResult, ALGO_COLORS } from '../types';

interface DashboardProps {
  onBack: () => void;
  results: Partial<Record<AlgorithmType, AlgorithmResult>>;
  gridSize: { rows: number; cols: number };
}

export const Dashboard: React.FC<DashboardProps> = ({ onBack, results, gridSize }) => {
  const totalCells = gridSize.rows * gridSize.cols;
  const chartData = Object.entries(results).map(([algo, res]) => {
    const algorithmResult = res as AlgorithmResult;
    return {
      name: algo,
      nodes: algorithmResult?.nodesExpanded || 0,
      path: algorithmResult?.pathLength || 0,
      time: parseFloat(algorithmResult?.execTimeMs?.toFixed(2) || '0'),
      coverage: parseFloat(((algorithmResult?.nodesExpanded || 0) / totalCells * 100).toFixed(1)),
      optimal: algo === 'BFS' || algo === 'A*',
      color: ALGO_COLORS[algo as AlgorithmType].hex,
    };
  });

  const validResults = chartData.filter(d => results[d.name as AlgorithmType]?.found);
  const bestTime = validResults.length ? Math.min(...validResults.map(d => d.time)) : 0;
  const bestNodes = validResults.length ? Math.min(...validResults.map(d => d.nodes)) : 0;
  const bestPath = validResults.length ? Math.min(...validResults.map(d => d.path)) : 0;

  const fastestAlgo = validResults.find(d => d.time === bestTime)?.name;
  const mostEfficientAlgo = validResults.find(d => d.nodes === bestNodes)?.name;
  const shortestPathAlgo = validResults.find(d => d.path === bestPath)?.name;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-xs font-bold text-[#e6edf3] mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-xs font-medium" style={{ color: p.color }}>
              {p.name === 'nodes' ? 'Nodes Expanded: ' : 
               p.name === 'path' ? 'Path Length: ' : 
               p.name === 'time' ? 'Time: ' : 
               p.name === 'coverage' ? 'Grid Coverage: ' : ''}
              <span className="font-mono font-bold ml-1">{p.value}</span>
              {p.name === 'time' ? 'ms' : p.name === 'coverage' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 bg-[#0d1117] p-8 overflow-y-auto custom-scrollbar"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-5">
            <button 
              onClick={onBack}
              className="group p-3 bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] rounded-xl transition-all text-[#8b949e] hover:text-[#58a6ff] shadow-lg"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-black text-[#e6edf3] tracking-tight">Performance Analytics</h1>
                <span className="px-2 py-0.5 bg-[#238636]/20 text-[#3fb950] text-[10px] font-black uppercase rounded border border-[#238636]/30">Live</span>
              </div>
              <p className="text-[#8b949e] text-sm font-medium">Deep-dive comparison of pathfinding heuristics and search strategies</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {chartData.map(d => (
                <div key={d.name} className={`w-8 h-8 rounded-full border-2 border-[#0d1117] ${ALGO_COLORS[d.name as AlgorithmType].primary} flex items-center justify-center text-[10px] font-bold text-white shadow-lg`} title={d.name}>
                  {d.name[0]}
                </div>
              ))}
            </div>
            <div className="h-8 w-px bg-[#30363d] mx-2" />
            <div className="text-right">
              <p className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">Grid Size</p>
              <p className="text-sm font-mono font-bold text-[#e6edf3]">{gridSize.rows} × {gridSize.cols}</p>
            </div>
          </div>
        </div>

        {/* Top Highlights - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-2 bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Trophy size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#f0c000]/10 rounded-2xl text-[#f0c000]">
                  <Award size={24} />
                </div>
                <h3 className="font-black text-lg uppercase tracking-tight text-[#e6edf3]">Performance Leaders</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest flex items-center gap-1">
                    <Timer size={12} className="text-[#ff7b72]" /> Fastest
                  </p>
                  <p className="text-xl font-black text-[#ff7b72]">{fastestAlgo || 'N/A'}</p>
                  <p className="text-[10px] text-[#8b949e] font-medium">{bestTime}ms</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest flex items-center gap-1">
                    <ZapIcon size={12} className="text-[#58a6ff]" /> Efficient
                  </p>
                  <p className="text-xl font-black text-[#58a6ff]">{mostEfficientAlgo || 'N/A'}</p>
                  <p className="text-[10px] text-[#8b949e] font-medium">{bestNodes} nodes</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest flex items-center gap-1">
                    <Route size={12} className="text-[#e3b341]" /> Shortest
                  </p>
                  <p className="text-xl font-black text-[#e3b341]">{shortestPathAlgo || 'N/A'}</p>
                  <p className="text-[10px] text-[#8b949e] font-medium">{bestPath} units</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 shadow-xl flex flex-col justify-center items-center text-center">
            <div className="p-4 bg-[#bc8cff]/10 rounded-full text-[#bc8cff] mb-4">
              <Layers size={32} />
            </div>
            <h3 className="font-bold text-[#e6edf3] mb-1">Avg. Coverage</h3>
            <p className="text-3xl font-black text-[#bc8cff]">
              {(chartData.reduce((acc, d) => acc + d.coverage, 0) / chartData.length).toFixed(1)}%
            </p>
            <p className="text-[10px] text-[#8b949e] font-medium mt-2 uppercase tracking-widest">Grid Explored</p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 shadow-xl flex flex-col justify-center items-center text-center">
            <div className="p-4 bg-[#3fb950]/10 rounded-full text-[#3fb950] mb-4">
              <ShieldCheck size={32} />
            </div>
            <h3 className="font-bold text-[#e6edf3] mb-1">Optimality</h3>
            <p className="text-3xl font-black text-[#3fb950]">
              {chartData.filter(d => d.optimal).length}/{chartData.length}
            </p>
            <p className="text-[10px] text-[#8b949e] font-medium mt-2 uppercase tracking-widest">Guaranteed Shortest</p>
          </div>
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Bar Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-[#58a6ff]">Search Efficiency</h3>
                <TrendingDown size={14} className="text-[#8b949e]" />
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis dataKey="name" stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="nodes" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ALGO_COLORS[entry.name as AlgorithmType].hex} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-[#ff7b72]">Execution Speed</h3>
                <Timer size={14} className="text-[#8b949e]" />
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis dataKey="name" stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="time" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ALGO_COLORS[entry.name as AlgorithmType].hex} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-[#e3b341]">Path Quality</h3>
                <Route size={14} className="text-[#8b949e]" />
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis dataKey="name" stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="path" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ALGO_COLORS[entry.name as AlgorithmType].hex} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-[#bc8cff]">Grid Coverage</h3>
                <Activity size={14} className="text-[#8b949e]" />
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis dataKey="name" stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="coverage" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ALGO_COLORS[entry.name as AlgorithmType].hex} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-3xl overflow-hidden shadow-2xl mb-12">
          <div className="px-8 py-6 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-[0.2em] text-[#e6edf3]">Comparative Analysis Matrix</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#3fb950]" />
                <span className="text-[10px] font-bold text-[#8b949e] uppercase">Optimal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#da3633]" />
                <span className="text-[10px] font-bold text-[#8b949e] uppercase">Heuristic</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-[#8b949e] bg-[#0d1117]/50">
                  <th className="px-8 py-5 font-black">Algorithm</th>
                  <th className="px-8 py-5 font-black text-center">Nodes Expanded</th>
                  <th className="px-8 py-5 font-black text-center">Path Length</th>
                  <th className="px-8 py-5 font-black text-center">Exec Time</th>
                  <th className="px-8 py-5 font-black text-center">Grid Coverage</th>
                  <th className="px-8 py-5 font-black text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                {chartData.map((data) => (
                  <tr key={data.name} className="hover:bg-[#21262d] transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${ALGO_COLORS[data.name as AlgorithmType].primary} flex items-center justify-center text-white font-black shadow-lg group-hover:scale-110 transition-transform`}>
                          {data.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#e6edf3]">{data.name}</p>
                          <p className="text-[10px] font-bold text-[#8b949e] uppercase tracking-tighter">
                            {data.optimal ? 'Guaranteed Optimal' : 'Greedy Heuristic'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="font-mono text-base font-black text-[#58a6ff]">{data.nodes}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="font-mono text-base font-black text-[#e3b341]">{data.path}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="font-mono text-base font-black text-[#ff7b72]">{data.time}</span>
                      <span className="text-[10px] text-[#8b949e] ml-1 font-bold">ms</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-mono text-base font-black text-[#bc8cff]">{data.coverage}%</span>
                        <div className="w-16 h-1 bg-[#30363d] rounded-full overflow-hidden">
                          <div className="h-full bg-[#bc8cff]" style={{ width: `${data.coverage}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${results[data.name as AlgorithmType]?.found ? 'bg-[#238636]/20 text-[#3fb950] border border-[#238636]/30' : 'bg-[#da3633]/20 text-[#f85149] border border-[#da3633]/30'}`}>
                          {results[data.name as AlgorithmType]?.found ? 'Success' : 'Failed'}
                        </span>
                        {data.optimal && results[data.name as AlgorithmType]?.found && (
                          <span className="text-[8px] font-bold text-[#3fb950] uppercase tracking-widest">Shortest Path Found</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
