
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  initialX?: number;
  initialY?: number;
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  minHeight?: number;
  zIndex?: number;
  onFocus?: () => void;
  isActive?: boolean;
  resizable?: boolean;
}

const Window: React.FC<WindowProps> = ({
  title,
  children,
  onClose,
  initialX = 50,
  initialY = 50,
  width: initialWidth = 400,
  height: initialHeight = 'auto',
  minWidth = 300,
  minHeight = 200,
  zIndex = 10,
  onFocus,
  isActive = true,
  resizable = true
}) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ 
    width: typeof initialWidth === 'number' ? initialWidth : (isMobile ? window.innerWidth - 10 : 600), 
    height: typeof initialHeight === 'number' ? initialHeight : 450 
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    onFocus?.();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    // Removed e.preventDefault() as it can sometimes block focus/clicks on children in some browsers
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocus?.();
    setIsResizing(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      w: size.width,
      h: size.height
    };
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y,
        });
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        setSize({
          width: Math.max(minWidth, resizeStart.current.w + deltaX),
          height: Math.max(minHeight, resizeStart.current.h + deltaY)
        });
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, isResizing, minWidth, minHeight]);

  return (
    <div
      className="win98-border absolute flex flex-col shadow-2xl overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
        transition: isDragging || isResizing ? 'none' : 'z-index 0.1s',
        maxWidth: '100vw',
        maxHeight: 'calc(100vh - 40px)',
        pointerEvents: 'auto'
      }}
      onMouseDown={() => onFocus?.()}
    >
      {/* Title Bar */}
      <div
        className={`title-bar ${!isActive ? 'inactive' : ''} cursor-move px-1 shrink-0 select-none flex items-center h-7`}
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-grow">
          <div className="w-4 h-4 shrink-0 flex items-center justify-center bg-white/20 rounded-sm">⚡</div>
          <span className="text-[11px] truncate font-bold">{title}</span>
        </div>
        <div className="flex gap-1 shrink-0 ml-2">
          <button className="win98-button w-5 h-5 text-[10px] pb-1">_</button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose?.(); }}
            className="win98-button w-5 h-5 text-[12px] font-bold pb-0.5"
          >
            ×
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-grow overflow-hidden bg-gray-200 relative flex flex-col pointer-events-auto">
        {children}
        
        {/* Resize Handle */}
        {resizable && !isMobile && (
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 flex items-end justify-end p-0.5"
            onMouseDown={handleResizeStart}
          >
             <div className="w-3 h-3 border-r-2 border-b-2 border-gray-600 opacity-40"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Window;
