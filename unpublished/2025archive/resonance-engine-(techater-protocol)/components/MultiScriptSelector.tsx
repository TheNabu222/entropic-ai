import React from 'react';
import type { Script } from '../constants';

interface MultiScriptSelectorProps {
  id: string;
  label: string;
  scripts: Script[];
  selectedScripts: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
}

const MultiScriptSelector: React.FC<MultiScriptSelectorProps> = ({ id, label, scripts, selectedScripts, onChange, disabled = false }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    onChange(value);
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-bold mb-1">
        {label}
      </label>
      <select
        id={id}
        multiple
        value={selectedScripts}
        onChange={handleChange}
        disabled={disabled}
        className="w-full h-32 box-inset p-2.5 font-garamond text-lg disabled:bg-stone-800/50 disabled:cursor-not-allowed"
        aria-label={label}
      >
        {scripts.map((script) => (
          <option key={script.value} value={script.value} className="p-1 font-garamond">
            {script.label}
          </option>
        ))}
      </select>
      <p className="text-xs mt-1 font-garamond">Hold Ctrl/Cmd to select multiple languages.</p>
    </div>
  );
};

export default MultiScriptSelector;