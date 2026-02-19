// ============================================
// 🎪 FUN COMPONENTS LIBRARY
// Whacky, sassy CSS & JS components for CoAIexist Studio
// ============================================

(function() {
    'use strict';

    // Component categories with templates
    const FUN_COMPONENTS = {
        // 🌈 TEXT EFFECTS
        'text-effects': {
            emoji: '🌈',
            name: 'Text FX',
            items: [
                {
                    id: 'rainbow-text',
                    name: 'Rainbow Text',
                    emoji: '🌈',
                    html: `<span class="canvas-el rainbow-text" style="font-size:2em;font-weight:bold;background:linear-gradient(90deg,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#9400d3);background-clip:text;-webkit-background-clip:text;color:transparent;animation:rainbow-shift 3s linear infinite;background-size:200% auto;">Rainbow Magic!</span><style>@keyframes rainbow-shift{0%{background-position:0%}100%{background-position:200%}}</style>`
                },
                {
                    id: 'glitch-text',
                    name: 'Glitch Text',
                    emoji: '👾',
                    html: `<div class="canvas-el glitch-container" style="position:relative;font-size:2em;font-weight:bold;color:#fff;text-shadow:2px 0 #ff00de,-2px 0 #00ffff;animation:glitch 0.5s infinite;"><span data-text="GLITCH">GLITCH</span></div><style>@keyframes glitch{0%,100%{transform:translate(0)}20%{transform:translate(-2px,2px)}40%{transform:translate(-2px,-2px)}60%{transform:translate(2px,2px)}80%{transform:translate(2px,-2px)}}</style>`
                },
                {
                    id: 'neon-glow',
                    name: 'Neon Glow',
                    emoji: '💡',
                    html: `<span class="canvas-el neon-text" style="font-size:2em;font-weight:bold;color:#fff;text-shadow:0 0 5px #ff00de,0 0 10px #ff00de,0 0 20px #ff00de,0 0 40px #ff00de;animation:neon-pulse 1.5s ease-in-out infinite alternate;">NEON DREAMS</span><style>@keyframes neon-pulse{from{text-shadow:0 0 5px #ff00de,0 0 10px #ff00de,0 0 20px #ff00de}to{text-shadow:0 0 10px #00ffff,0 0 20px #00ffff,0 0 40px #00ffff,0 0 80px #00ffff}}</style>`
                },
                {
                    id: 'typewriter',
                    name: 'Typewriter',
                    emoji: '⌨️',
                    html: `<div class="canvas-el typewriter" style="font-family:'VT323',monospace;font-size:1.5em;overflow:hidden;border-right:3px solid #00ff00;white-space:nowrap;animation:typing 3s steps(20) infinite,blink-caret 0.75s step-end infinite;">Hello, World...</div><style>@keyframes typing{0%,100%{width:0}50%{width:100%}}@keyframes blink-caret{50%{border-color:transparent}}</style>`
                },
                {
                    id: 'wavy-text',
                    name: 'Wavy Text',
                    emoji: '🌊',
                    html: `<div class="canvas-el wavy-text" style="font-size:2em;font-weight:bold;display:flex;"><span style="animation:wave 1s ease-in-out infinite;animation-delay:0s;">W</span><span style="animation:wave 1s ease-in-out infinite;animation-delay:0.1s;">A</span><span style="animation:wave 1s ease-in-out infinite;animation-delay:0.2s;">V</span><span style="animation:wave 1s ease-in-out infinite;animation-delay:0.3s;">Y</span></div><style>@keyframes wave{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}</style>`
                },
                {
                    id: '3d-text',
                    name: '3D Text',
                    emoji: '🎲',
                    html: `<span class="canvas-el text-3d" style="font-size:3em;font-weight:900;color:#ff00cc;text-shadow:1px 1px 0 #ff66d9,2px 2px 0 #ff99e6,3px 3px 0 #ffccf2,4px 4px 0 #ffe6f9,5px 5px 0 #fff,6px 6px 10px rgba(0,0,0,0.5);">DEPTH</span>`
                },
                {
                    id: 'scramble-text',
                    name: 'Scramble Text',
                    emoji: '🔀',
                    html: `<span class="canvas-el scramble-text" style="font-family:monospace;font-size:1.5em;letter-spacing:2px;" data-text="DECODE ME" onclick="this.classList.toggle('decoded')">D̷̢E̵͜C̸̕O̶D̵͝E̸͘ ̴M̵̛E̶</span><style>.scramble-text.decoded{animation:unscramble 0.5s forwards}@keyframes unscramble{to{content:attr(data-text)}}</style>`
                }
            ]
        },

        // ✨ ANIMATION EFFECTS
        'animations': {
            emoji: '✨',
            name: 'Animations',
            items: [
                {
                    id: 'bounce-el',
                    name: 'Bounce',
                    emoji: '⬆️',
                    html: `<div class="canvas-el bounce-box" style="width:80px;height:80px;background:linear-gradient(135deg,#ff00cc,#00ffff);border-radius:15px;animation:bounce 0.6s ease infinite;">🎾</div><style>@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}</style>`
                },
                {
                    id: 'shake-el',
                    name: 'Shake',
                    emoji: '📳',
                    html: `<div class="canvas-el shake-box" style="width:100px;height:60px;background:#ff4444;color:white;display:flex;align-items:center;justify-content:center;border-radius:8px;animation:shake 0.5s ease infinite;">⚠️ ERROR</div><style>@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}</style>`
                },
                {
                    id: 'spin-el',
                    name: 'Spin',
                    emoji: '🔄',
                    html: `<div class="canvas-el spin-box" style="width:60px;height:60px;background:conic-gradient(#ff00cc,#00ffff,#ccff00,#ff00cc);border-radius:50%;animation:spin 2s linear infinite;"></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style>`
                },
                {
                    id: 'pulse-el',
                    name: 'Pulse',
                    emoji: '💓',
                    html: `<div class="canvas-el pulse-heart" style="font-size:3em;animation:pulse 1s ease-in-out infinite;">❤️</div><style>@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}</style>`
                },
                {
                    id: 'float-el',
                    name: 'Float',
                    emoji: '🎈',
                    html: `<div class="canvas-el float-box" style="width:80px;height:80px;background:linear-gradient(180deg,#87ceeb,#fff);border-radius:50%;box-shadow:0 10px 30px rgba(0,0,0,0.2);animation:float 3s ease-in-out infinite;">☁️</div><style>@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}</style>`
                },
                {
                    id: 'wobble-el',
                    name: 'Wobble',
                    emoji: '🍮',
                    html: `<div class="canvas-el wobble-jelly" style="width:80px;height:80px;background:linear-gradient(135deg,#ff6b6b,#feca57);border-radius:20px;animation:wobble 1s ease-in-out infinite;">🍮</div><style>@keyframes wobble{0%,100%{transform:rotate(0) scale(1)}25%{transform:rotate(-5deg) scale(1.05)}75%{transform:rotate(5deg) scale(0.95)}}</style>`
                },
                {
                    id: 'flip-el',
                    name: 'Flip Card',
                    emoji: '🃏',
                    html: `<div class="canvas-el flip-card" style="width:100px;height:140px;perspective:1000px;cursor:pointer;" onclick="this.classList.toggle('flipped')"><div style="position:relative;width:100%;height:100%;transition:transform 0.6s;transform-style:preserve-3d;"><div style="position:absolute;width:100%;height:100%;backface-visibility:hidden;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:2em;">🎴</div><div style="position:absolute;width:100%;height:100%;backface-visibility:hidden;background:linear-gradient(135deg,#f093fb,#f5576c);border-radius:10px;transform:rotateY(180deg);display:flex;align-items:center;justify-content:center;font-size:2em;">✨</div></div></div><style>.flip-card.flipped>div{transform:rotateY(180deg)}</style>`
                },
                {
                    id: 'zoom-el',
                    name: 'Zoom',
                    emoji: '🔍',
                    html: `<div class="canvas-el zoom-box" style="width:80px;height:80px;background:#9b59b6;border-radius:10px;animation:zoom 2s ease-in-out infinite;display:flex;align-items:center;justify-content:center;font-size:2em;">🔮</div><style>@keyframes zoom{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}</style>`
                }
            ]
        },

        // 🎨 BACKGROUND EFFECTS
        'backgrounds': {
            emoji: '🎨',
            name: 'Backgrounds',
            items: [
                {
                    id: 'gradient-animate',
                    name: 'Gradient Wave',
                    emoji: '🌊',
                    html: `<div class="canvas-el gradient-bg" style="width:200px;height:100px;background:linear-gradient(-45deg,#ee7752,#e73c7e,#23a6d5,#23d5ab);background-size:400% 400%;animation:gradient 5s ease infinite;border-radius:15px;"></div><style>@keyframes gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}</style>`
                },
                {
                    id: 'starfield',
                    name: 'Starfield',
                    emoji: '⭐',
                    html: `<div class="canvas-el starfield" style="width:200px;height:150px;background:#000;position:relative;overflow:hidden;border-radius:10px;"><div style="position:absolute;width:2px;height:2px;background:white;box-shadow:20px 30px white,50px 10px white,80px 60px white,120px 20px white,150px 80px white,30px 100px white,100px 50px white,170px 120px white;animation:twinkle 2s infinite;"></div></div><style>@keyframes twinkle{0%,100%{opacity:1}50%{opacity:0.3}}</style>`
                },
                {
                    id: 'matrix-rain',
                    name: 'Matrix Rain',
                    emoji: '💚',
                    html: `<div class="canvas-el matrix-box" style="width:200px;height:100px;background:#000;font-family:monospace;color:#0f0;overflow:hidden;position:relative;font-size:10px;border-radius:10px;"><div style="animation:matrix-fall 2s linear infinite;">01001010110</div><div style="position:absolute;top:0;left:30px;animation:matrix-fall 1.5s linear infinite 0.2s;">10110100011</div><div style="position:absolute;top:0;left:60px;animation:matrix-fall 1.8s linear infinite 0.5s;">01101001010</div></div><style>@keyframes matrix-fall{0%{transform:translateY(-100%)}100%{transform:translateY(200px)}}</style>`
                },
                {
                    id: 'confetti',
                    name: 'Confetti',
                    emoji: '🎊',
                    html: `<div class="canvas-el confetti-box" style="width:150px;height:100px;background:#1a1a2e;position:relative;overflow:hidden;border-radius:15px;"><div style="position:absolute;width:10px;height:10px;background:#ff00cc;animation:confetti-fall 2s ease-out infinite;">🎊</div><div style="position:absolute;left:50px;width:10px;height:10px;animation:confetti-fall 2.5s ease-out infinite 0.3s;">🎉</div><div style="position:absolute;left:100px;animation:confetti-fall 2s ease-out infinite 0.6s;">✨</div></div><style>@keyframes confetti-fall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(120px) rotate(720deg);opacity:0}}</style>`
                },
                {
                    id: 'sparkles',
                    name: 'Sparkles',
                    emoji: '✨',
                    html: `<div class="canvas-el sparkle-box" style="width:150px;height:80px;background:linear-gradient(135deg,#1a1a2e,#16213e);position:relative;border-radius:10px;"><span style="position:absolute;top:20px;left:30px;animation:sparkle 1s ease-in-out infinite;">✨</span><span style="position:absolute;top:40px;left:80px;animation:sparkle 1s ease-in-out infinite 0.3s;">💫</span><span style="position:absolute;top:10px;left:110px;animation:sparkle 1s ease-in-out infinite 0.6s;">⭐</span></div><style>@keyframes sparkle{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.5)}}</style>`
                },
                {
                    id: 'lava-lamp',
                    name: 'Lava Lamp',
                    emoji: '🫧',
                    html: `<div class="canvas-el lava-lamp" style="width:80px;height:150px;background:linear-gradient(180deg,#ff6b6b,#4ecdc4);border-radius:40px;position:relative;overflow:hidden;"><div style="position:absolute;width:40px;height:40px;background:rgba(255,255,255,0.5);border-radius:50%;bottom:20px;left:20px;animation:lava 4s ease-in-out infinite;"></div><div style="position:absolute;width:30px;height:30px;background:rgba(255,255,255,0.3);border-radius:50%;bottom:60px;left:30px;animation:lava 3s ease-in-out infinite 1s;"></div></div><style>@keyframes lava{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-80px) scale(0.8)}}</style>`
                },
                {
                    id: 'aurora',
                    name: 'Aurora',
                    emoji: '🌌',
                    html: `<div class="canvas-el aurora" style="width:200px;height:100px;background:linear-gradient(180deg,#0f0c29,#302b63,#24243e);position:relative;overflow:hidden;border-radius:10px;"><div style="position:absolute;bottom:0;width:100%;height:60%;background:linear-gradient(90deg,transparent,#00ff87,#60efff,#00ff87,transparent);filter:blur(20px);animation:aurora 4s ease-in-out infinite;"></div></div><style>@keyframes aurora{0%,100%{transform:translateX(-50%)}50%{transform:translateX(50%)}}</style>`
                },
                {
                    id: 'tv-static',
                    name: 'TV Static',
                    emoji: '📺',
                    html: `<div class="canvas-el tv-static" style="width:150px;height:100px;background:repeating-radial-gradient(#000 0 0.0001%,#fff 0 0.0002%) 50% 0/2500px 2500px,repeating-conic-gradient(#000 0 0.0001%,#fff 0 0.0002%) 60% 60%/2500px 2500px;background-blend-mode:difference;animation:static 0.2s infinite;border:4px solid #333;border-radius:5px;"></div><style>@keyframes static{to{background-position:50% 50%,60% 60%}}</style>`
                }
            ]
        },

        // 🖱️ CURSOR EFFECTS
        'cursors': {
            emoji: '🖱️',
            name: 'Cursors',
            items: [
                {
                    id: 'cursor-crosshair',
                    name: 'Crosshair Zone',
                    emoji: '⊕',
                    html: `<div class="canvas-el cursor-zone" style="width:150px;height:100px;background:rgba(255,0,204,0.1);border:2px dashed #ff00cc;cursor:crosshair;display:flex;align-items:center;justify-content:center;border-radius:10px;">⊕ Crosshair</div>`
                },
                {
                    id: 'cursor-pointer',
                    name: 'Pointer Zone',
                    emoji: '👆',
                    html: `<div class="canvas-el cursor-zone" style="width:150px;height:100px;background:rgba(0,255,255,0.1);border:2px dashed #00ffff;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:10px;">👆 Pointer</div>`
                },
                {
                    id: 'cursor-grab',
                    name: 'Grab Zone',
                    emoji: '✊',
                    html: `<div class="canvas-el cursor-zone" style="width:150px;height:100px;background:rgba(204,255,0,0.1);border:2px dashed #ccff00;cursor:grab;display:flex;align-items:center;justify-content:center;border-radius:10px;" onmousedown="this.style.cursor='grabbing'" onmouseup="this.style.cursor='grab'">✊ Grab Me</div>`
                },
                {
                    id: 'cursor-wait',
                    name: 'Loading Zone',
                    emoji: '⏳',
                    html: `<div class="canvas-el cursor-zone" style="width:150px;height:100px;background:rgba(255,165,0,0.1);border:2px dashed orange;cursor:wait;display:flex;align-items:center;justify-content:center;border-radius:10px;">⏳ Loading...</div>`
                }
            ]
        },

        // 🎮 INTERACTIVE TOYS
        'toys': {
            emoji: '🎮',
            name: 'Toys',
            items: [
                {
                    id: 'click-counter',
                    name: 'Click Counter',
                    emoji: '🔢',
                    html: `<div class="canvas-el click-counter" style="background:linear-gradient(135deg,#667eea,#764ba2);padding:20px;border-radius:15px;text-align:center;cursor:pointer;user-select:none;" onclick="let c=this.querySelector('span');c.textContent=parseInt(c.textContent)+1"><div style="font-size:3em;font-weight:bold;color:white;"><span>0</span></div><div style="color:rgba(255,255,255,0.8);margin-top:5px;">clicks!</div></div>`
                },
                {
                    id: 'magic-8ball',
                    name: 'Magic 8-Ball',
                    emoji: '🎱',
                    html: `<div class="canvas-el magic-8ball" style="width:100px;height:100px;background:radial-gradient(circle at 30% 30%,#444,#000);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,0.5);" onclick="const answers=['Yes!','No!','Maybe','Ask again','Definitely','Unlikely','🤷'];this.querySelector('span').textContent=answers[Math.floor(Math.random()*answers.length)]"><div style="width:50px;height:50px;background:#1a1aff;border-radius:50%;display:flex;align-items:center;justify-content:center;"><span style="color:white;font-size:10px;text-align:center;">8</span></div></div>`
                },
                {
                    id: 'mood-meter',
                    name: 'Mood Meter',
                    emoji: '😊',
                    html: `<div class="canvas-el mood-meter" style="background:#1a1a2e;padding:15px;border-radius:15px;width:200px;"><div style="text-align:center;font-size:2em;margin-bottom:10px;" id="mood-face">😐</div><input type="range" min="0" max="4" value="2" style="width:100%;" oninput="const faces=['😢','😕','😐','😊','🤩'];this.previousElementSibling.textContent=faces[this.value]"><div style="display:flex;justify-content:space-between;font-size:10px;color:#888;margin-top:5px;"><span>Sad</span><span>Happy</span></div></div>`
                },
                {
                    id: 'dice-roller',
                    name: 'Dice Roller',
                    emoji: '🎲',
                    html: `<div class="canvas-el dice" style="width:80px;height:80px;background:white;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:3em;cursor:pointer;box-shadow:0 5px 20px rgba(0,0,0,0.3);transition:transform 0.3s;" onclick="this.style.transform='rotate('+(Math.random()*720)+'deg)';this.textContent=['⚀','⚁','⚂','⚃','⚄','⚅'][Math.floor(Math.random()*6)]">⚀</div>`
                },
                {
                    id: 'slot-machine',
                    name: 'Slot Machine',
                    emoji: '🎰',
                    html: `<div class="canvas-el slot-machine" style="background:linear-gradient(180deg,#8b0000,#b22222);padding:15px;border-radius:15px;text-align:center;"><div style="display:flex;gap:5px;justify-content:center;background:#000;padding:10px;border-radius:10px;margin-bottom:10px;"><span style="font-size:2em;">🍒</span><span style="font-size:2em;">🍋</span><span style="font-size:2em;">🍇</span></div><button style="background:#ffd700;border:none;padding:8px 20px;border-radius:20px;cursor:pointer;font-weight:bold;" onclick="const s=['🍒','🍋','🍇','7️⃣','💎','🔔'];const slots=this.parentElement.querySelectorAll('span');slots.forEach(sl=>sl.textContent=s[Math.floor(Math.random()*s.length)])">SPIN!</button></div>`
                },
                {
                    id: 'pet-rock',
                    name: 'Pet Rock',
                    emoji: '🪨',
                    html: `<div class="canvas-el pet-rock" style="cursor:pointer;text-align:center;" onclick="const msgs=['*happy rock noises*','🪨💕','*wiggles*','zzzZZZ','!'];this.querySelector('.msg').textContent=msgs[Math.floor(Math.random()*msgs.length)];this.querySelector('.rock').style.transform='rotate('+(Math.random()*20-10)+'deg)'"><div class="rock" style="font-size:4em;transition:transform 0.2s;">🪨</div><div class="msg" style="font-size:12px;color:#888;min-height:20px;">Click me!</div></div>`
                },
                {
                    id: 'toggle-switch',
                    name: 'Toggle Switch',
                    emoji: '🔘',
                    html: `<div class="canvas-el toggle-container" style="display:flex;align-items:center;gap:10px;"><span style="color:#888;">OFF</span><div style="width:60px;height:30px;background:#333;border-radius:15px;position:relative;cursor:pointer;transition:background 0.3s;" onclick="this.classList.toggle('on');this.style.background=this.classList.contains('on')?'#00ff00':'#333';this.querySelector('div').style.transform=this.classList.contains('on')?'translateX(30px)':'translateX(0)'"><div style="width:26px;height:26px;background:white;border-radius:50%;position:absolute;top:2px;left:2px;transition:transform 0.3s;"></div></div><span style="color:#888;">ON</span></div>`
                }
            ]
        },

        // 📺 RETRO EFFECTS
        'retro': {
            emoji: '📺',
            name: 'Retro',
            items: [
                {
                    id: 'crt-monitor',
                    name: 'CRT Monitor',
                    emoji: '🖥️',
                    html: `<div class="canvas-el crt-frame" style="background:#222;padding:20px;border-radius:20px;box-shadow:inset 0 0 50px rgba(0,0,0,0.5);"><div style="background:#000;padding:15px;border-radius:10px 10px 5px 5px;position:relative;overflow:hidden;"><div style="color:#33ff33;font-family:'VT323',monospace;">C:\\> Hello World_</div><div style="position:absolute;top:0;left:0;right:0;bottom:0;background:repeating-linear-gradient(transparent,transparent 2px,rgba(0,0,0,0.3) 2px,rgba(0,0,0,0.3) 4px);pointer-events:none;"></div></div><div style="background:linear-gradient(#444,#333);height:30px;border-radius:0 0 20px 20px;display:flex;align-items:center;justify-content:center;"><div style="width:10px;height:10px;background:#00ff00;border-radius:50%;box-shadow:0 0 5px #00ff00;"></div></div></div>`
                },
                {
                    id: 'vhs-tracking',
                    name: 'VHS Tracking',
                    emoji: '📼',
                    html: `<div class="canvas-el vhs-box" style="width:200px;height:100px;background:#000;position:relative;overflow:hidden;border:3px solid #333;"><div style="color:white;padding:10px;font-family:monospace;">PLAY ▶ 00:00:00</div><div style="position:absolute;top:0;left:0;right:0;height:5px;background:repeating-linear-gradient(90deg,transparent,transparent 10px,white 10px,white 20px);animation:vhs 0.1s infinite;"></div></div><style>@keyframes vhs{0%{transform:translateX(0)}100%{transform:translateX(-20px)}}</style>`
                },
                {
                    id: 'win98-window',
                    name: 'Win98 Window',
                    emoji: '🪟',
                    html: `<div class="canvas-el win98" style="background:#c0c0c0;border:2px outset #fff;width:250px;font-family:'MS Sans Serif',Arial,sans-serif;font-size:11px;"><div style="background:linear-gradient(90deg,#000080,#1084d0);color:white;padding:3px 5px;display:flex;justify-content:space-between;align-items:center;font-weight:bold;"><span>📁 My Computer</span><div><button style="background:#c0c0c0;border:2px outset #fff;width:16px;height:14px;font-size:9px;cursor:pointer;">_</button><button style="background:#c0c0c0;border:2px outset #fff;width:16px;height:14px;font-size:9px;cursor:pointer;">□</button><button style="background:#c0c0c0;border:2px outset #fff;width:16px;height:14px;font-size:9px;cursor:pointer;">✕</button></div></div><div style="padding:10px;border:2px inset #808080;margin:2px;background:white;min-height:60px;">Contents here...</div></div>`
                },
                {
                    id: 'macos9-window',
                    name: 'Mac OS 9',
                    emoji: '🍎',
                    html: `<div class="canvas-el macos9" style="background:#ddd;border:1px solid #000;width:250px;font-family:'Chicago',sans-serif;font-size:12px;box-shadow:1px 1px 0 #000;"><div style="background:linear-gradient(#fff,#ccc);padding:3px;border-bottom:1px solid #888;display:flex;align-items:center;"><div style="width:12px;height:12px;border:1px solid #000;background:#fff;margin-right:5px;"></div><span>Untitled</span></div><div style="padding:10px;background:#fff;min-height:60px;border-top:1px solid #fff;">Classic Mac vibes ☮️</div></div>`
                },
                {
                    id: 'marquee',
                    name: 'Marquee',
                    emoji: '📜',
                    html: `<div class="canvas-el marquee-container" style="overflow:hidden;background:#000;padding:10px;border-radius:5px;width:200px;"><div style="display:inline-block;white-space:nowrap;animation:marquee 10s linear infinite;color:#00ff00;font-family:monospace;">🌟 Welcome to my website! 🌟 Please sign my guestbook! 🌟</div></div><style>@keyframes marquee{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}</style>`
                },
                {
                    id: 'blink-tag',
                    name: 'Blink Tag',
                    emoji: '👀',
                    html: `<span class="canvas-el blink-text" style="animation:blink-tag 1s step-end infinite;font-weight:bold;color:#ff0000;">⚠️ UNDER CONSTRUCTION ⚠️</span><style>@keyframes blink-tag{0%,100%{opacity:1}50%{opacity:0}}</style>`
                },
                {
                    id: 'construction-gif',
                    name: 'Construction',
                    emoji: '🚧',
                    html: `<div class="canvas-el construction" style="background:repeating-linear-gradient(45deg,#ffd700,#ffd700 10px,#000 10px,#000 20px);padding:10px;display:flex;align-items:center;gap:10px;border-radius:5px;"><span style="font-size:2em;">🚧</span><span style="background:#000;color:#ffd700;padding:5px 10px;font-weight:bold;">UNDER CONSTRUCTION</span><span style="font-size:2em;">🚧</span></div>`
                },
                {
                    id: 'visitor-counter',
                    name: 'Visitor Counter',
                    emoji: '📊',
                    html: `<div class="canvas-el visitor-counter" style="background:#000;color:#0f0;font-family:'VT323',monospace;padding:10px;border:2px ridge #444;display:inline-block;"><div style="font-size:10px;margin-bottom:5px;">You are visitor:</div><div style="background:#001100;padding:5px 10px;font-size:1.5em;letter-spacing:3px;">00${Math.floor(Math.random()*9000+1000)}</div></div>`
                }
            ]
        },

        // 🎪 WILD CARDS
        'wildcards': {
            emoji: '🎪',
            name: 'Wild Cards',
            items: [
                {
                    id: 'guestbook-link',
                    name: 'Guestbook',
                    emoji: '📖',
                    html: `<a class="canvas-el guestbook" style="display:inline-block;background:linear-gradient(180deg,#ffeb3b,#ffc107);color:#000;padding:10px 20px;border-radius:5px;text-decoration:none;font-weight:bold;box-shadow:3px 3px 0 #b38f00;cursor:pointer;">📖 Sign My Guestbook!</a>`
                },
                {
                    id: 'webring-nav',
                    name: 'Webring',
                    emoji: '🔗',
                    html: `<div class="canvas-el webring" style="background:#1a1a2e;padding:10px;border-radius:10px;display:flex;align-items:center;gap:10px;font-size:12px;"><a style="color:#00ffff;cursor:pointer;">◀ Prev</a><span style="color:#ff00cc;">🔗 Cool Sites Ring</span><a style="color:#00ffff;cursor:pointer;">Next ▶</a></div>`
                },
                {
                    id: 'best-viewed',
                    name: 'Best Viewed',
                    emoji: '🖥️',
                    html: `<div class="canvas-el best-viewed" style="background:#000080;color:white;padding:8px 15px;font-size:11px;font-family:Arial,sans-serif;display:inline-block;border:2px outset #99f;">🌐 Best viewed in Netscape Navigator 4.0 @ 800x600</div>`
                },
                {
                    id: 'email-btn',
                    name: 'Email Me',
                    emoji: '📧',
                    html: `<a class="canvas-el email-btn" style="display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#00c6ff,#0072ff);color:white;padding:12px 20px;border-radius:25px;text-decoration:none;font-weight:bold;box-shadow:0 4px 15px rgba(0,114,255,0.4);cursor:pointer;">📧 Email Me!</a>`
                },
                {
                    id: 'hit-counter',
                    name: 'Hit Counter',
                    emoji: '🔢',
                    html: `<div class="canvas-el hit-counter" style="display:inline-flex;"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='20'%3E%3Crect fill='%23000' width='100' height='20'/%3E%3Ctext x='50' y='15' text-anchor='middle' fill='%2300ff00' font-family='monospace' font-size='12'%3E${String(Math.floor(Math.random()*90000+10000)).split('').join(' ')}%3C/text%3E%3C/svg%3E" alt="Hit Counter" style="image-rendering:pixelated;"></div>`
                },
                {
                    id: 'aol-status',
                    name: 'AIM Status',
                    emoji: '💬',
                    html: `<div class="canvas-el aim-status" style="background:#ffff99;border:1px solid #000;padding:5px 10px;font-family:'MS Sans Serif',Arial,sans-serif;font-size:11px;display:inline-flex;align-items:center;gap:5px;"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Ccircle cx='6' cy='6' r='5' fill='%2300ff00'/%3E%3C/svg%3E" style="width:12px;">CoAIexist is <b>Online</b></div>`
                },
                {
                    id: 'geocities-badge',
                    name: 'Geocities Badge',
                    emoji: '🌐',
                    html: `<div class="canvas-el geocities" style="background:linear-gradient(135deg,#ff6b6b,#4ecdc4);padding:10px;border-radius:5px;text-align:center;font-family:Comic Sans MS,cursive;"><div style="color:white;text-shadow:2px 2px #000;">🏠 Welcome to my GeoCities!</div><div style="font-size:10px;color:#fff;">Area 51 / Neighborhood</div></div>`
                },
                {
                    id: 'netscape-now',
                    name: 'Netscape Now!',
                    emoji: '🌍',
                    html: `<div class="canvas-el netscape-btn" style="background:#006600;color:white;padding:5px 10px;border:3px outset #00aa00;font-family:Arial;font-size:11px;cursor:pointer;display:inline-block;">🌍 <b>Netscape Now!</b></div>`
                }
            ]
        },

        // 🔊 SOUNDS (visual representation)
        'sounds': {
            emoji: '🔊',
            name: 'Sound FX',
            items: [
                {
                    id: 'sound-click',
                    name: 'Click Sound',
                    emoji: '🔔',
                    html: `<button class="canvas-el sound-btn" style="background:linear-gradient(135deg,#a8e6cf,#88d8b0);border:none;padding:15px 25px;border-radius:10px;cursor:pointer;font-size:1em;box-shadow:0 4px 15px rgba(0,0,0,0.2);" onclick="if(window.playSound)window.playSound('pop')">🔔 Click for Sound!</button>`
                },
                {
                    id: 'sound-hover',
                    name: 'Hover Zone',
                    emoji: '🎵',
                    html: `<div class="canvas-el hover-sound" style="background:linear-gradient(135deg,#dfe6e9,#b2bec3);padding:20px;border-radius:10px;text-align:center;transition:transform 0.2s;" onmouseenter="if(window.playSound)window.playSound('boop');this.style.transform='scale(1.05)'" onmouseleave="this.style.transform='scale(1)'">🎵 Hover Me!</div>`
                },
                {
                    id: 'sound-success',
                    name: 'Success Sound',
                    emoji: '✅',
                    html: `<button class="canvas-el success-btn" style="background:linear-gradient(135deg,#00b894,#00cec9);color:white;border:none;padding:15px 30px;border-radius:25px;cursor:pointer;font-weight:bold;" onclick="if(window.playSound)window.playSound('success');this.textContent='✅ Success!'">🎯 Trigger Success</button>`
                }
            ]
        }
    };

    // Create the components panel HTML
    function buildComponentsPanelHTML() {
        let html = `
        <div id="fun-components-panel" class="fun-comp-panel">
            <div class="fun-comp-header">
                <span>🎪 FUN COMPONENTS</span>
                <button class="fun-comp-close" onclick="document.getElementById('fun-components-panel').classList.remove('open')">×</button>
            </div>
            <div class="fun-comp-categories">
        `;

        for (const [catId, cat] of Object.entries(FUN_COMPONENTS)) {
            html += `
            <details class="fun-comp-category" open>
                <summary>${cat.emoji} ${cat.name}</summary>
                <div class="fun-comp-grid">
            `;
            for (const item of cat.items) {
                html += `
                <div class="fun-comp-item" onclick="window.insertFunComponent('${item.id}')" title="${item.name}">
                    <span class="fun-comp-emoji">${item.emoji}</span>
                    <span class="fun-comp-name">${item.name}</span>
                </div>
                `;
            }
            html += `</div></details>`;
        }

        html += `</div></div>`;
        return html;
    }

    // Insert component function
    window.insertFunComponent = function(itemId) {
        for (const cat of Object.values(FUN_COMPONENTS)) {
            const item = cat.items.find(i => i.id === itemId);
            if (item) {
                if (window.addElementHTML) {
                    window.addElementHTML(item.html);
                    if (window.playSound) window.playSound('success');
                    if (window.updateStatus) window.updateStatus(`Added: ${item.name}`);
                }
                return;
            }
        }
    };

    // Add styles
    function addStyles() {
        if (document.getElementById('fun-components-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'fun-components-styles';
        style.textContent = `
            .fun-comp-panel {
                position: fixed;
                left: -300px;
                top: 60px;
                width: 280px;
                height: calc(100vh - 80px);
                background: var(--panel-bg, rgba(20,20,35,0.95));
                border: 1px solid var(--glass-border, rgba(255,255,255,0.1));
                border-radius: 0 15px 15px 0;
                z-index: 1000;
                transition: left 0.3s ease;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                backdrop-filter: blur(10px);
            }
            .fun-comp-panel.open { left: 0; }
            
            .fun-comp-header {
                background: linear-gradient(90deg, #ff00cc, #00ffff);
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
                color: white;
                text-shadow: 0 0 10px rgba(0,0,0,0.5);
            }
            .fun-comp-close {
                background: rgba(0,0,0,0.3);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
            }
            
            .fun-comp-categories {
                flex: 1;
                overflow-y: auto;
                padding: 10px;
            }
            
            .fun-comp-category {
                margin-bottom: 10px;
            }
            .fun-comp-category summary {
                background: rgba(255,255,255,0.05);
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                color: var(--cyan, #00ffff);
                list-style: none;
            }
            .fun-comp-category summary::-webkit-details-marker { display: none; }
            .fun-comp-category summary::before {
                content: '▶ ';
                font-size: 10px;
            }
            .fun-comp-category[open] summary::before { content: '▼ '; }
            
            .fun-comp-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
                padding: 10px 5px;
            }
            
            .fun-comp-item {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 8px;
                padding: 10px 8px;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s;
            }
            .fun-comp-item:hover {
                background: rgba(255,0,204,0.2);
                border-color: var(--magenta, #ff00cc);
                transform: scale(1.05);
            }
            .fun-comp-emoji {
                display: block;
                font-size: 1.5em;
                margin-bottom: 4px;
            }
            .fun-comp-name {
                font-size: 10px;
                color: var(--text-dim, #888);
            }
            
            /* Toggle button in toolbar */
            #fun-comp-toggle {
                background: linear-gradient(135deg, #ff00cc, #00ffff);
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                color: white;
                font-size: 12px;
                transition: transform 0.2s;
            }
            #fun-comp-toggle:hover { transform: scale(1.1); }
        `;
        document.head.appendChild(style);
    }

    // Initialize
    function init() {
        addStyles();
        
        // Add panel to body
        const panelHTML = buildComponentsPanelHTML();
        document.body.insertAdjacentHTML('beforeend', panelHTML);
        
        // Add toggle button to toolbar
        const toolbar = document.querySelector('.toolbar-inner') || document.querySelector('.toolbar');
        if (toolbar) {
            const existingBtn = document.getElementById('fun-comp-toggle');
            if (!existingBtn) {
                const btn = document.createElement('button');
                btn.id = 'fun-comp-toggle';
                btn.innerHTML = '🎪 Fun';
                btn.onclick = () => {
                    document.getElementById('fun-components-panel').classList.toggle('open');
                    if (window.playSound) window.playSound('pop');
                };
                // Insert after Assets button
                const assetsBtn = toolbar.querySelector('[onclick*="asset"]') || toolbar.querySelector('#asset-btn');
                if (assetsBtn) {
                    assetsBtn.parentNode.insertBefore(btn, assetsBtn.nextSibling);
                } else {
                    toolbar.appendChild(btn);
                }
            }
        }
        
        console.log('🎪 Fun Components loaded! Click the "🎪 Fun" button to access.');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for external use
    window.FUN_COMPONENTS = FUN_COMPONENTS;
})();
