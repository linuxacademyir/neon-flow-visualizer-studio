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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

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
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedNodes = localStorage.getItem('workflow_nodes');
    const savedEdges = localStorage.getItem('workflow_edges');
    if (savedNodes && savedEdges) {
      try {
        setNodes(JSON.parse(savedNodes));
        setEdges(JSON.parse(savedEdges));
      } catch {}
    }
    // eslint-disable-next-line
  }, []);

  // Save to localStorage on nodes/edges change
  useEffect(() => {
    localStorage.setItem('workflow_nodes', JSON.stringify(nodes));
    localStorage.setItem('workflow_edges', JSON.stringify(edges));
  }, [nodes, edges]);

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

  return (
    <div className="workflow-builder">
      <ReactFlowProvider>
        <Navbar nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} />
        
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
            >
              <Controls className="workflow-controls" />
              <Background color="#333" gap={20} />
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
      </ReactFlowProvider>
    </div>
  );
};
