import React, { useState, useCallback } from 'react';
import { ZettelInput } from './components/ZettelInput';
import { ZettelTree } from './components/ZettelTree';
import { ZettelGraph } from './components/ZettelGraph';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { processZettelsLocally } from './services/localZettelProcessor';
import { SAMPLE_DATA } from './constants';
import { NabuArchive } from './components/NabuArchive';

export default function App() {
  const [viewMode, setViewMode] = useState<'classic' | 'archive'>('classic');
  const [rawText, setRawText] = useState('');
  const [zettelTree, setZettelTree] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visualizationMode, setVisualizationMode] = useState<'tree' | 'graph'>('tree');

  const handleProcess = useCallback(async () => {
    if (!rawText.trim()) {
      setError('Please paste your Zettelkasten notes first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setZettelTree(null);

    try {
      const result = await processZettelsLocally(rawText);
      setZettelTree(result);
    } catch (err) {
      console.error(err);
      setError(
        'Failed to process notes. There might be an issue with the input format. Please check the console for details.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [rawText]);

  const loadSampleData = useCallback(() => {
    setRawText(SAMPLE_DATA);
    setError(null);
  }, []);

  if (viewMode === 'archive') {
    return (
      <div className="relative">
        <button 
          onClick={() => setViewMode('classic')}
          className="fixed bottom-4 right-4 z-[100] px-4 py-2 bg-gray-800 text-gray-300 rounded-full border border-gray-600 hover:bg-gray-700 shadow-lg text-xs font-mono"
        >
          Return to Classic Sorter
        </button>
        <NabuArchive />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header />
      
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={() => setViewMode('archive')}
          className="px-4 py-2 bg-indigo-600/20 text-indigo-300 rounded-full border border-indigo-500/50 hover:bg-indigo-600/40 shadow-lg text-xs font-mono flex items-center gap-2"
        >
          <span>☥</span> Enter Nabu Archive
        </button>
      </div>

      <main className="flex-grow flex flex-col lg:flex-row p-4 gap-4">
        <div className="lg:w-1/2 flex flex-col h-[calc(100vh-100px)]">
          <ZettelInput
            rawText={rawText}
            setRawText={setRawText}
            onProcess={handleProcess}
            onLoadSample={loadSampleData}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:w-1/2 flex flex-col h-[calc(100vh-100px)] bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b-2 border-gray-600 pb-2">
            <h2 className="text-xl font-bold text-indigo-400">
              Organized Zettelkasten View
            </h2>
            <div className="flex gap-2">
                <button
                    onClick={() => setVisualizationMode('tree')}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${visualizationMode === 'tree' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                >
                    Tree
                </button>
                <button
                    onClick={() => setVisualizationMode('graph')}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${visualizationMode === 'graph' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                >
                    Graph
                </button>
            </div>
          </div>
          
          <div className="flex-grow overflow-hidden relative">
            {isLoading && <Loader />}
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
            {!isLoading && !error && !zettelTree && (
              <div className="text-center text-gray-400 mt-10">
                <p className="text-lg">Your organized Zettelkasten will appear here.</p>
                <p className="mt-2">Paste your notes, or load the sample data, and click "Organize".</p>
              </div>
            )}
            {zettelTree && (
                <div className="h-full w-full overflow-auto pr-2">
                    {visualizationMode === 'tree' ? (
                        <ZettelTree nodes={zettelTree} />
                    ) : (
                        <ZettelGraph nodes={zettelTree} />
                    )}
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}