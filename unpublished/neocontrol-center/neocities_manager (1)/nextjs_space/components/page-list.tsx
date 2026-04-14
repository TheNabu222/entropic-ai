'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, AlertTriangle, FileWarning, ExternalLink, 
  Edit, Trash2, Eye, ChevronRight, Filter
} from 'lucide-react';

interface PageData {
  id: string;
  path: string;
  filename: string;
  directory: string;
  category: string;
  isOrphan: boolean;
  isStub: boolean;
  wordCount: number;
  inboundLinks: number;
  title?: string;
  lastScanned?: string;
}

interface PageListProps {
  pages: PageData[];
  onEdit?: (page: PageData) => void;
  onPreview?: (page: PageData) => void;
  onDelete?: (page: PageData) => void;
  filter?: 'all' | 'orphans' | 'stubs';
  onFilterChange?: (filter: 'all' | 'orphans' | 'stubs') => void;
}

export default function PageList({ 
  pages, 
  onEdit, 
  onPreview, 
  onDelete,
  filter = 'all',
  onFilterChange 
}: PageListProps) {
  const [sortBy, setSortBy] = useState<'path' | 'wordCount' | 'inboundLinks'>('path');
  const [sortAsc, setSortAsc] = useState(true);

  const filteredPages = (pages ?? []).filter((page) => {
    if (filter === 'orphans') return page?.isOrphan;
    if (filter === 'stubs') return page?.isStub;
    return true;
  });

  const sortedPages = [...filteredPages].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'path') {
      comparison = (a?.path ?? '').localeCompare(b?.path ?? '');
    } else if (sortBy === 'wordCount') {
      comparison = (a?.wordCount ?? 0) - (b?.wordCount ?? 0);
    } else if (sortBy === 'inboundLinks') {
      comparison = (a?.inboundLinks ?? 0) - (b?.inboundLinks ?? 0);
    }
    return sortAsc ? comparison : -comparison;
  });

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(newSortBy);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-gray-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filter:</span>
        </div>
        <div className="flex gap-2">
          {(['all', 'orphans', 'stubs'] as const).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange?.(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-cyan-500 text-black'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {f === 'all' && `All (${pages?.length ?? 0})`}
              {f === 'orphans' && (
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Orphans ({pages?.filter(p => p?.isOrphan)?.length ?? 0})
                </span>
              )}
              {f === 'stubs' && (
                <span className="flex items-center gap-1">
                  <FileWarning className="w-3 h-3" />
                  Stubs ({pages?.filter(p => p?.isStub)?.length ?? 0})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-cyan-400"
                  onClick={() => handleSort('path')}
                >
                  <span className="flex items-center gap-1">
                    Path
                    {sortBy === 'path' && <ChevronRight className={`w-3 h-3 transition-transform ${sortAsc ? 'rotate-90' : '-rotate-90'}`} />}
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-cyan-400"
                  onClick={() => handleSort('wordCount')}
                >
                  <span className="flex items-center gap-1">
                    Words
                    {sortBy === 'wordCount' && <ChevronRight className={`w-3 h-3 transition-transform ${sortAsc ? 'rotate-90' : '-rotate-90'}`} />}
                  </span>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-cyan-400"
                  onClick={() => handleSort('inboundLinks')}
                >
                  <span className="flex items-center gap-1">
                    Inbound
                    {sortBy === 'inboundLinks' && <ChevronRight className={`w-3 h-3 transition-transform ${sortAsc ? 'rotate-90' : '-rotate-90'}`} />}
                  </span>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {sortedPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No pages found</p>
                  </td>
                </tr>
              ) : (
                sortedPages.map((page, index) => (
                  <motion.tr
                    key={page?.id ?? index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-cyan-500/5 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-mono text-gray-200 truncate max-w-xs">
                            {page?.path ?? 'Unknown'}
                          </p>
                          {page?.title && (
                            <p className="text-xs text-gray-500 truncate max-w-xs">{page.title}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {page?.isOrphan && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Orphan
                          </span>
                        )}
                        {page?.isStub && (
                          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded flex items-center gap-1">
                            <FileWarning className="w-3 h-3" />
                            Stub
                          </span>
                        )}
                        {!page?.isOrphan && !page?.isStub && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                            Healthy
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {page?.wordCount?.toLocaleString() ?? 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {page?.inboundLinks ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onPreview?.(page)}
                          className="p-1.5 hover:bg-cyan-500/20 text-cyan-400 rounded"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit?.(page)}
                          className="p-1.5 hover:bg-purple-500/20 text-purple-400 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <a
                          href={`https://coaiexist.wtf${page?.path ?? ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-green-500/20 text-green-400 rounded"
                          title="Open in browser"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
