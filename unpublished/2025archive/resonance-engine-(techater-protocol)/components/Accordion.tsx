import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const ChevronIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-2 text-left text-2xl"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title}`}
      >
        <span>{title}</span>
        <ChevronIcon />
      </button>
      <div
        id={`accordion-content-${title}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100 pt-2' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;