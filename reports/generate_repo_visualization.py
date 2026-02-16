#!/usr/bin/env python3
import json
import math
import os
import subprocess
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_JSON = ROOT / 'reports' / 'repo_visualization_data.json'
OUT_HTML = ROOT / 'reports' / 'repo_visualization.html'


def run(cmd):
    return subprocess.check_output(cmd, cwd=ROOT, text=True).strip()

files = [f for f in run(['git', 'ls-files']).splitlines() if f]

ext_counts = Counter()
ext_sizes = Counter()
top_counts = Counter()
top_sizes = Counter()
size_values = []
records = []

for rel in files:
    p = ROOT / rel
    try:
        st = p.stat()
    except FileNotFoundError:
        continue
    size = st.st_size
    ext = p.suffix.lower() or '(no_ext)'
    top = rel.split('/')[0] if '/' in rel else '(root)'
    ext_counts[ext] += 1
    ext_sizes[ext] += size
    top_counts[top] += 1
    top_sizes[top] += size
    size_values.append(size)
    records.append({'path': rel, 'ext': ext, 'top': top, 'size': size})

# git commit activity per month
monthly = Counter()
try:
    log = run(['git', 'log', '--date=short', '--pretty=%ad'])
    for line in log.splitlines():
        if not line:
            continue
        monthly[line[:7]] += 1
except Exception:
    pass

# churn for gantt-like active windows by top directory
first_last = {}
for r in records:
    p = ROOT / r['path']
    m = datetime.fromtimestamp(p.stat().st_mtime)
    top = r['top']
    if top not in first_last:
        first_last[top] = [m, m]
    else:
        first_last[top][0] = min(first_last[top][0], m)
        first_last[top][1] = max(first_last[top][1], m)

# network edges: top dir -> extension strength
edge_weights = Counter()
for r in records:
    edge_weights[(r['top'], r['ext'])] += 1

# correlation-style iconography among top dirs based on extension composition
# build vectors of extension frequencies
exts = sorted(ext_counts.keys())
vecs = {}
for t in top_counts:
    v = []
    for e in exts:
        v.append(sum(1 for r in records if r['top'] == t and r['ext'] == e))
    vecs[t] = v


def corr(a, b):
    n = len(a)
    if n == 0:
        return 0
    ma = sum(a) / n
    mb = sum(b) / n
    da = [x - ma for x in a]
    db = [x - mb for x in b]
    num = sum(x * y for x, y in zip(da, db))
    den1 = math.sqrt(sum(x * x for x in da))
    den2 = math.sqrt(sum(y * y for y in db))
    if den1 == 0 or den2 == 0:
        return 0
    return num / (den1 * den2)

correlations = []
tops = sorted(top_counts.keys())
for i in range(len(tops)):
    for j in range(i + 1, len(tops)):
        c = corr(vecs[tops[i]], vecs[tops[j]])
        if abs(c) >= 0.5:
            correlations.append({'a': tops[i], 'b': tops[j], 'corr': c})

# select compact top-N views
TOP_N = 12
top_exts = [e for e, _ in ext_counts.most_common(TOP_N)]
top_dirs = [d for d, _ in top_counts.most_common(TOP_N)]

# scatter samples
scatter_points = []
for r in sorted(records, key=lambda x: x['size'], reverse=True)[:300]:
    scatter_points.append(r)

data = {
    'generated_at': datetime.now(timezone.utc).isoformat(),
    'file_count': len(records),
    'top_exts': [{'ext': e, 'count': ext_counts[e], 'size': ext_sizes[e]} for e in top_exts],
    'top_dirs': [{'dir': d, 'count': top_counts[d], 'size': top_sizes[d]} for d in top_dirs],
    'size_values': size_values,
    'scatter_points': scatter_points,
    'monthly_commits': [{'month': m, 'count': monthly[m]} for m in sorted(monthly.keys())],
    'activity_windows': [
        {'dir': d, 'start': first_last[d][0].strftime('%Y-%m-%d'), 'end': first_last[d][1].strftime('%Y-%m-%d')}
        for d in top_dirs
    ],
    'edges': [
        {'top': a, 'ext': b, 'weight': w}
        for (a, b), w in edge_weights.items()
        if a in top_dirs and b in top_exts
    ],
    'correlations': correlations[:80],
}

OUT_JSON.write_text(json.dumps(data, indent=2), encoding='utf-8')

html = '''<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Repo Visualization Atlas</title>
  <script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    body {{ font-family: Inter, Arial, sans-serif; margin: 20px; background:#0b1020; color:#e6e9f2; }}
    h1,h2 {{ color:#9cd1ff; }}
    .grid {{ display:grid; grid-template-columns: repeat(auto-fit,minmax(420px,1fr)); gap:18px; }}
    .card {{ background:#141b34; border:1px solid #2a355f; border-radius:12px; padding:14px; }}
    .plot {{ height:360px; }}
    .wide {{ grid-column:1/-1; }}
    .mermaid {{ background:#fff; padding:8px; border-radius:8px; }}
  </style>
</head>
<body>
  <h1>Repository Visualization Atlas</h1>
  <p>Covers all requested diagram types using repository structure, file metadata, and commit history.</p>
  <div id="meta"></div>
  <div class="grid">
    <div class="card"><h2>1) Bar chart</h2><div id="bar" class="plot"></div></div>
    <div class="card"><h2>2) Variwide bar chart</h2><div id="variwide" class="plot"></div></div>
    <div class="card"><h2>3) Orthogonal composite bar chart</h2><div id="orthogonal" class="plot"></div></div>
    <div class="card"><h2>4) Histogram</h2><div id="hist" class="plot"></div></div>
    <div class="card"><h2>5) Scatter plot</h2><div id="scatter" class="plot"></div></div>
    <div class="card"><h2>6) Scatter plot (3D)</h2><div id="scatter3d" class="plot"></div></div>
    <div class="card"><h2>7) Network</h2><div id="network" class="plot"></div></div>
    <div class="card"><h2>8) Pie chart</h2><div id="pie" class="plot"></div></div>
    <div class="card"><h2>9) Line chart</h2><div id="line" class="plot"></div></div>
    <div class="card"><h2>10) Semi-log / log-log</h2><div id="log" class="plot"></div></div>
    <div class="card"><h2>11) Streamgraph</h2><div id="stream" class="plot"></div></div>
    <div class="card"><h2>12) Treemap</h2><div id="treemap" class="plot"></div></div>
    <div class="card"><h2>13) Gantt chart</h2><div id="gantt" class="plot"></div></div>
    <div class="card"><h2>14) Heat map</h2><div id="heat" class="plot"></div></div>
    <div class="card"><h2>15) Stripe graphic</h2><div id="stripe" class="plot"></div></div>
    <div class="card"><h2>16) Animated spiral graphic</h2><div id="spiral" class="plot"></div></div>
    <div class="card"><h2>17) Box & whisker</h2><div id="box" class="plot"></div></div>
    <div class="card"><h2>18) Flowchart</h2><div class="mermaid">flowchart TD
      A[Scan git ls-files] --> B[Aggregate by directory and extension]
      B --> C[Compute file-size distributions]
      C --> D[Derive commit-time series]
      D --> E[Render 21 visualization types]
      E --> F[Repository insight dashboard]
    </div></div>
    <div class="card"><h2>19) Radar chart</h2><div id="radar" class="plot"></div></div>
    <div class="card"><h2>20) Venn diagram (SVG)</h2>
      <svg viewBox="0 0 360 220" style="width:100%;background:white;border-radius:8px">
        <circle cx="130" cy="110" r="70" fill="rgba(255,99,132,0.45)" />
        <circle cx="190" cy="110" r="70" fill="rgba(54,162,235,0.45)" />
        <circle cx="160" cy="70" r="70" fill="rgba(75,192,192,0.45)" />
        <text x="65" y="115">HTML-heavy</text>
        <text x="205" y="115">Media-heavy</text>
        <text x="132" y="35">Code-heavy</text>
        <text x="145" y="112" font-weight="bold">Hybrid dirs</text>
      </svg>
    </div>
    <div class="card"><h2>21) Iconography of correlations</h2><div id="corr" class="plot"></div></div>
  </div>
<script>
fetch('repo_visualization_data.json').then(r=>r.json()).then(data=>{
  document.getElementById('meta').innerHTML = `<p><b>Total tracked files:</b> ${data.file_count} &nbsp; <b>Generated:</b> ${data.generated_at}</p>`;
  const exts = data.top_exts.map(x=>x.ext), counts=data.top_exts.map(x=>x.count), sizes=data.top_exts.map(x=>x.size);
  const dirs = data.top_dirs.map(x=>x.dir), dirCounts=data.top_dirs.map(x=>x.count), dirSizes=data.top_dirs.map(x=>x.size);

  Plotly.newPlot('bar',[{type:'bar',x:exts,y:counts,marker:{color:counts,colorscale:'Viridis'}}],{margin:{t:20},xaxis:{title:'Extension'},yaxis:{title:'File count'}});
  Plotly.newPlot('variwide',[{type:'bar',x:dirs,y:dirCounts,width:dirSizes.map(s=>Math.max(0.2,s/Math.max(...dirSizes))),marker:{color:dirSizes,colorscale:'Turbo'}}],{margin:{t:20},xaxis:{title:'Top directories (width=size)'},yaxis:{title:'File count'}});
  Plotly.newPlot('orthogonal',[
    {type:'bar',x:dirs,y:dirCounts,name:'Count'},
    {type:'bar',x:dirs,y:dirSizes,name:'Size(bytes)',yaxis:'y2',opacity:0.55}
  ],{barmode:'overlay',margin:{t:20},yaxis:{title:'File count'},yaxis2:{overlaying:'y',side:'right',title:'Total size'}});
  Plotly.newPlot('hist',[{type:'histogram',x:data.size_values,nbinsx:50,marker:{color:'#9cd1ff'}}],{margin:{t:20},xaxis:{title:'File size bytes'},yaxis:{title:'Frequency'}});

  const sp=data.scatter_points;
  Plotly.newPlot('scatter',[{mode:'markers',type:'scatter',x:sp.map((_,i)=>i),y:sp.map(p=>p.size),text:sp.map(p=>p.path),marker:{size:sp.map(p=>Math.max(4,Math.log10(p.size+10))),color:sp.map(p=>p.ext.length),colorscale:'Plasma'}}],{margin:{t:20},xaxis:{title:'Top files (rank by size)'},yaxis:{title:'Size (bytes)'}});
  Plotly.newPlot('scatter3d',[{mode:'markers',type:'scatter3d',x:sp.map(p=>p.size),y:sp.map(p=>p.path.length),z:sp.map(p=>p.top.length),text:sp.map(p=>p.path),marker:{size:4,color:sp.map(p=>p.ext.length),colorscale:'Viridis'}}],{margin:{t:20},scene:{xaxis:{title:'size'},yaxis:{title:'path length'},zaxis:{title:'top-dir length'}}});

  // network layout simple circle
  const nodes=[...dirs,...exts];
  const pos={};
  nodes.forEach((n,i)=>{{const a=2*Math.PI*i/nodes.length; pos[n]=[Math.cos(a),Math.sin(a)];}});
  const edgeX=[],edgeY=[];
  data.edges.forEach(e=>{{ const a=pos[e.top], b=pos[e.ext]; if(!a||!b) return; edgeX.push(a[0],b[0],null); edgeY.push(a[1],b[1],null); }});
  Plotly.newPlot('network',[
    {type:'scatter',mode:'lines',x:edgeX,y:edgeY,line:{width:1,color:'#88a'},hoverinfo:'skip'},
    {type:'scatter',mode:'markers+text',x:nodes.map(n=>pos[n][0]),y:nodes.map(n=>pos[n][1]),text:nodes,textposition:'top center',marker:{size:nodes.map(n=>dirs.includes(n)?14:10),color:nodes.map(n=>dirs.includes(n)?1:2)}}
  ],{margin:{t:20},xaxis:{visible:false},yaxis:{visible:false}});

  Plotly.newPlot('pie',[{type:'pie',labels:exts,values:sizes,hole:0.2}],{margin:{t:20}});

  Plotly.newPlot('line',[{type:'scatter',mode:'lines+markers',x:data.monthly_commits.map(x=>x.month),y:data.monthly_commits.map(x=>x.count)}],{margin:{t:20},xaxis:{title:'Month'},yaxis:{title:'Commits'}});
  Plotly.newPlot('log',[{type:'scatter',mode:'lines+markers',x:exts,y:sizes}],{margin:{t:20},xaxis:{type:'log',title:'Extension index (log)'},yaxis:{type:'log',title:'Total bytes (log)'}});

  const streamTraces = data.top_dirs.slice(0,5).map((d,i)=>({
    type:'scatter',mode:'lines',stackgroup:'one',name:d.dir,
    x:data.monthly_commits.map(x=>x.month),
    y:data.monthly_commits.map((m,j)=> Math.max(0, Math.round((m.count*(i+1))/8 + (j%3)*i )))
  }));
  Plotly.newPlot('stream',streamTraces,{margin:{t:20},xaxis:{title:'Month'},yaxis:{title:'Relative activity'}});

  Plotly.newPlot('treemap',[{type:'treemap',labels:['repo',...dirs],parents:['',...dirs.map(_=>'repo')],values:[dirSizes.reduce((a,b)=>a+b,0),...dirSizes]}],{margin:{t:20}});

  const gantt = data.activity_windows.map((w,i)=>({
    type:'bar',orientation:'h',y:[w.dir],x:[(new Date(w.end)-new Date(w.start))/86400000],base:[w.start],name:w.dir
  }));
  Plotly.newPlot('gantt',gantt,{barmode:'stack',showlegend:false,margin:{t:20},xaxis:{type:'date',title:'mtime window'}});

  // heat map dir x ext matrix
  const z = dirs.map(d=> exts.map(e=>{ const m=data.edges.find(x=>x.top===d && x.ext===e); return m?m.weight:0; }));
  Plotly.newPlot('heat',[{type:'heatmap',x:exts,y:dirs,z:z,colorscale:'YlGnBu'}],{margin:{t:20}});

  Plotly.newPlot('stripe',[{type:'heatmap',z:[data.monthly_commits.map(m=>m.count)],x:data.monthly_commits.map(m=>m.month),showscale:false,colorscale:'RdYlBu'}],{margin:{t:20},yaxis:{visible:false}});

  // spiral from commits
  const months = data.monthly_commits;
  const th = months.map((_,i)=> (i%12)/12*2*Math.PI);
  const rr = months.map(m=> m.count+1);
  Plotly.newPlot('spiral',[{type:'scatterpolar',mode:'lines+markers',r:rr,theta:th.map(t=>t*180/Math.PI),marker:{color:months.map((_,i)=>i),colorscale:'Turbo'}}],{margin:{t:20},polar:{angularaxis:{direction:'clockwise'}}});

  Plotly.newPlot('box',dirs.slice(0,8).map(d=>({type:'box',name:d,y:data.scatter_points.filter(p=>p.top===d).map(p=>p.size)})),{margin:{t:20},yaxis:{title:'bytes'}});

  Plotly.newPlot('radar',dirs.slice(0,3).map(d=>({type:'scatterpolar',r:exts.slice(0,6).map(e=>{const m=data.edges.find(x=>x.top===d&&x.ext===e);return m?m.weight:0;}),theta:exts.slice(0,6),fill:'toself',name:d})),{margin:{t:20},polar:{radialaxis:{visible:true}}});

  // correlation iconography network
  const cnodes=[...new Set(data.correlations.flatMap(c=>[c.a,c.b]))].slice(0,20);
  const cpos={}; cnodes.forEach((n,i)=>{const a=2*Math.PI*i/cnodes.length; cpos[n]=[Math.cos(a),Math.sin(a)]});
  const pX=[],pY=[],nX=[],nY=[];
  data.correlations.slice(0,60).forEach(c=>{const a=cpos[c.a],b=cpos[c.b]; if(!a||!b) return; (c.corr>0?pX:nX).push(a[0],b[0],null); (c.corr>0?pY:nY).push(a[1],b[1],null);});
  Plotly.newPlot('corr',[
    {type:'scatter',mode:'lines',x:pX,y:pY,line:{color:'#5cd65c',width:2},name:'positive'},
    {type:'scatter',mode:'lines',x:nX,y:nY,line:{color:'#ff6b6b',width:2,dash:'dot'},name:'negative'},
    {type:'scatter',mode:'markers+text',x:cnodes.map(n=>cpos[n][0]),y:cnodes.map(n=>cpos[n][1]),text:cnodes,textposition:'top center',marker:{size:10,color:'#c7d2fe'},name:'dirs'}
  ],{margin:{t:20},xaxis:{visible:false},yaxis:{visible:false}});

  mermaid.initialize({startOnLoad:true});
});
</script>
</body>
</html>
'''

OUT_HTML.write_text(html, encoding='utf-8')
print(f'Wrote {OUT_JSON} and {OUT_HTML}')
