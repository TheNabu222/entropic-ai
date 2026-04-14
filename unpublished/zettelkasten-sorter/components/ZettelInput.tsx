import React, { useRef } from 'react';

export function ZettelInput({ rawText, setRawText, onProcess, onLoadSample, isLoading }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setRawText(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-indigo-400 border-b-2 border-gray-600 pb-2">Your Notes</h2>
      <textarea
        className="w-full flex-grow bg-gray-900 text-gray-300 p-4 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 resize-none font-mono text-sm"
        placeholder="Paste your Zettelkasten notes here..."
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        spellCheck="false"
      />
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <button
          onClick={onProcess}
          disabled={isLoading || !rawText.trim()}
          className="flex-grow justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition duration-200 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
             <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1h12V3a1 1 0 00-1-1H5zM4 6v10a2 2 0 002 2h8a2 2 0 002-2V6H4zm3 5a1 1 0 001 1h2a1 1 0 100-2H8a1 1 0 00-1 1z" clipRule="evenodd" />
                </svg>
                Organize
            </>
          )}
        </button>
        <button
          onClick={onLoadSample}
          disabled={isLoading}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed transition duration-200"
        >
          Load Sample
        </button>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.md"
        />
        <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed transition duration-200 flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Upload
        </button>
      </div>
    </div>
  );
}