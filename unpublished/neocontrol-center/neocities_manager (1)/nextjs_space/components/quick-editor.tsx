'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RefreshCw, ExternalLink, Code, Eye, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-900 animate-pulse rounded" />
});

interface QuickEditorProps {
  isOpen: boolean;
  onClose: () => void;
  file: { path: string } | null;
}

export default function QuickEditor({ isOpen, onClose, file }: QuickEditorProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (file?.path && isOpen) {
      fetchContent();
    }
  }, [file?.path, isOpen]);

  const fetchContent = async () => {
    if (!file?.path) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/neocities/content?path=${encodeURIComponent(file.path)}`);
      const data = await res.json();
      
      if (data?.success) {
        setContent(data?.content ?? '');
      } else {
        toast.error(data?.error ?? 'Failed to fetch content');
      }
    } catch (error) {
      toast.error('Failed to load file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!file?.path) return;
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/neocities/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upload',
          path: file.path.startsWith('/') ? file.path.slice(1) : file.path,
          content
        })
      });
      
      const data = await res.json();
      
      if (data?.success) {
        toast.success('File saved successfully!');
      } else {
        toast.error(data?.error ?? 'Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  const getLanguage = (path: string): string => {
    const ext = path?.split('.')?.pop()?.toLowerCase() ?? '';
    switch (ext) {
      case 'html':
      case 'htm':
        return 'html';
      case 'css':
        return 'css';
      case 'js':
        return 'javascript';
      case 'json':
        return 'json';
      default:
        return 'plaintext';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-6xl h-[85vh] panel flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-cyan-500/30 bg-cyan-500/5">
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-cyan-400 font-mono">
                  {file?.path ?? 'Editor'}
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-1.5 rounded flex items-center gap-2 text-sm transition-all ${
                    showPreview 
                      ? 'bg-cyan-500 text-black' 
                      : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                
                <button
                  onClick={fetchContent}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2 text-sm transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                
                <a
                  href={`https://coaiexist.wtf${file?.path ?? ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded flex items-center gap-2 text-sm transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open
                </a>
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-green-500 hover:bg-green-400 text-black font-bold rounded flex items-center gap-2 text-sm transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-red-500/20 text-red-400 rounded transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Editor */}
              <div className={`flex-1 ${showPreview ? 'border-r border-gray-700' : ''}`}>
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  </div>
                ) : (
                  <MonacoEditor
                    height="100%"
                    language={getLanguage(file?.path ?? '')}
                    value={content}
                    onChange={(value) => setContent(value ?? '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                )}
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="flex-1 bg-white">
                  <iframe
                    srcDoc={content}
                    title="Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
