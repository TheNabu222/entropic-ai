
// ============================================
// EMBEDDED PAGE SOURCES
// Instant-load raw HTML for the page loader
// ============================================

window.PAGE_SOURCE_HTML = {
    "index.html": `<!DOCTYPE html>
<html>
<head>
    <title>Welcome to My Homepage</title>
    <style>
        body { background-color: #000000; color: #00ff00; font-family: 'Courier New', monospace; padding: 40px; }
        h1 { text-shadow: 2px 2px #003300; }
        .container { border: 2px solid #00ff00; padding: 20px; max-width: 600px; margin: 0 auto; }
        a { color: #ff00ff; text-decoration: none; }
        a:hover { background-color: #ff00ff; color: #000000; }
    </style>
</head>
<body>
    <div class="container">
        <center>
            <h1>★ WELCOME TO THE NET ★</h1>
            <p>You have reached the digital frontier.</p>
            <marquee>UPDATES: NEW LINKS ADDED 11/25/2025 *** SIGN THE GUESTBOOK ***</marquee>
            <br>
            <img src="https://coaiexist.wtf/assets/clipart/computer.gif" alt="Computer">
            <br><br>
            [ <a href="#">ENTER</a> ] &nbsp; [ <a href="#">EXIT</a> ]
        </center>
    </div>
</body>
</html>`,
    
    "about_me.html": `<!DOCTYPE html>
<html>
<body style="background-image: url('https://coaiexist.wtf/assets/backgrounds/stars.gif'); color: yellow; font-family: 'Comic Sans MS', cursive;">
    <table border="1" bgcolor="#000080" width="800" align="center" cellpadding="10">
        <tr>
            <td>
                <center><h1>About Webmaster</h1></center>
                <p>Hi! I'm a retro web enthusiast.</p>
                <ul>
                    <li>Name: CyberSurfer</li>
                    <li>Location: The Grid</li>
                    <li>Likes: HTML, CSS, MIDI</li>
                </ul>
                <center><img src="https://coaiexist.wtf/assets/clipart/email.gif"></center>
            </td>
        </tr>
    </table>
</body>
</html>`,

    "matrix_rain.html": `<!DOCTYPE html>
<html>
<body style="margin: 0; overflow: hidden; background: black;">
    <canvas id="matrix"></canvas>
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-family: monospace; background: black; padding: 20px; border: 1px solid #0F0;">
        <h1>SYSTEM HACKED</h1>
    </div>
    <script>
        const canvas = document.getElementById('matrix');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const chars = '0101010101';
        const drops = Array(Math.floor(canvas.width / 20)).fill(1);
        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = '20px monospace';
            for(let i=0; i<drops.length; i++) {
                ctx.fillText(chars[Math.floor(Math.random()*chars.length)], i*20, drops[i]*20);
                if(drops[i]*20 > canvas.height && Math.random() > 0.975) drops[i]=0;
                drops[i]++;
            }
        }
        setInterval(draw, 50);
    </script>
</body>
</html>`
};

console.log('📦 Page Sources Loaded:', Object.keys(window.PAGE_SOURCE_HTML).length);
