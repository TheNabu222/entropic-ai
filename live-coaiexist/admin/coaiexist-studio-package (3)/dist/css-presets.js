// CSS Presets for COAIEXIST Studio - BEEFED UP EDITION

window.renderCssLibrary = () => {
    // LAYOUTS TAB - 24 presets
    const presets = [
        { name: '🪟 Windows 95', code: `background: #c0c0c0; border: 2px solid white; border-right-color: #404040; border-bottom-color: #404040; color: black; font-family: 'MS Sans Serif', sans-serif; box-shadow: 2px 2px 5px rgba(0,0,0,0.5); padding: 5px;` },
        { name: '🔮 Glassmorphism', code: `background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); border-radius: 16px; color: white;` },
        { name: '🟦 Neumorphism', code: `border-radius: 20px; background: #e0e0e0; box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff; border: none; color: #555;` },
        { name: '🤖 Cyberpunk', code: `border: 2px solid #f0f; box-shadow: 0 0 10px #f0f, inset 0 0 10px #f0f; background: rgba(20,0,30,0.9); color: #0ff; font-family: 'Orbitron', sans-serif; text-transform: uppercase;` },
        { name: '📝 Paper Note', code: `background: #fff9c4; color: #333; box-shadow: 5px 5px 15px rgba(0,0,0,0.2); transform: rotate(-2deg); border-radius: 2px; padding: 20px; font-family: 'Comic Sans MS', cursive;` },
        { name: '📟 Retro Terminal', code: `background: #000; color: #0f0; font-family: monospace; border: 2px solid #0f0; padding: 10px; box-shadow: inset 0 0 20px rgba(0, 255, 0, 0.2);` },
        { name: '🧱 Brutalist', code: `background: #fff; color: #000; border: 4px solid #000; font-family: 'Courier New', monospace; font-weight: bold; text-transform: uppercase; padding: 20px;` },
        { name: '🌴 Vaporwave', code: `background: linear-gradient(135deg, #ff71ce, #01cdfe, #05ffa1, #b967ff, #fffb96); color: #fff; font-family: 'MS Gothic', sans-serif; text-shadow: 2px 2px #ff00ff; padding: 20px;` },
        { name: '💿 Y2K Bubble', code: `background: linear-gradient(180deg, #87ceeb, #add8e6, #e0ffff); border-radius: 30px; border: 3px solid #fff; box-shadow: 0 10px 30px rgba(135,206,235,0.5), inset 0 -5px 20px rgba(255,255,255,0.8); color: #4169e1;` },
        { name: '🌊 Frutiger Aero', code: `background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(200,230,255,0.8)); border-radius: 15px; box-shadow: 0 8px 32px rgba(100,149,237,0.3); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.5); color: #1e90ff;` },
        { name: '💎 McBling', code: `background: linear-gradient(45deg, #ff69b4, #ff1493, #da70d6); border: 3px solid #ffd700; box-shadow: 0 0 20px #ff69b4, 0 0 40px #ffd700; color: #fff; font-family: 'Impact', sans-serif;` },
        { name: '📱 Skeuomorphic', code: `background: linear-gradient(180deg, #e8e8e8, #d0d0d0); border-radius: 10px; border: 1px solid #999; box-shadow: 0 4px 8px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.8), inset 0 -2px 0 rgba(0,0,0,0.1); color: #333;` },
        { name: '📐 Flat Design', code: `background: #3498db; color: #fff; border: none; border-radius: 4px; padding: 15px 25px; font-family: 'Helvetica Neue', sans-serif; box-shadow: none;` },
        { name: '🎨 Material Design', code: `background: #6200ee; color: #fff; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.14), 0 3px 4px rgba(0,0,0,0.12), 0 1px 5px rgba(0,0,0,0.2); font-family: 'Roboto', sans-serif;` },
        { name: '🔺 Memphis Design', code: `background: #fff; border: 3px solid #000; box-shadow: 8px 8px 0 #ff6b6b, 16px 16px 0 #4ecdc4; color: #000; font-family: 'Futura', sans-serif;` },
        { name: '🏛️ Art Deco', code: `background: linear-gradient(135deg, #1a1a2e, #16213e); border: 2px solid #d4af37; color: #d4af37; font-family: 'Times New Roman', serif; letter-spacing: 2px;` },
        { name: '⚫ Bauhaus', code: `background: #fff; border: 5px solid #000; color: #000; font-family: 'Futura', sans-serif; font-weight: bold; text-transform: uppercase;` },
        { name: '🎸 Grunge', code: `background: #2a2a2a; color: #c0c0c0; border: 2px solid #444; font-family: 'Courier New', monospace; text-shadow: 1px 1px 2px #000; box-shadow: inset 0 0 50px rgba(0,0,0,0.5);` },
        { name: '🌸 Cottagecore', code: `background: #fef9e7; border: 2px dashed #8b4513; color: #5d4e37; font-family: 'Georgia', serif; border-radius: 10px; padding: 15px;` },
        { name: '📚 Dark Academia', code: `background: #1a1410; color: #d4c5a9; border: 2px solid #8b7355; font-family: 'Garamond', serif; padding: 20px; box-shadow: 0 0 20px rgba(139,115,85,0.3);` },
        { name: '🚪 Liminal Space', code: `background: linear-gradient(180deg, #f0f0e8, #d9d9c8); color: #666; font-family: 'Arial', sans-serif; border: none; box-shadow: 0 0 50px rgba(0,0,0,0.1); opacity: 0.95;` },
        { name: '🕸️ Webcore', code: `background: #000080; color: #00ff00; font-family: 'Comic Sans MS', cursive; border: 3px ridge #c0c0c0; padding: 10px;` },
        { name: '🧸 Kidcore', code: `background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3); color: #fff; font-family: 'Comic Sans MS', cursive; border-radius: 20px; border: 4px solid #fff; text-shadow: 2px 2px #000;` },
        { name: '☁️ Dreamcore', code: `background: linear-gradient(180deg, #e8d5e8, #d5e8e8, #e8e8d5); color: #666; font-family: 'Georgia', serif; border-radius: 50px; box-shadow: 0 0 60px rgba(200,200,255,0.5); opacity: 0.9;` }
    ];

    // FILTERS TAB - 18 presets
    const filters = [
        { name: '📺 CRT Scanline', code: `position: relative; overflow: hidden; } .selected::before { content: " "; display: block; position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06)); z-index: 2; background-size: 100% 2px, 3px 100%; pointer-events: none;` },
        { name: '📼 VHS Glitch', code: `filter: contrast(1.5) brightness(1.2) hue-rotate(-10deg) blur(0.5px);` },
        { name: '🎞️ Sepia Vintage', code: `filter: sepia(100%) contrast(1.2) brightness(0.9);` },
        { name: '👻 Invert', code: `filter: invert(100%);` },
        { name: '🌫️ Blur Privacy', code: `filter: blur(5px);` },
        { name: '🌑 Grayscale', code: `filter: grayscale(100%);` },
        { name: '🌈 Hue Rotate', code: `animation: hue-rotate 3s infinite linear; } @keyframes hue-rotate { from { filter: hue-rotate(0deg); } to { filter: hue-rotate(360deg); }` },
        { name: '🔆 Saturate', code: `filter: saturate(200%);` },
        { name: '☀️ Brightness', code: `filter: brightness(150%);` },
        { name: '🎚️ Contrast', code: `filter: contrast(200%);` },
        { name: '💧 Drop Shadow', code: `filter: drop-shadow(5px 5px 10px rgba(0,0,0,0.5));` },
        { name: '🎨 Duotone', code: `filter: grayscale(100%) sepia(100%) hue-rotate(200deg) saturate(500%);` },
        { name: '🌡️ Thermal', code: `filter: hue-rotate(180deg) saturate(300%) contrast(150%);` },
        { name: '🌙 Night Vision', code: `filter: brightness(150%) contrast(200%) hue-rotate(90deg) saturate(200%);` },
        { name: '📷 Old Photo', code: `filter: sepia(80%) contrast(90%) brightness(90%) grayscale(30%);` },
        { name: '💥 Comic Book', code: `filter: contrast(200%) saturate(150%); outline: 3px solid black;` },
        { name: '🎮 Pixelate', code: `image-rendering: pixelated; image-rendering: -moz-crisp-edges;` },
        { name: '📡 Noise Grain', code: `position: relative; } .selected::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: url('data:image/svg+xml,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" /></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>'); opacity: 0.1; pointer-events: none;` }
    ];

    // SCROLLBARS TAB - 8 presets
    const scrollbars = [
        { name: '🟢 Neon Green', code: `::-webkit-scrollbar { width: 10px; } ::-webkit-scrollbar-track { background: #000; } ::-webkit-scrollbar-thumb { background: #0f0; border-radius: 5px; }` },
        { name: '🟣 Cyber Pink', code: `::-webkit-scrollbar { width: 10px; } ::-webkit-scrollbar-track { background: #220022; } ::-webkit-scrollbar-thumb { background: #ff00cc; border: 1px solid white; }` },
        { name: '🌈 Rainbow', code: `::-webkit-scrollbar { width: 12px; } ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, red, orange, yellow, green, blue, indigo, violet); border-radius: 10px; }` },
        { name: '👻 Hidden', code: `::-webkit-scrollbar { width: 0px; background: transparent; }` },
        { name: '💻 Win 95', code: `::-webkit-scrollbar { width: 16px; background: #c0c0c0; } ::-webkit-scrollbar-thumb { background: #c0c0c0; border: 2px outset #fff; } ::-webkit-scrollbar-button { background: #c0c0c0; border: 2px outset #fff; height: 16px; }` },
        { name: '➖ Thin Minimal', code: `::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 2px; }` },
        { name: '🍎 Mac Style', code: `::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.5); }` },
        { name: '🧊 Chunky Retro', code: `::-webkit-scrollbar { width: 20px; background: #333; } ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #666, #333); border: 2px solid #000; }` }
    ];

    // ANIMATION TAB - 20 presets
    const anim = [
        { name: '🎈 Float', code: `animation: float 3s ease-in-out infinite; } @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); }` },
        { name: '💓 Pulse', code: `animation: pulse 1s infinite; } @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); }` },
        { name: '🔄 Spin', code: `animation: spin 2s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); }` },
        { name: '⚡ Shake X', code: `animation: shakeX 0.5s; } @keyframes shakeX { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-5px); } 40%,80% { transform: translateX(5px); }` },
        { name: '⬆️ Shake Y', code: `animation: shakeY 0.5s; } @keyframes shakeY { 0%,100% { transform: translateY(0); } 20%,60% { transform: translateY(-5px); } 40%,80% { transform: translateY(5px); }` },
        { name: '📺 Glitch Text', code: `animation: glitch-skew 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite; } @keyframes glitch-skew { 0% { transform: skew(0deg); } 20% { transform: skew(-2deg); } 40% { transform: skew(2deg); } 60% { transform: skew(-1deg); } 80% { transform: skew(1deg); } 100% { transform: skew(0deg); }` },
        { name: '👋 Fade In', code: `animation: fadeIn 1s ease-in; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; }` },
        { name: '➡️ Slide In Left', code: `animation: slideInLeft 0.5s ease-out; } @keyframes slideInLeft { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; }` },
        { name: '⬅️ Slide In Right', code: `animation: slideInRight 0.5s ease-out; } @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; }` },
        { name: '⬇️ Slide In Down', code: `animation: slideInDown 0.5s ease-out; } @keyframes slideInDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; }` },
        { name: '🔼 Scale Up', code: `animation: scaleUp 0.5s ease-out; } @keyframes scaleUp { from { transform: scale(0); } to { transform: scale(1); }` },
        { name: '🏀 Bounce In', code: `animation: bounceIn 0.75s; } @keyframes bounceIn { 0% { transform: scale(0); } 50% { transform: scale(1.2); } 100% { transform: scale(1); }` },
        { name: '🧲 Elastic', code: `animation: elastic 1s; } @keyframes elastic { 0% { transform: scale(0); } 40% { transform: scale(1.3); } 60% { transform: scale(0.9); } 100% { transform: scale(1); }` },
        { name: '🍮 Jello', code: `animation: jello 1s; } @keyframes jello { 0%,100% { transform: skewX(0deg); } 30% { transform: skewX(-12.5deg); } 40% { transform: skewX(6.25deg); } 50% { transform: skewX(-3.125deg); } 65% { transform: skewX(1.5625deg); } 75% { transform: skewX(-0.78125deg); }` },
        { name: '🎉 Tada', code: `animation: tada 1s; } @keyframes tada { 0% { transform: scale(1); } 10%,20% { transform: scale(0.9) rotate(-3deg); } 30%,50%,70%,90% { transform: scale(1.1) rotate(3deg); } 40%,60%,80% { transform: scale(1.1) rotate(-3deg); } 100% { transform: scale(1) rotate(0); }` },
        { name: '🌀 Wobble', code: `animation: wobble 1s; } @keyframes wobble { 0% { transform: translateX(0%); } 15% { transform: translateX(-25%) rotate(-5deg); } 30% { transform: translateX(20%) rotate(3deg); } 45% { transform: translateX(-15%) rotate(-3deg); } 60% { transform: translateX(10%) rotate(2deg); } 75% { transform: translateX(-5%) rotate(-1deg); } 100% { transform: translateX(0%); }` },
        { name: '💖 Heartbeat', code: `animation: heartbeat 1.5s ease-in-out infinite; } @keyframes heartbeat { 0% { transform: scale(1); } 14% { transform: scale(1.3); } 28% { transform: scale(1); } 42% { transform: scale(1.3); } 70% { transform: scale(1); }` },
        { name: '⚡ Flash', code: `animation: flash 1s infinite; } @keyframes flash { 0%,50%,100% { opacity: 1; } 25%,75% { opacity: 0; }` },
        { name: '🔃 Flip X', code: `animation: flipX 1s; } @keyframes flipX { from { transform: rotateX(90deg); opacity: 0; } to { transform: rotateX(0); opacity: 1; }` },
        { name: '🔁 Flip Y', code: `animation: flipY 1s; } @keyframes flipY { from { transform: rotateY(90deg); opacity: 0; } to { transform: rotateY(0); opacity: 1; }` }
    ];

    // TYPOGRAPHY TAB - 8 presets
    const typography = [
        { name: '💻 System Stack', code: `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;` },
        { name: '🎮 Retro Pixel', code: `font-family: 'Press Start 2P', 'Courier New', monospace; font-size: 12px; letter-spacing: 1px;` },
        { name: '✍️ Handwritten', code: `font-family: 'Comic Sans MS', 'Brush Script MT', cursive; font-style: italic;` },
        { name: '⌨️ Monospace', code: `font-family: 'Fira Code', 'Monaco', 'Consolas', monospace; letter-spacing: 0;` },
        { name: '📰 Serif Classic', code: `font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.6;` },
        { name: '🔤 Sans Modern', code: `font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; font-weight: 400;` },
        { name: '🎪 Display Fun', code: `font-family: 'Impact', 'Arial Black', sans-serif; text-transform: uppercase; letter-spacing: 3px;` },
        { name: '🌟 Gradient Text', code: `background: linear-gradient(90deg, #ff00ff, #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;` }
    ];

    // BORDERS TAB - 12 presets
    const borders = [
        { name: '➖ Solid', code: `border: 3px solid currentColor;` },
        { name: '➗ Dashed', code: `border: 3px dashed currentColor;` },
        { name: '⚫ Dotted', code: `border: 3px dotted currentColor;` },
        { name: '═ Double', code: `border: 4px double currentColor;` },
        { name: '🔳 Groove', code: `border: 4px groove #888;` },
        { name: '🔲 Ridge', code: `border: 4px ridge #888;` },
        { name: '⬛ Inset', code: `border: 4px inset #888;` },
        { name: '⬜ Outset', code: `border: 4px outset #888;` },
        { name: '💡 Neon Border', code: `border: 2px solid #0ff; box-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff;` },
        { name: '🌈 Gradient Border', code: `border: 3px solid transparent; background: linear-gradient(#000, #000) padding-box, linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0) border-box;` },
        { name: '✨ Animated Border', code: `border: 3px solid; animation: borderColor 2s linear infinite; } @keyframes borderColor { 0%,100% { border-color: #ff0080; } 33% { border-color: #ff8c00; } 66% { border-color: #40e0d0; }` },
        { name: '🧵 Stitched', code: `border: 2px dashed #fff; outline: 2px solid currentColor; outline-offset: -6px;` }
    ];

    // SHADOWS TAB - 8 presets
    const shadows = [
        { name: '☁️ Soft Shadow', code: `box-shadow: 0 10px 40px rgba(0,0,0,0.2);` },
        { name: '🔳 Hard Shadow', code: `box-shadow: 8px 8px 0 #000;` },
        { name: '💡 Neon Glow', code: `box-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff;` },
        { name: '⬛ Inner Shadow', code: `box-shadow: inset 0 0 20px rgba(0,0,0,0.5);` },
        { name: '📏 Long Shadow', code: `box-shadow: 1px 1px 0 #999, 2px 2px 0 #999, 3px 3px 0 #999, 4px 4px 0 #999, 5px 5px 0 #999, 6px 6px 0 #999;` },
        { name: '📚 Layered', code: `box-shadow: 0 1px 1px rgba(0,0,0,0.12), 0 2px 2px rgba(0,0,0,0.12), 0 4px 4px rgba(0,0,0,0.12), 0 8px 8px rgba(0,0,0,0.12), 0 16px 16px rgba(0,0,0,0.12);` },
        { name: '🎮 Retro Shadow', code: `box-shadow: 4px 4px 0 #ff0080, 8px 8px 0 #ff8c00;` },
        { name: '🎲 3D Shadow', code: `box-shadow: 0 4px 0 #333, 0 5px 5px rgba(0,0,0,0.3); position: relative; top: -2px;` }
    ];

    const renderGrid = (items, id) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = items.map(item => {
            const escapedCode = item.code.replaceAll('`', '\\`').replaceAll('"', '&quot;');
            return `
                <div class="style-card" onclick="window.applyCssPreset(\`${escapedCode}\`)">
                    <div style="font-size:20px; margin-bottom:5px;">🎨</div>
                    <div class="style-preview-mini"></div>
                    <div>${item.name}</div>
                </div>
            `;
        }).join('');
    };

    renderGrid(presets, 'css-tab-presets');
    renderGrid(filters, 'css-tab-filters');
    renderGrid(scrollbars, 'css-tab-scroll');
    renderGrid(anim, 'css-tab-anim');
    renderGrid(typography, 'css-tab-typography');
    renderGrid(borders, 'css-tab-borders');
    renderGrid(shadows, 'css-tab-shadows');
};
