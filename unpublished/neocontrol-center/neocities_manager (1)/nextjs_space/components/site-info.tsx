'use client';

import { motion } from 'framer-motion';
import { Globe, Eye, MousePointer, Calendar, Tag, ExternalLink } from 'lucide-react';

interface SiteInfoData {
  sitename: string;
  views: number;
  hits: number;
  created_at: string;
  last_updated: string;
  domain?: string;
  tags: string[];
}

interface SiteInfoProps {
  info: SiteInfoData | null;
  isLoading?: boolean;
}

export default function SiteInfo({ info, isLoading }: SiteInfoProps) {
  if (isLoading) {
    return (
      <div className="panel p-4 animate-pulse">
        <div className="h-20 bg-gray-700/50 rounded" />
      </div>
    );
  }

  if (!info) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-cyan-500/30"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Site Name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {info?.domain ?? info?.sitename ?? 'Unknown Site'}
            </h1>
            <a
              href={`https://${info?.domain ?? `${info?.sitename}.neocities.org`}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              View live site
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-400">Views:</span>
            <span className="text-white font-bold">{info?.views?.toLocaleString() ?? 0}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MousePointer className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400">Hits:</span>
            <span className="text-white font-bold">{info?.hits?.toLocaleString() ?? 0}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-green-400" />
            <span className="text-gray-400">Updated:</span>
            <span className="text-white">
              {info?.last_updated ? new Date(info.last_updated).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        {/* Tags */}
        {info?.tags?.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-yellow-400" />
            <div className="flex flex-wrap gap-1">
              {info.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
