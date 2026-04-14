import plotly.graph_objects as go
import plotly.io as pio

# Create a flowchart using plotly for the 4 Kastens framework decision tree
fig = go.Figure()

# Define positions for nodes in a tree structure
nodes = {
    'start': (0, 4, "Where does this<br>zettel belong?"),
    'k1': (-3, 2, "KASTEN I<br>Foundations<br>& Essences"),
    'k2': (-1, 2, "KASTEN II<br>Systems &<br>Synergies"), 
    'k3': (1, 2, "KASTEN III<br>Methods &<br>Meanings"),
    'k4': (3, 2, "KASTEN IV<br>Meta &<br>Morphe"),
    't1': (-3, 0, "Trunks:<br>1000, 4000<br>5000, 6000"),
    't2': (-1, 0, "Trunks:<br>2000, 7000<br>8000, 9000"),
    't3': (1, 0, "Trunks:<br>3000, 10000<br>11000"),
    't4': (3, 0, "Trunks:<br>12000, 13000<br>14000, 15000")
}

# Define connections between nodes
connections = [
    ('start', 'k1'), ('start', 'k2'), ('start', 'k3'), ('start', 'k4'),
    ('k1', 't1'), ('k2', 't2'), ('k3', 't3'), ('k4', 't4')
]

# Add connecting lines
for start, end in connections:
    x0, y0, _ = nodes[start]
    x1, y1, _ = nodes[end]
    fig.add_trace(go.Scatter(
        x=[x0, x1], y=[y0, y1],
        mode='lines',
        line=dict(color='#21808D', width=3),
        showlegend=False,
        hoverinfo='skip'
    ))

# Define colors for different node types
colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F', '#D2BA4C']
node_colors = {
    'start': '#1FB8CD',
    'k1': '#DB4545', 'k2': '#2E8B57', 'k3': '#5D878F', 'k4': '#D2BA4C',
    't1': '#DB4545', 't2': '#2E8B57', 't3': '#5D878F', 't4': '#D2BA4C'
}

# Add nodes with text
for node, (x, y, text) in nodes.items():
    fig.add_trace(go.Scatter(
        x=[x], y=[y],
        mode='markers+text',
        marker=dict(
            size=80 if node == 'start' else 70,
            color=node_colors[node],
            line=dict(width=2, color='white')
        ),
        text=text,
        textposition='middle center',
        textfont=dict(size=11 if node == 'start' else 10, color='white', family='Arial Black'),
        showlegend=False,
        hoverinfo='skip'
    ))

# Update layout
fig.update_layout(
    title="4 Kastens Decision Tree",
    xaxis=dict(
        showgrid=False, 
        zeroline=False, 
        showticklabels=False,
        range=[-4, 4]
    ),
    yaxis=dict(
        showgrid=False, 
        zeroline=False, 
        showticklabels=False,
        range=[-1, 5]
    ),
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='rgba(0,0,0,0)',
    showlegend=False
)

# Save as both PNG and SVG
fig.write_image('zettel_flowchart.png')
fig.write_image('zettel_flowchart.svg', format='svg')

print("4 Kastens Decision Tree flowchart created successfully!")
print("Saved as: zettel_flowchart.png and zettel_flowchart.svg")