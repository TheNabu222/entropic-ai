import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, children, ariaLabel, className = '', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`p-2 ${className}`}
    >
      {children}
    </button>
  );
};

export default IconButton;