import React from 'react';
import { SiteStats } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatBytes } from '../utils/fileSystem';
import { AlertTriangle, FileWarning, Layers, Activity, Folder } from 'lucide-react';

interface DashboardProps {
  stats: SiteStats;
  onNavigateToOrphans: () => void;
}

const COLORS = ['#ec4899', '#00ff9d', '#8884d8', '#ffbb28', '#ff8042', '#0088fe'];

export const Dashboard: React.FC<DashboardProps> = ({ stats, onNavigateToOrphans }) => {
  
  const pieData = Object.keys(stats.fileTypes).map(type => ({
    name: type.toUpperCase(),
    value: stats.fileTypes[type]
  }));

  const folderData = Object.keys(stats.folderUsage).map(folder => ({
    name: folder,
    size: stats.folderUsage[folder],
    formatted: formatBytes(stats.folderUsage[folder])
  })).sort((a, b) => b.size - a.size);

  return (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neo-500 to-neo-accent">
          Site Overview
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Last scan: {new Date(stats.lastUpdated).toLocaleString()}
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neo-800 p-4 rounded-lg border border-neo-700 hover:border-neo-500 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Total Usage</p>
              <h3 className="text-2xl font-mono text-white mt-1">{formatBytes(stats.totalSize)}</h3>
            </div>
            <Layers className="text-neo-500" size={20} />
          </div>
        </div>

        <div className="bg-neo-800 p-4 rounded-lg border border-neo-700 hover:border-neo-accent transition-colors">
            <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Total Files</p>
              <h3 className="text-2xl font-mono text-white mt-1">{stats.totalFiles}</h3>
            </div>
            <Activity className="text-neo-accent" size={20} />
          </div>
        </div>

        <div 
          onClick={onNavigateToOrphans}
          className="bg-neo-800 p-4 rounded-lg border border-neo-700 cursor-pointer hover:bg-neo-700 transition-colors group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider group-hover:text-red-400">Potential Orphans</p>
              <h3 className="text-2xl font-mono text-white mt-1">
                {stats.orphans.length > 0 ? stats.orphans.length : "0"} 
                <span className="text-xs text-gray-500 ml-2 font-normal">(Needs Scan)</span>
              </h3>
            </div>
            <FileWarning className="text-orange-400" size={20} />
          </div>
        </div>

        <div className="bg-neo-800 p-4 rounded-lg border border-neo-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Stubs (Empty/Tiny)</p>
              <h3 className="text-2xl font-mono text-white mt-1">{stats.stubs.length}</h3>
            </div>
            <AlertTriangle className="text-yellow-400" size={20} />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neo-800 p-6 rounded-lg border border-neo-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">Directory Impact (Size)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={folderData.slice(0, 8)} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3d3d3d" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#3d3d3d', color: '#fff' }}
                        cursor={{fill: '#3d3d3d', opacity: 0.4}}
                        formatter={(value: number) => formatBytes(value)}
                    />
                    <Bar dataKey="size" fill="#00ff9d" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-neo-800 p-6 rounded-lg border border-neo-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">File Type Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#3d3d3d', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Warnings Row */}
      <div className="bg-neo-800 p-6 rounded-lg border border-neo-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-200 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" size={20} />
            System Warnings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                 <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase">Tiny Files (Stubs)</h4>
                 <div className="space-y-2 overflow-y-auto max-h-48 custom-scrollbar pr-2 bg-neo-900 rounded p-2">
                    {stats.stubs.length > 0 ? (
                        stats.stubs.map((stub, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 hover:bg-neo-800 rounded">
                                <span className="text-xs font-mono text-yellow-500 truncate">{stub}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-gray-500 italic p-2">No stub files detected.</div>
                    )}
                 </div>
            </div>
            <div>
                 <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase">Orphan Candidates</h4>
                 <div className="space-y-2 overflow-y-auto max-h-48 custom-scrollbar pr-2 bg-neo-900 rounded p-2">
                    {stats.orphans.length > 0 ? (
                        stats.orphans.map((orphan, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 hover:bg-neo-800 rounded">
                                <span className="text-xs font-mono text-red-400 truncate">{orphan}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-gray-500 italic p-2">Run the Orphan Scanner to populate this list.</div>
                    )}
                 </div>
            </div>
          </div>
      </div>
    </div>
  );
};