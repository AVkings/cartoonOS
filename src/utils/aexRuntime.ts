export interface AEXMeta {
  app: string;
  version: string;
  author: string;
  icon: string;
  description: string;
}

export interface ParsedAEX {
  meta: AEXMeta;
  style: string;
  render: string;
  script: string;
}

export function parseAEX(source: string): ParsedAEX {
  const meta: AEXMeta = { app: 'Unknown', version: '1.0', author: 'Unknown', icon: '📦', description: '' };

  // Parse @metadata lines
  for (const line of source.split('\n')) {
    const m = line.match(/^@(\w+)\s+"(.+?)"\s*$/);
    if (m) {
      const [, key, value] = m;
      if (key in meta) (meta as unknown as Record<string, string>)[key] = value;
    }
  }

  // Split by ---SECTION--- markers
  const sectionPattern = /---(\w+)---/g;
  const sections: Record<string, string> = {};
  
  // Find all markers and their positions
  const markers: { name: string; start: number; end: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = sectionPattern.exec(source)) !== null) {
    markers.push({ name: match[1], start: match.index, end: match.index + match[0].length });
  }

  // Extract content between markers
  for (let i = 0; i < markers.length; i++) {
    const current = markers[i];
    const next = markers[i + 1];
    const contentEnd = next ? next.start : source.length;
    sections[current.name] = source.slice(current.end, contentEnd).trim();
  }

  // Fallback: try simple split
  if (Object.keys(sections).length === 0) {
    const parts = source.split('---');
    for (let i = 0; i < parts.length; i++) {
      const key = parts[i].trim();
      if (['STYLE', 'RENDER', 'SCRIPT'].includes(key)) {
        sections[key] = parts[i + 1]?.trim() ?? '';
      }
    }
  }

  return { meta, style: sections['STYLE'] ?? '', render: sections['RENDER'] ?? '', script: sections['SCRIPT'] ?? '' };
}

export function buildAEXDocument(source: string): string {
  const { style, render, script } = parseAEX(source);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Nunito',system-ui,sans-serif;background:#FDFBF7;color:#000;min-height:100vh;}
/* AEX default neo-brutalist utilities */
.neo-btn{border:3px solid #000;box-shadow:3px 3px 0 #000;font-weight:700;cursor:pointer;transition:all .1s;}
.neo-btn:active{transform:translate(2px,2px);box-shadow:none;}
.neo-card{border:3px solid #000;box-shadow:4px 4px 0 #000;background:#fff;padding:16px;}
#_aex_console{position:fixed;bottom:0;left:0;right:0;max-height:100px;overflow-y:auto;background:#111;color:#0f0;font-family:monospace;font-size:12px;padding:4px 8px;display:none;z-index:9999;}
#_aex_console.on{display:block;}
${style}
</style>
</head>
<body>
${render}
<div id="_aex_console"></div>
<script>
// ===== AEX Runtime API =====
const aex = {
  title: (t) => document.title = t,
  alert: (t) => alert(String(t)),
  log: (t) => { 
    const c = document.getElementById('_aex_console');
    c.classList.add('on');
    c.innerHTML += '<div>&gt; ' + String(t) + '</div>';
    c.scrollTop = c.scrollHeight;
  },
  color: { pink:'#FF90E8', blue:'#90C2FF', yellow:'#FFDE90', green:'#90FF90', red:'#FF9090' }
};
// Python-style aliases
function print(t) { aex.log(t); }
const True = true, False = false, None = null;
function range(n) { return [...Array(n).keys()]; }

${script}
</script>
</body>
</html>`;
}

// ─── Bundled AEX App Store apps ──────────────────────────────────────────────

export const STORE_APPS: { id: string; source: string }[] = [
  {
    id: 'calc',
    source: `@app "Calculator"
@version "1.0"
@author "CartoonOS"
@icon "🔢"
@description "A fully functional calculator with cartoon styling"

---STYLE---
body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#FDFBF7;}
.calc{background:#fff;border:4px solid #000;box-shadow:8px 8px 0 #000;padding:16px;width:280px;border-radius:12px;}
.disp{background:#000;color:#0f0;font-size:32px;font-weight:900;padding:12px;text-align:right;border:2px solid #333;border-radius:6px;min-height:64px;word-break:break-all;margin-bottom:12px;font-family:monospace;}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.btn{padding:16px 8px;border:3px solid #000;font-size:18px;font-weight:800;cursor:pointer;box-shadow:3px 3px 0 #000;border-radius:8px;background:#fff;transition:all .1s;font-family:inherit;}
.btn:active{transform:translate(2px,2px);box-shadow:none;}
.op{background:#90C2FF;} .eq{background:#FF90E8;grid-column:span 2;} .ac{background:#FF9090;} .zero{grid-column:span 2;}

---RENDER---
<div class="calc">
  <div class="disp" id="d">0</div>
  <div class="grid">
    <button class="btn ac" onclick="c()">AC</button>
    <button class="btn op" onclick="op('+/-')">+/-</button>
    <button class="btn op" onclick="op('%')">%</button>
    <button class="btn op" onclick="op('/')">÷</button>
    <button class="btn" onclick="n('7')">7</button>
    <button class="btn" onclick="n('8')">8</button>
    <button class="btn" onclick="n('9')">9</button>
    <button class="btn op" onclick="op('*')">×</button>
    <button class="btn" onclick="n('4')">4</button>
    <button class="btn" onclick="n('5')">5</button>
    <button class="btn" onclick="n('6')">6</button>
    <button class="btn op" onclick="op('-')">−</button>
    <button class="btn" onclick="n('1')">1</button>
    <button class="btn" onclick="n('2')">2</button>
    <button class="btn" onclick="n('3')">3</button>
    <button class="btn op" onclick="op('+')">+</button>
    <button class="btn zero" onclick="n('0')">0</button>
    <button class="btn" onclick="n('.')">.</button>
    <button class="btn eq" onclick="eq()">=</button>
  </div>
</div>

---SCRIPT---
let cur='0',prev='',oper='',fresh=true;
const d=()=>document.getElementById('d');
function n(v){if(fresh){cur=v==='.'?'0.':v;fresh=false;}else{if(v==='.'&&cur.includes('.'))return;cur=cur==='0'&&v!=='.'?v:cur+v;}d().textContent=cur;}
function op(o){if(o==='+/-'){cur=String(parseFloat(cur)*-1);d().textContent=cur;return;}if(o==='%'){cur=String(parseFloat(cur)/100);d().textContent=cur;return;}if(!fresh)eq();prev=cur;oper=o;fresh=true;}
function eq(){if(!oper||fresh)return;const a=parseFloat(prev),b=parseFloat(cur);let r;if(oper==='+')r=a+b;else if(oper==='-')r=a-b;else if(oper==='*')r=a*b;else if(oper==='/')r=b===0?'ERR':a/b;cur=String(r);d().textContent=cur;oper='';fresh=true;}
function c(){cur='0';prev='';oper='';fresh=true;d().textContent='0';}
`
  },
  {
    id: 'paint',
    source: `@app "MiniPaint"
@version "1.0"
@author "CartoonOS"
@icon "🎨"
@description "A mini drawing canvas with brush and eraser"

---STYLE---
body{margin:0;padding:0;background:#f0f0f0;overflow:hidden;}
#toolbar{display:flex;gap:8px;align-items:center;padding:8px 12px;background:#FFDE90;border-bottom:3px solid #000;}
.tool-btn{border:3px solid #000;box-shadow:2px 2px 0 #000;padding:6px 12px;font-weight:800;cursor:pointer;border-radius:6px;font-family:inherit;font-size:13px;}
.tool-btn:active{transform:translate(2px,2px);box-shadow:none;}
.tool-btn.active{background:#000;color:#fff;}
canvas{display:block;cursor:crosshair;}
input[type=color]{border:3px solid #000;width:40px;height:36px;cursor:pointer;padding:0;}
input[type=range]{width:80px;}
#size-label{font-weight:700;font-size:12px;min-width:30px;}

---RENDER---
<div id="toolbar">
  <button class="tool-btn active" id="btn-brush" onclick="setTool('brush')">🖊 Brush</button>
  <button class="tool-btn" id="btn-eraser" onclick="setTool('eraser')">⬜ Eraser</button>
  <input type="color" id="color" value="#000000" title="Color">
  <input type="range" id="size" min="1" max="40" value="6" oninput="sz=this.valueAsNumber;document.getElementById('size-label').textContent=sz+'px'">
  <span id="size-label">6px</span>
  <button class="tool-btn" onclick="ctx.clearRect(0,0,canvas.width,canvas.height)">🗑 Clear</button>
</div>
<canvas id="canvas"></canvas>

---SCRIPT---
const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
let drawing=false,tool='brush',sz=6;
function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight-canvas.getBoundingClientRect().top;}
window.onload=resize; window.onresize=resize;
function setTool(t){tool=t;document.querySelectorAll('.tool-btn').forEach(b=>b.classList.remove('active'));document.getElementById('btn-'+t).classList.add('active');}
canvas.onmousedown=e=>{drawing=true;ctx.beginPath();ctx.moveTo(e.offsetX,e.offsetY);};
canvas.onmousemove=e=>{if(!drawing)return;ctx.lineWidth=tool==='eraser'?sz*4:sz;ctx.lineCap='round';ctx.strokeStyle=tool==='eraser'?'#f0f0f0':document.getElementById('color').value;ctx.lineTo(e.offsetX,e.offsetY);ctx.stroke();};
canvas.onmouseup=canvas.onmouseleave=()=>drawing=false;
`
  },
  {
    id: 'snake',
    source: `@app "Snake Game"
@version "1.0"
@author "CartoonOS"
@icon "🐍"
@description "Classic snake game with cartoon colors"

---STYLE---
body{margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#90FF90;font-family:inherit;}
h2{font-size:24px;font-weight:900;margin-bottom:8px;}
canvas{border:4px solid #000;box-shadow:6px 6px 0 #000;background:#FDFBF7;}
#score{font-size:20px;font-weight:800;margin-bottom:8px;}
#msg{font-size:16px;font-weight:700;margin-top:8px;min-height:24px;}

---RENDER---
<h2>🐍 Cartoon Snake</h2>
<div id="score">Score: 0</div>
<canvas id="c" width="320" height="320"></canvas>
<div id="msg">Press Arrow keys or WASD to start!</div>

---SCRIPT---
const C=document.getElementById('c'),ctx=C.getContext('2d'),S=20,G=16;
let snake=[{x:8,y:8}],dir={x:0,y:0},food={x:5,y:5},score=0,running=false,loop;
const colors=['#FF90E8','#90C2FF','#FFDE90','#FF9090'];
function draw(){
  ctx.clearRect(0,0,C.width,C.height);
  ctx.fillStyle='#FF9090';ctx.fillRect(food.x*S,food.y*S,S,S);
  ctx.strokeStyle='#000';ctx.strokeRect(food.x*S,food.y*S,S,S);
  snake.forEach((s,i)=>{ctx.fillStyle=colors[i%colors.length];ctx.fillRect(s.x*S,s.y*S,S,S);ctx.strokeStyle='#000';ctx.strokeRect(s.x*S,s.y*S,S,S);});
}
function rand(n){return Math.floor(Math.random()*n);}
function placeFood(){food={x:rand(G),y:rand(G)};}
function step(){
  if(dir.x===0&&dir.y===0)return;
  const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  if(h.x<0||h.y<0||h.x>=G||h.y>=G||snake.some(s=>s.x===h.x&&s.y===h.y)){
    running=false;clearInterval(loop);document.getElementById('msg').textContent='💀 Game Over! Refresh to restart.';return;
  }
  snake.unshift(h);
  if(h.x===food.x&&h.y===food.y){score++;document.getElementById('score').textContent='Score: '+score;placeFood();}
  else snake.pop();
  draw();
}
document.addEventListener('keydown',e=>{
  const k={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},KeyW:{x:0,y:-1},KeyS:{x:0,y:1},KeyA:{x:-1,y:0},KeyD:{x:1,y:0}};
  const nd=k[e.code];
  if(nd&&!(nd.x===-dir.x&&nd.y===-dir.y)){dir=nd;if(!running){running=true;loop=setInterval(step,150);document.getElementById('msg').textContent='';}}
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();
});
placeFood();draw();
`
  },
  {
    id: 'clock',
    source: `@app "World Clock"
@version "1.0"
@author "CartoonOS"
@icon "🕐"
@description "Animated analog + digital clock"

---STYLE---
body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#FF90E8;gap:16px;}
canvas{border:4px solid #000;box-shadow:6px 6px 0 #000;border-radius:50%;}
#digital{font-size:36px;font-weight:900;font-family:monospace;background:#000;color:#0f0;padding:8px 24px;border:3px solid #000;box-shadow:4px 4px 0 #000;}
#date{font-size:18px;font-weight:700;}

---RENDER---
<canvas id="clock" width="200" height="200"></canvas>
<div id="digital">00:00:00</div>
<div id="date"></div>

---SCRIPT---
const c=document.getElementById('clock'),ctx=c.getContext('2d'),R=96;
function draw(){
  const now=new Date(),h=now.getHours(),m=now.getMinutes(),s=now.getSeconds();
  document.getElementById('digital').textContent=[h,m,s].map(x=>String(x).padStart(2,'0')).join(':');
  document.getElementById('date').textContent=now.toDateString();
  // Draw clock face
  ctx.clearRect(0,0,200,200);
  ctx.fillStyle='#FDFBF7';ctx.beginPath();ctx.arc(100,100,R,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#000';ctx.lineWidth=4;ctx.stroke();
  // Hour marks
  for(let i=0;i<12;i++){const a=i*Math.PI/6;ctx.beginPath();ctx.moveTo(100+Math.cos(a)*80,100+Math.sin(a)*80);ctx.lineTo(100+Math.cos(a)*90,100+Math.sin(a)*90);ctx.lineWidth=3;ctx.stroke();}
  // Hour hand
  const ha=(h%12+m/60)*Math.PI/6-Math.PI/2;
  ctx.beginPath();ctx.moveTo(100,100);ctx.lineTo(100+Math.cos(ha)*55,100+Math.sin(ha)*55);ctx.lineWidth=6;ctx.strokeStyle='#000';ctx.lineCap='round';ctx.stroke();
  // Minute hand
  const ma=(m+s/60)*Math.PI/30-Math.PI/2;
  ctx.beginPath();ctx.moveTo(100,100);ctx.lineTo(100+Math.cos(ma)*75,100+Math.sin(ma)*75);ctx.lineWidth=4;ctx.stroke();
  // Second hand
  const sa=s*Math.PI/30-Math.PI/2;
  ctx.beginPath();ctx.moveTo(100,100);ctx.lineTo(100+Math.cos(sa)*80,100+Math.sin(sa)*80);ctx.lineWidth=2;ctx.strokeStyle='#FF90E8';ctx.stroke();
  // Center dot
  ctx.beginPath();ctx.arc(100,100,6,0,Math.PI*2);ctx.fillStyle='#000';ctx.fill();
}
setInterval(draw,1000);draw();
`
  },
  {
    id: 'hello',
    source: `@app "Hello World Template"
@version "1.0"
@author "CartoonOS"
@icon "👋"
@description "A starter template to build your first AEX app"

---STYLE---
body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#90C2FF;gap:16px;padding:24px;}
.card{background:white;border:4px solid black;box-shadow:6px 6px 0 black;padding:32px;text-align:center;max-width:400px;width:100%;border-radius:12px;}
h1{font-size:28px;font-weight:900;margin-bottom:8px;}
p{font-size:16px;margin-bottom:16px;color:#444;}
#counter{font-size:48px;font-weight:900;margin:16px 0;}
.btn{background:#FF90E8;border:3px solid black;box-shadow:3px 3px 0 black;padding:12px 24px;font-size:18px;font-weight:800;cursor:pointer;border-radius:8px;font-family:inherit;transition:all .1s;}
.btn:active{transform:translate(2px,2px);box-shadow:none;}

---RENDER---
<div class="card">
  <h1>👋 Hello, CartoonOS!</h1>
  <p>This is your starter AEX template. Edit it in the Code Editor!</p>
  <div id="counter">0</div>
  <button class="btn" onclick="increment()">Click Me!</button>
  <br><br>
  <button class="btn" style="background:#90FF90" onclick="reset()">Reset</button>
</div>

---SCRIPT---
let count = 0;

function increment() {
  count++;
  document.getElementById('counter').textContent = count;
  if (count === 10) print('You hit 10! Great job!');
  if (count === 100) aex.alert('WOW! 100 clicks! You are amazing!');
}

function reset() {
  count = 0;
  document.getElementById('counter').textContent = '0';
  print('Counter reset.');
}

print('Hello World app loaded!');
`
  }
];
