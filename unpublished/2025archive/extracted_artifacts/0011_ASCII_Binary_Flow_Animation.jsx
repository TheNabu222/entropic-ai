import React, { useEffect, useRef } from 'react';

// themes: emptiness vs expectation, natural self-sufficiency, action through non-action
// visualization: Binary patterns that naturally erode and flow, demonstrating how emptiness enables movement

const AsciiBinaryFlow: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let width = 65;
        let height = 65;
        let grid: string[][] = [];
        let time = 0;
        let animationFrameId: number;
        
        // Initialize grid - emptying the mind of expectation
        function initGrid() {
            grid = [];
            for (let y = 0; y < height; y++) {
                let row = [];
                for (let x = 0; x < width; x++) {
                    row.push(' ');
                }
                grid.push(row);
            }
        }
        
        // Render grid
        function render() {
            let html = '';
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    html += grid[y][x];
                }
                html += '<br>';
            }
            canvas.innerHTML = html;
        }
        
        // Update grid
        function update() {
            initGrid(); // Clear grid
            
            // Create a rigid structure - perfectly centered
            const blockSize = 30;
            const blockX = Math.floor(width / 2 - blockSize / 2);
            const blockY = Math.floor(height / 2 - blockSize / 2);
            
            // Time-based flow with slower motion (reduced to 2/3 speed)
            const t = time * 0.005;
            
            // Draw water flow around and through the structure
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    // Create block - structure yields to natural flow
                    if (x >= blockX && x < blockX + blockSize && 
                        y >= blockY && y < blockY + blockSize) {
                        // The block is gradually being eroded
                        const innerDist = Math.min(
                            x - blockX, 
                            blockX + blockSize - x,
                            y - blockY,
                            blockY + blockSize - y
                        );
                        
                        // Erosion from edge inward (slower)
                        const erosion = time * 0.0067;
                        if (innerDist > erosion) {
                            grid[y][x] = '1';
                        } else {
                            // Transition zone - less random
                            grid[y][x] = Math.random() > 0.8 ? '1' : '0';
                        }
                    } else {
                        // Water flow pattern - natural self-sufficiency in motion
                        const dx = x - width / 2;
                        const dy = y - height / 2;
                        const angle = Math.atan2(dy, dx);
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        // Create fluid pattern resembling water - smoother transitions
                        const wave = Math.sin(dist * 0.2 - t + angle * 1.5);
                        const flow = Math.sin(x * 0.08 + y * 0.04 + t * 0.4);
                        
                        // Use a threshold that creates less flickering
                        if (flow + wave > 0.4) {
                            grid[y][x] = '0';
                        } else if (flow + wave < -0.4) {
                            grid[y][x] = '~';
                        }
                    }
                }
            }
            
            // Add cracks to the block
            for (let i = 0; i < 5; i++) {
                const crackX = blockX + Math.floor(Math.random() * blockSize);
                const crackY = blockY + Math.floor(Math.random() * blockSize);
                const length = Math.floor(Math.random() * 10) + 5;
                let cx = Math.floor(crackX);
                let cy = Math.floor(crackY);
                
                for (let j = 0; j < length; j++) {
                    if (cx >= 0 && cx < width && cy >= 0 && cy < height) {
                        grid[cy][cx] = '0';
                    }
                    // Move in random direction
                    cx += Math.floor(Math.random() * 3) - 1;
                    cy += Math.floor(Math.random() * 3) - 1;
                }
            }
            
            time++;
        }
        
        function animate() {
            update();
            render();
            animationFrameId = requestAnimationFrame(animate);
        }
        
        initGrid();
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = 0;
            }
            
            if (canvas) {
                canvas.innerHTML = '';
            }
            
            grid = [];
            time = 0;
        };
    }, []);

    return (
        <div style={{ 
            margin: 0,
            background: '#F0EEE6',
            overflow: 'hidden',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
        }}>
            <div style={{
                padding: '30px',
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div 
                    ref={canvasRef}
                    style={{
                        lineHeight: '0.85',
                        letterSpacing: '0.05em',
                        color: 'rgba(0,0,0,0.85)',
                        userSelect: 'none',
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        marginLeft: '10%',
                    }}
                />
            </div>
        </div>
    );
};

export default AsciiBinaryFlow;