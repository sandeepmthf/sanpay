import { useState, useEffect, useCallback } from 'react';
import ReactFlow, { Background, Controls, MarkerType, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { api } from '../services/api';

const customNodeStyles = {
  background: '#ffffff',
  color: '#0f172a',
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  fontSize: '12px',
  fontWeight: '600',
  width: 140,
  textAlign: 'center'
};

const inputNodeStyles = {
  ...customNodeStyles,
  background: '#eef2ff',
  borderColor: '#6366f1',
  color: '#4f46e5',
};

const outputNodeStyles = {
  ...customNodeStyles,
  background: '#f0fdf4',
  borderColor: '#22c55e',
  color: '#16a34a',
};

export function NetworkGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);

  const fetchNetwork = useCallback(async () => {
    try {
      const response = await api.getNearbyNodes();
      
      // Apply custom styles to mock data
      const styledNodes = response.data.nodes.map(node => {
        let style = customNodeStyles;
        if (node.type === 'input') style = inputNodeStyles;
        if (node.type === 'output') style = outputNodeStyles;
        return { ...node, style };
      });

      const styledEdges = response.data.edges.map(edge => ({
        ...edge,
        style: { stroke: edge.animated ? '#6366f1' : '#cbd5e1', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edge.animated ? '#6366f1' : '#cbd5e1',
        },
      }));

      setNodes(styledNodes);
      setEdges(styledEdges);
    } catch (error) {
      console.error("Failed to fetch network graph", error);
    } finally {
      setLoading(false);
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    fetchNetwork();
    // Simulate real-time mesh changes
    const interval = setInterval(fetchNetwork, 10000);
    return () => clearInterval(interval);
  }, [fetchNetwork]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen w-full flex flex-col bg-slate-50 pb-20"
    >
      <div className="p-4 pt-6 bg-white border-b border-slate-100 shadow-sm z-10 relative">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Mesh Network</h1>
            <p className="text-xs text-slate-500">Live offline topology routing</p>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-8 h-8 border-4 border-slate-200 border-t-brand-500 rounded-full" />
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            attributionPosition="bottom-left"
          >
            <Background color="#e2e8f0" gap={16} />
            <Controls showInteractive={false} className="mb-20" />
          </ReactFlow>
        )}
      </div>
    </motion.div>
  );
}
