
import React, { useState, useRef, useEffect } from 'react';

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
  minWidth = 200,
  minHeight = 150,
  zIndex = 10,
  onFocus,
  isActive = true,
  resizable = true
}) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  
  const getInitialPos = () => {
    if (isMobile) return { x: 5, y: 45 };
    return { x: initialX, y: initialY };
  };

  const [position, setPosition] = useState(getInitialPos());
  const [size, setSize] = useState({ 
    width: typeof initialWidth === 'number' ? initialWidth : (isMobile ? window.innerWidth - 10 : 400), 
    height: typeof initialHeight === 'number' ? initialHeight : 'auto' 
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number) => {
    onFocus?.();
    setIsDragging(true);
    dragStart.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPosition({
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y,
    });
  };

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onFocus?.();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const currentW = contentRef.current?.offsetWidth || (typeof size.width === 'number' ? size.width : minWidth);
    const currentH = contentRef.current?.parentElement?.offsetHeight || minHeight;

    setIsResizing(true);
    resizeStart.current = {
      x: clientX,
      y: clientY,
      w: currentW,
      h: typeof currentH === 'number' ? currentH : minHeight
    };
  };

  const handleResizeMove = (clientX: number, clientY: number) => {
    if (!isResizing) return;
    const dx = clientX - resizeStart.current.x;
    const dy = clientY - resizeStart.current.y;
    
    setSize({
      width: Math.max(minWidth, resizeStart.current.w + dx),
      height: Math.max(minHeight, resizeStart.current.h + dy)
    });
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX, e.clientY);
      if (isResizing) handleResizeMove(e.clientX, e.clientY);
    };
    const onUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, isResizing]);

  return (
    <div
      className={`win98-border win98-window absolute flex flex-col shadow-xl overflow-hidden`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
        maxHeight: 'calc(100dvh - 50px)'
      }}
      onMouseDown={() => onFocus?.()}
    >
      <div
        className={`title-bar ${!isActive ? 'inactive' : ''} cursor-move flex items-center justify-between px-1 shrink-0 select-none`}
        style={{ height: '28px' }}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      >
        <div className="flex items-center gap-1 overflow-hidden pointer-events-none">
          <span className="text-[12px] truncate whitespace-nowrap font-bold tracking-wide">{title}</span>
        </div>
        <div className="flex gap-1 shrink-0">
          <button className="win98-button w-5 h-5 text-[10px] font-bold pb-1 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>_</button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose?.(); }}
            className="win98-button w-5 h-5 text-[12px] font-bold flex items-center justify-center pb-0.5"
          >
            ×
          </button>
        </div>
      </div>
      
      <div ref={contentRef} className="p-1 overflow-auto bg-[#c0c0c0] flex-grow text-[12px] win98-content flex flex-col relative">
        {children}
        
        {resizable && !isMobile && (
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
            onMouseDown={handleResizeStart}
          >
             <div className="w-full h-full" style={{
               background: `linear-gradient(135deg, transparent 50%, #808080 50%)`,
               clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
               opacity: 0.5
             }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Window;
