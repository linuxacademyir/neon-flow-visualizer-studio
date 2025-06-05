
import { useCallback, useRef, useState } from 'react';
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
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const WorkflowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

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

  const onPaneDoubleClick = useCallback(() => {
    setEditSidebarOpen(false);
    setSelectedNode(null);
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
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

  return (
    <div className="h-screen w-full bg-gray-900 text-white">
      <ReactFlowProvider>
        <Navbar nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} />
        
        <div className="flex h-[calc(100vh-64px)]">
          <NodeSidebar setNodes={setNodes} />
          
          <div className="flex-1 relative" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onPaneDoubleClick={onPaneDoubleClick}
              nodeTypes={nodeTypes}
              className="bg-gray-900"
              proOptions={{ hideAttribution: true }}
            >
              <Controls className="react-flow__controls" />
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
