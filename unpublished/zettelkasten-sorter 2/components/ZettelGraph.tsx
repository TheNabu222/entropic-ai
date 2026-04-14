import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { ZettelNode } from '../types';
import { ContextMenu } from './ContextMenu';
import { ARCHIVE_DATA } from '../data/archiveData';

interface ZettelGraphProps {
  nodes: ZettelNode[];
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  group: string;
  level: number;
  tags?: string[];
  originalNode: ZettelNode;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  type: 'hierarchy' | 'reference';
}

export const ZettelGraph: React.FC<ZettelGraphProps> = ({ nodes }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [menuState, setMenuState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    node: ZettelNode | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  });

  const closeMenu = useCallback(() => {
    setMenuState(prev => ({ ...prev, visible: false }));
  }, []);

  const handleArchive = useCallback((node: ZettelNode) => {
      try {
          const saved = localStorage.getItem('nabu_archive_data');
          const currentArchive = saved ? JSON.parse(saved) : ARCHIVE_DATA;
          
          if (currentArchive.some((z: any) => z.id === node.id)) {
              alert(`Zettel ${node.id} already exists in the archive.`);
              return;
          }

          // Map kingdom to category
          const kingdomMap: Record<string, string> = {
              'EXISTENTIA': 'Phenomenon',
              'COGNITIO': 'Concept',
              'VALOR': 'Protocol',
              'SIGNIFICATIO': 'Culture',
              'SYSTEMA': 'Protocol',
              'ACTUS': 'Event',
              'UNKNOWN': 'Concept'
          };

          const newZettel = {
              id: node.id,
              category: kingdomMap[node.kingdom || 'UNKNOWN'] || 'Concept',
              title: node.title,
              description: `Imported from Zettelkasten Sorter. Kingdom: ${node.kingdom}`,
              tags: node.tags || [],
              related: node.links || []
          };

          const updatedArchive = [...currentArchive, newZettel];
          localStorage.setItem('nabu_archive_data', JSON.stringify(updatedArchive));
          alert(`Zettel ${node.id} saved to archive!`);
      } catch (e) {
          console.error("Failed to save to archive", e);
          alert("Failed to save to archive.");
      }
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!nodes || nodes.length === 0 || !svgRef.current) return;

    // 1. Flatten the tree to get all nodes and links
    const graphNodes: GraphNode[] = [];
    const graphLinks: GraphLink[] = [];
    const nodeMap = new Map<string, GraphNode>();

    const traverse = (node: ZettelNode, parentId: string | null = null, level: number = 0) => {
      const gNode: GraphNode = {
        id: node.id,
        title: node.title,
        group: node.kingdom || 'UNKNOWN',
        level: level,
        tags: node.tags,
        originalNode: node
      };
      
      // Avoid duplicates (though tree shouldn't have them ideally)
      if (!nodeMap.has(node.id)) {
        graphNodes.push(gNode);
        nodeMap.set(node.id, gNode);
      }

      // Hierarchy Link
      if (parentId) {
        graphLinks.push({
          source: parentId,
          target: node.id,
          type: 'hierarchy',
        });
      }

      // Reference Links (from parsed links)
      if (node.links) {
          node.links.forEach(linkId => {
              // We only add the link if the target exists in our tree (or will exist)
              // Since we might traverse in any order, we just add it. 
              // D3 handles missing targets gracefully usually, or we filter later.
              graphLinks.push({
                  source: node.id,
                  target: linkId,
                  type: 'reference'
              });
          });
      }

      if (node.children) {
        node.children.forEach(child => traverse(child, node.id, level + 1));
      }
    };

    nodes.forEach(node => traverse(node));

    // Filter links to ensure both source and target exist in the node list
    const validLinks = graphLinks.filter(l => {
        const sourceId = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
        const targetId = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
        return nodeMap.has(sourceId) && nodeMap.has(targetId);
    });

    // 2. D3 Setup
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const { width, height } = dimensions;

    // Zoom behavior
    const g = svg.append("g");
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        // Hide menu on zoom
        setMenuState(prev => ({ ...prev, visible: false }));
      });
    svg.call(zoom);
    // Disable double click zoom
    svg.on("dblclick.zoom", null);

    // Simulation
    const simulation = d3.forceSimulation<GraphNode>(graphNodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(validLinks).id(d => d.id).distance(d => d.type === 'hierarchy' ? 50 : 100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30));

    // Render Links
    const link = g.append("g")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(validLinks)
      .join("line")
      .attr("stroke", d => d.type === 'hierarchy' ? "#555" : "#f4d27b") // Grey for hierarchy, Gold for references
      .attr("stroke-width", d => d.type === 'hierarchy' ? 1.5 : 1)
      .attr("stroke-dasharray", d => d.type === 'hierarchy' ? "0" : "4 2");

    // Render Nodes
    const node = g.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("g")
      .data(graphNodes)
      .join("g")
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("contextmenu", (event, d) => {
          event.preventDefault();
          setMenuState({
              visible: true,
              x: event.clientX,
              y: event.clientY,
              node: d.originalNode
          });
      });

    // Node Circles
    node.append("circle")
      .attr("r", d => Math.max(5, 20 - d.level * 2)) // Root nodes bigger
      .attr("fill", d => getNodeColor(d.group));

    // Node Labels
    node.append("text")
      .text(d => d.id)
      .attr("x", 8)
      .attr("y", 3)
      .style("font-size", "10px")
      .style("fill", "#ccc")
      .style("pointer-events", "none")
      .style("font-family", "monospace");

    // Tooltip title
    node.append("title")
      .text(d => {
          let text = `${d.id}: ${d.title} (${d.group})`;
          if (d.tags && d.tags.length > 0) {
              text += `\nTags: ${d.tags.join(', ')}`;
          }
          return text;
      });

    // Simulation Tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x!)
        .attr("y1", d => (d.source as GraphNode).y!)
        .attr("x2", d => (d.target as GraphNode).x!)
        .attr("y2", d => (d.target as GraphNode).y!);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, [nodes, dimensions]);

  const getNodeColor = (kingdom: string) => {
    const colors: Record<string, string> = {
      'EXISTENTIA': '#9333ea', // Purple
      'COGNITIO': '#2563eb',   // Blue
      'ACTUS': '#ea580c',      // Orange
      'VALOR': '#ca8a04',      // Yellow
      'SYSTEMA': '#16a34a',    // Green
      'SIGNIFICATIO': '#db2777', // Pink
      'UNKNOWN': '#4b5563'     // Gray
    };
    return colors[kingdom] || colors['UNKNOWN'];
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700 relative">
      <div className="absolute top-2 left-2 bg-black/50 p-2 rounded text-xs text-gray-300 pointer-events-none">
        <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-gray-500"></span> Hierarchy</div>
        <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-yellow-400 border-dashed border-b border-yellow-400"></span> Reference</div>
      </div>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="cursor-move"></svg>
      
      {menuState.visible && menuState.node && (
        <ContextMenu 
          x={menuState.x} 
          y={menuState.y} 
          node={menuState.node} 
          onClose={closeMenu} 
          onArchive={handleArchive}
        />
      )}
    </div>
  );
};
