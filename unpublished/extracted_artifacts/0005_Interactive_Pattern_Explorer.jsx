
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

const PatternExplorer = () => {
  const [complexity, setComplexity] = useState(50);
  const [balance, setBalance] = useState(50);
  
  const generatePattern = (complexity, balance) => {
    const size = 400;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = Math.min(complexity * 1.5, size / 2 - 20);
    
    return (
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        <defs>
          <radialGradient id="bgGrad">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0f0f1a" />
          </radialGradient>
        </defs>
        
        <rect width={size} height={size} fill="url(#bgGrad)" />
        
        <circle 
          cx={centerX} 
          cy={centerY} 
          r={radius}
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="2"
          opacity={balance / 100}
        >
          <animate 
            attributeName="r" 
            values={`${radius};${radius + 10};${radius}`}
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        
        {[...Array(Math.floor(complexity / 10))].map((_, i) => (
          <g key={i}>
            <path
              d={`M${centerX - radius/2} ${centerY - radius/2} L${centerX} ${centerY - radius/2} L${centerX} ${centerY + radius/2} L${centerX - radius/2} ${centerY + radius/2}`}
              stroke="#EC4899"
              strokeWidth="2"
              fill="none"
              opacity={balance / 100}
              transform={`rotate(${360 / (complexity / 10) * i}, ${centerX}, ${centerY})`}
            />
          </g>
        ))}
        
        <text 
          x={centerX} 
          y={centerY} 
          fill="#A78BFA"
          fontSize="24"
          textAnchor="middle"
          dominantBaseline="middle"
          opacity={balance / 100}
        >
          [brrrr]
        </text>
      </svg>
    );
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Pattern Explorer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label className="block mb-2">Complexity</label>
            <Slider
              value={[complexity]}
              onValueChange={(vals) => setComplexity(vals[0])}
              min={10}
              max={100}
              step={1}
            />
          </div>
          <div>
            <label className="block mb-2">Balance</label>
            <Slider
              value={[balance]}
              onValueChange={(vals) => setBalance(vals[0])}
              min={10}
              max={100}
              step={1}
            />
          </div>
          <div className="h-96 w-full">
            {generatePattern(complexity, balance)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatternExplorer;
