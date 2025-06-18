import { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Minus, Maximize2 } from 'lucide-react';

import { CustomNode } from './CustomNode';
import { NodeSidebar } from './NodeSidebar';
import { EditSidebar } from './EditSidebar';
import { Navbar } from './Navbar';

const nodeTypes = {
  trigger: CustomNode,
  action: CustomNode,
  controller: CustomNode,
  extra: CustomNode,
  event: CustomNode,
  form: CustomNode,
};

// Email signature workflow initial setup
const initialNodes: Node[] = [];

const initialEdges: Edge[] = [
  {
    id: 'e1',
    source: 'email-trigger',
    target: 'cta-action',
    type: 'default'
  },
  {
    id: 'e2',
    source: 'cta-action',
    target: 'update-signature',
    type: 'default'
  }
];

export const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const [zoom, setZoom] = useState(1);

  // Load from localStorage on mount
  useEffect(() => {
    const savedNodes = localStorage.getItem('workflow_nodes');
    const savedEdges = localStorage.getItem('workflow_edges');
    const savedName = localStorage.getItem('workflow_name');
    if (savedNodes && savedEdges) {
      try {
        setNodes(JSON.parse(savedNodes));
        setEdges(JSON.parse(savedEdges));
      } catch {}
    }
    if (savedName) {
      setWorkflowName(savedName);
    }
    // eslint-disable-next-line
  }, []);

  // Ensure default zoom is 100% on mount/refresh
  useEffect(() => {
    if (reactFlowInstance && reactFlowInstance.setViewport) {
      reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 });
    }
    // Only run on mount
    // eslint-disable-next-line
  }, [reactFlowInstance]);

  // Save to localStorage on nodes/edges/name change
  useEffect(() => {
    localStorage.setItem('workflow_nodes', JSON.stringify(nodes));
    localStorage.setItem('workflow_edges', JSON.stringify(edges));
    localStorage.setItem('workflow_name', workflowName);
  }, [nodes, edges, workflowName]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setEditSidebarOpen(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setEditSidebarOpen(false);
    setSelectedNode(null);
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setEditSidebarOpen(false);
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const editNode = useCallback((nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      setEditSidebarOpen(true);
    }
  }, [nodes]);

  const updateNode = useCallback((nodeId: string, updates: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    );
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, ...updates } } : null);
    }
  }, [setNodes, selectedNode]);

  const enhancedNodes = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onEdit: editNode,
      onDelete: deleteNode,
    }
  }));

  // Update zoom state on move
  const handleMove = useCallback((event, viewport) => {
    setZoom(viewport.zoom);
  }, []);

  const handleZoomIn = () => {
    if (!reactFlowInstance) return;
    const { zoom, x, y } = reactFlowInstance.getViewport();
    const newZoom = Math.min(zoom * 1.2, 8);
    reactFlowInstance.setViewport({ x, y, zoom: newZoom });
  };
  const handleZoomOut = () => {
    if (!reactFlowInstance) return;
    const { zoom, x, y } = reactFlowInstance.getViewport();
    const newZoom = Math.max(zoom / 1.2, 0.01);
    reactFlowInstance.setViewport({ x, y, zoom: newZoom });
  };
  const handleZoomReset = () => {
    if (!reactFlowInstance) return;
    reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 });
  };

  return (
    <div className="workflow-builder">
      <Navbar
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
      />
      <div className="workflow-builder__content">
        <NodeSidebar setNodes={setNodes} setEdges={setEdges} />
        <div className="workflow-builder__canvas" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={enhancedNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            className="workflow-canvas"
            proOptions={{ hideAttribution: true }}
            fitView
            maxZoom={8}
            minZoom={0.01}
            onMove={handleMove}
          >
            <Background color="#333" gap={20} />
            <div className="absolute bottom-6 right-6 z-50 flex flex-col items-center gap-2 bg-gray-800/90 rounded-lg shadow-lg p-2 border border-gray-700">
              <button
                onClick={handleZoomIn}
                className="p-2 rounded hover:bg-gray-700 text-white"
                title="Zoom in"
                aria-label="Zoom in"
              >
                <Plus size={18} />
              </button>
              <span className="text-xs font-semibold text-gray-200 select-none">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomOut}
                className="p-2 rounded hover:bg-gray-700 text-white"
                title="Zoom out"
                aria-label="Zoom out"
              >
                <Minus size={18} />
              </button>
              <button
                onClick={handleZoomReset}
                className="p-2 rounded hover:bg-gray-700 text-white mt-1"
                title="Reset zoom"
                aria-label="Reset zoom"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </ReactFlow>
        </div>
        <EditSidebar
          isOpen={editSidebarOpen}
          onClose={() => setEditSidebarOpen(false)}
          selectedNode={selectedNode}
          onUpdateNode={updateNode}
          onDeleteNode={deleteNode}
          onEditNode={editNode}
        />
      </div>
    </div>
  );
};
