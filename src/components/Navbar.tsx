import { useRef, useState, useEffect } from 'react';
import { Download, Upload, FileDown, Sun, Moon, Plus, RotateCcw } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import html2canvas from 'html2canvas';

interface NavbarProps {
  nodes: any[];
  edges: any[];
  setNodes: (nodes: any) => void;
  setEdges: (edges: any) => void;
  workflowName: string;
  setWorkflowName: (name: string) => void;
}

export const Navbar = ({ nodes, edges, setNodes, setEdges, workflowName, setWorkflowName }: NavbarProps) => {
  const { fitView } = useReactFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [theme, setTheme] = useState('dark');
  const [selectedActor, setSelectedActor] = useState('External User');
  const actorTypeOptions = ['External User', 'Internal User', 'AI Agent', 'System User'];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const exportWorkflow = () => {
    const workflow = {
      name: workflowName,
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: { ...node.data }
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
      }))
    };

    const blob = new Blob([JSON.stringify(workflow, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (workflowName && workflowName.trim().length > 0 ? workflowName : 'workflow')
      .replace(/[^a-zA-Z0-9-_ ]/g, '')
      .replace(/\s+/g, '-');
    a.download = `${safeName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflow = JSON.parse(e.target?.result as string);
        setNodes(workflow.nodes || []);
        // Ensure edges preserve handle information for router connections
        const importedEdges = (workflow.edges || []).map((edge: any) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type || 'default',
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle
        }));
        setEdges(importedEdges);
        if (workflow.name) {
          setWorkflowName(workflow.name);
        }
      } catch (error) {
        console.error('Failed to import workflow:', error);
        alert('Failed to import workflow. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const downloadAsPNG = async () => {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: theme === 'dark' ? '#121217' : '#ffffff',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = 'workflow.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Failed to download workflow as PNG:', error);
    }
  };

  const addActionNode = () => {
    if (nodes.some((node) => node.type === 'action')) return;
    const id = `action-${Date.now()}`;
    const newNode = {
      id,
      type: 'action',
      position: { x: 300, y: 200 },
      data: {
        label: 'Action',
        name: 'Action',
        actor: selectedActor,
        description: '',
        onDelete: (nodeId: string) => setNodes((nds: any) => nds.filter((node: any) => node.id !== nodeId)),
        onEdit: (nodeId: string) => {},
      },
    };
    setNodes((nds: any) => [...nds, newNode]);
  };

  const resetBoard = () => {
    setNodes([]);
    setEdges([]);
    localStorage.removeItem('workflow_nodes');
    localStorage.removeItem('workflow_edges');
  };

  return (
    <nav className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <h1 className="text-xl font-bold text-white">Workflow Builder</h1>
        <input
          type="text"
          value={workflowName}
          onChange={e => setWorkflowName(e.target.value)}
          className="ml-4 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm w-56"
          placeholder="Workflow name..."
          title="Workflow Name"
        />
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={resetBoard}
          className="p-2 hover:bg-gray-700 text-yellow-400 hover:text-white rounded-lg transition-all duration-200"
          title="Reset board"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={exportWorkflow}
          className="p-2 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
          title="Export workflow as JSON"
        >
          <Download size={18} />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
          title="Import workflow from JSON"
        >
          <Upload size={18} />
        </button>
        <button
          onClick={downloadAsPNG}
          className="p-2 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
          title="Download workflow as PNG image"
        >
          <FileDown size={18} />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importWorkflow}
        className="hidden"
      />
    </nav>
  );
};
