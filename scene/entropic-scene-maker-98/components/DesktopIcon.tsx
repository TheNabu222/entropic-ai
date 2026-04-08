
import React from 'react';

interface DesktopIconProps {
  label: string;
  icon: string;
  onClick: () => void;
  x?: number;
  y?: number;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ label, icon, onClick, x, y }) => {
  return (
    <div
      className="relative flex flex-col items-center w-20 p-2 cursor-pointer group select-none mb-4"
      onClick={onClick}
    >
      <div className="w-10 h-10 mb-1 flex items-center justify-center group-active:opacity-75 transition-transform group-hover:scale-110">
        <span className="text-4xl filter drop-shadow-md">{icon}</span>
      </div>
      <span className="text-white text-[11px] text-center font-bold leading-tight drop-shadow-[1px_1px_rgba(0,0,0,0.8)] px-1 group-active:bg-blue-800 group-active:text-white rounded-sm">
        {label}
      </span>
    </div>
  );
};

export default DesktopIcon;
