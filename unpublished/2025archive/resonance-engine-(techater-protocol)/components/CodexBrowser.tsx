import React from 'react';
import { codexEntries } from '../codexData';

interface CodexBrowserProps {
  selectedEntry: string;
  onSelect: (entryTitle: string) => void;
}

const CodexBrowser: React.FC<CodexBrowserProps> = ({ selectedEntry, onSelect }) => {
  const entries = Object.keys(codexEntries);

  return (
    <div>
      <label htmlFor="codex-selector" className="block text-sm font-bold mb-1">
        Browse Codex Entries
      </label>
      <select
        id="codex-selector"
        value={selectedEntry}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full box-inset p-2.5 font-garamond text-lg"
      >
        {entries.map((title) => (
          <option key={title} value={title} className="font-garamond">
            {title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CodexBrowser;