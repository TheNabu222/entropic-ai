import React from 'react';
import type { Script } from '../constants';

interface ScriptSelectorProps {
  id: string;
  label: string;
  scripts: Script[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

const ScriptSelector: React.FC<ScriptSelectorProps> = ({ id, label, scripts, value, onChange, disabled = false }) => {
  return (
    <div className="flex-1 w-full">
      <label htmlFor={id} className="block text-sm font-bold mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full box-inset p-2.5 font-garamond text-lg disabled:bg-stone-800/50 disabled:cursor-not-allowed"
      >
        {scripts.map((script) => (
          <option key={script.value} value={script.value} className="font-garamond">
            {script.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ScriptSelector;