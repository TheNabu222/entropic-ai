'use client';

import { motion } from 'framer-motion';
import { FileText, AlertTriangle, FileWarning, Folder, Clock, TrendingUp } from 'lucide-react';

interface StatsData {
  totalPages: number;
  orphanCount: number;
  stubCount: number;
  categories: { name: string; count: number }[];
  lastScan?: string;
}

interface StatsPanelProps {
  stats: StatsData | null;
  isLoading?: boolean;
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color = 'cyan',
  delay = 0 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: number | string; 
  color?: string;
  delay?: number;
}) {
  const colorClasses: Record<string, string> = {
    cyan: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5',
    red: 'text-red-400 border-red-400/30 bg-red-400/5',
    yellow: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
    green: 'text-green-400 border-green-400/30 bg-green-400/5',
    purple: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`panel p-4 ${colorClasses[color] ?? colorClasses.cyan}`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-8 h-8" />
        <div>
          <p className="text-2xl font-bold font-mono">{value}</p>
          <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function StatsPanel({ stats, isLoading }: StatsPanelProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="panel p-4 animate-pulse">
            <div className="h-12 bg-gray-700/50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="panel p-6 text-center text-gray-400">
        <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Run a site scan to see statistics</p>
      </div>
    );
  }

  const healthPercent = stats.totalPages > 0 
    ? Math.round(((stats.totalPages - stats.orphanCount - stats.stubCount) / stats.totalPages) * 100)
    : 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={FileText} 
          label="Total Pages" 
          value={stats.totalPages} 
          color="cyan" 
          delay={0} 
        />
        <StatCard 
          icon={AlertTriangle} 
          label="Orphan Pages" 
          value={stats.orphanCount} 
          color="red" 
          delay={0.1} 
        />
        <StatCard 
          icon={FileWarning} 
          label="Stub Pages" 
          value={stats.stubCount} 
          color="yellow" 
          delay={0.2} 
        />
        <StatCard 
          icon={Folder} 
          label="Categories" 
          value={stats.categories?.length ?? 0} 
          color="purple" 
          delay={0.3} 
        />
      </div>

      {/* Health Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="panel p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Site Health</span>
          <span className={`text-lg font-bold ${
            healthPercent > 80 ? 'text-green-400' : 
            healthPercent > 50 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {healthPercent}%
          </span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${healthPercent}%` }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className={`h-full rounded-full ${
              healthPercent > 80 ? 'bg-gradient-to-r from-green-500 to-cyan-400' : 
              healthPercent > 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' : 
              'bg-gradient-to-r from-red-500 to-pink-400'
            }`}
          />
        </div>
      </motion.div>

      {/* Categories */}
      {stats.categories?.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="panel p-4"
        >
          <h3 className="text-sm text-gray-400 mb-3 uppercase tracking-wide">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {stats.categories.map((cat) => (
              <span
                key={cat?.name ?? 'unknown'}
                className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs text-cyan-300"
              >
                {cat?.name ?? 'unknown'} ({cat?.count ?? 0})
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Last Scan */}
      {stats.lastScan && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Last scan: {new Date(stats.lastScan).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
