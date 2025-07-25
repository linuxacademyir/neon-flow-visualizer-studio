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
  SelectionMode,
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
  end: CustomNode,
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
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
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
    // Prevent event propagation to avoid triggering pane click
    event.stopPropagation();
    
    // Handle multi-selection with Ctrl/Cmd key
    if (event.ctrlKey || event.metaKey) {
      setSelectedNodes(prev => {
        const isSelected = prev.includes(node.id);
        if (isSelected) {
          return prev.filter(id => id !== node.id);
        } else {
          return [...prev, node.id];
        }
      });
    } else {
      // Single selection - only open edit sidebar for single node selection
      setSelectedNode(node);
      setEditSidebarOpen(true);
      setSelectedNodes([node.id]);
    }
  }, []);

  const onPaneClick = useCallback((event: React.MouseEvent) => {
    // Only clear selection if clicking on empty space (not during drag)
    if (event.detail === 1) { // Single click only
      setEditSidebarOpen(false);
      setSelectedNode(null);
      setSelectedNodes([]);
    }
  }, []);

  const onSelectionChange = useCallback(({ nodes: selectedNodes }) => {
    const selectedNodeIds = selectedNodes.map(node => node.id);
    setSelectedNodes(selectedNodeIds);
    
    // If only one node is selected, allow editing
    if (selectedNodes.length === 1) {
      setSelectedNode(selectedNodes[0]);
      setEditSidebarOpen(true);
    } else {
      setSelectedNode(null);
      setEditSidebarOpen(false);
    }
  }, []);

  // Handle drag selection start
  const onSelectionStart = useCallback((event) => {
    // Close edit sidebar when starting a selection
    setEditSidebarOpen(false);
    setSelectedNode(null);
  }, []);

  // Handle drag selection end
  const onSelectionEnd = useCallback(() => {
    // Selection change will be handled by onSelectionChange
  }, []);

  // Handle selection drag
  const onSelectionDrag = useCallback((event, selection) => {
    // This will be called during box selection
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

  // Add next node logic for + button on node
  const handleAddNextNode = useCallback((sourceNodeId, { type, label }) => {
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    if (!sourceNode) return;

    // Position new node to the right of the source node
    const defaultX = sourceNode.position.x + 220;
    const defaultY = sourceNode.position.y;
    // Find a non-overlapping Y position (simple vertical offset if needed)
    let x = defaultX;
    let y = defaultY;
    let tries = 0;
    while (nodes.some(n => Math.abs(n.position.x - x) < 180 && Math.abs(n.position.y - y) < 80)) {
      y += 60;
      tries++;
      if (tries > 10) break;
    }
    const position = { x, y };
    const id = `${type}-${label.replace(/\s+/g, '-')}-${Date.now()}`;
    let newNode;
    if (type === 'action') {
      newNode = {
        id,
        type: 'action',
        position,
        data: {
          label: 'Action',
          name: 'Action',
          actor: '',
          description: '',
          notes: undefined,
        },
      };
    } else if (type === 'event') {
      newNode = {
        id,
        type: 'event',
        position,
        data: {
          label: 'Event',
          name: 'Event',
        },
      };
    } else if (type === 'form') {
      newNode = {
        id,
        type: 'form',
        position,
        data: {
          label: 'Form',
          name: 'Form',
          questions: [
            {
              question: '',
              fieldType: 'input',
              options: [],
            },
          ],
        },
      };
    } else if (type === 'end') {
      newNode = {
        id,
        type: 'end',
        position,
        data: {
          label: 'End',
          name: 'End',
          endType: 'success', // default end type (success, error, lost)
        },
      };
    } else if (type === 'controller') {
      // Create controller-specific default data based on label
      const controllerData: any = {
        label,
        name: label,
      };
      
      // Add router-specific defaults
      if (label === 'Router') {
        controllerData.branchCount = 2;
        controllerData.runMode = 'ALL';
        controllerData.runNMethod = 'Random';
        controllerData.branchConfigs = [
          {
            branch: 1,
            name: '',
            description: '',
            priority: 1,
            conditions: [{ type: 'always' }],
            operators: [],
          },
          {
            branch: 2,
            name: '',
            description: '',
            priority: 1,
            conditions: [{ type: 'always' }],
            operators: [],
          },
        ];
      }
      
      // Add Join-specific defaults
      if (label === 'Join') {
        controllerData.inputCount = 2;
        controllerData.joinType = 'AND';
        controllerData.branchConfigs = [
          {
            branch: 1,
            name: '',
            description: '',
            priority: 1,
            conditions: [{ type: 'always' }],
            operators: [],
          },
          {
            branch: 2,
            name: '',
            description: '',
            priority: 1,
            conditions: [{ type: 'always' }],
            operators: [],
          },
        ];
      }
      
      // Add Wait-specific defaults
      if (label === 'Wait') {
        controllerData.waitType = 'timeout';
        controllerData.timeout = 60;
        controllerData.timeoutUnit = 'seconds';
      }
      
      newNode = {
        id,
        type: 'controller',
        position,
        data: controllerData,
      };
    } else if (type === 'extra') {
      newNode = {
        id,
        type: 'extra',
        position,
        data: {
          label,
          name: label,
          notes: label === 'Comment' ? '' : undefined,
        },
      };
    } else {
      // fallback
      newNode = {
        id,
        type,
        position,
        data: {
          label,
          name: label,
        },
      };
    }
    setNodes(nds => [
      ...nds,
      newNode,
    ]);
    setEdges(eds => [
      ...eds,
      { id: `e-${sourceNodeId}-${id}`, source: sourceNodeId, target: id, type: 'default' },
    ]);
  }, [nodes, setNodes, setEdges]);

  const enhancedNodes = nodes.map(node => ({
    ...node,
    selected: selectedNodes.includes(node.id),
    data: {
      ...node.data,
      onEdit: editNode,
      onDelete: deleteNode,
      onAddNextNode: handleAddNextNode,
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
            onSelectionChange={onSelectionChange}
            onSelectionStart={onSelectionStart}
            onSelectionEnd={onSelectionEnd}
            onSelectionDrag={onSelectionDrag}
            nodeTypes={nodeTypes}
            className="workflow-canvas"
            proOptions={{ hideAttribution: true }}
            fitView
            maxZoom={8}
            minZoom={0.01}
            onMove={handleMove}
            selectionMode={SelectionMode.Partial}
            multiSelectionKeyCode={['Meta', 'Control']}
            selectNodesOnDrag={false}
            selectionOnDrag={true}
            panOnDrag={true} // Enable panning by default
            selectionKeyCode={['Shift']} // Require Shift key for box selection
            panOnScroll={true} // Enable pan on scroll
            zoomOnScroll={true} // Enable zoom on scroll
            zoomOnPinch={true} // Enable zoom on pinch
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
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
