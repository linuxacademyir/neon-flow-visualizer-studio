import { useRef, useState, useEffect } from 'react';
import { Download, Upload, FileDown, Sun, Moon, Plus, RotateCcw, Trash2, FolderOpen, RefreshCw } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import html2canvas from 'html2canvas';
// Server storage - no longer need to import file storage

interface NavbarProps {
  nodes: any[];
  edges: any[];
  setNodes: (nodes: any) => void;
  setEdges: (edges: any) => void;
  workflowName: string;
  setWorkflowName: (name: string) => void;
  availableWorkflows: string[];
  onLoadWorkflow: (name: string) => void;
  onCreateNew: () => void;
  onDeleteWorkflow: (name: string) => void;
  fileStorageAvailable: boolean;
  onRefreshWorkflows?: () => void;
  onImportWorkflow?: (workflow: any) => void;
}

export const Navbar = ({ nodes, edges, setNodes, setEdges, workflowName, setWorkflowName, availableWorkflows, onLoadWorkflow, onCreateNew, onDeleteWorkflow, fileStorageAvailable, onRefreshWorkflows, onImportWorkflow }: NavbarProps) => {
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
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
        const workflowData = {
          name: workflow.name || 'Imported Workflow',
          nodes: workflow.nodes || [],
          edges: (workflow.edges || []).map((edge: any) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type || 'default',
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle
          })),
          createdAt: workflow.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Update the UI
        setNodes(workflowData.nodes);
        setEdges(workflowData.edges);
        setWorkflowName(workflowData.name);

        // Save to server if import handler is provided
        if (onImportWorkflow) {
          onImportWorkflow(workflowData);
          console.log(`Successfully imported workflow: ${workflowData.name}`);
        }

        // Clear the file input
        event.target.value = '';
        
        // Show success message
        alert(`Successfully imported workflow: ${workflowData.name}`);
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
    if (fileStorageAvailable) {
      onCreateNew();
    } else {
      setNodes([]);
      setEdges([]);
      localStorage.removeItem('workflow_nodes');
      localStorage.removeItem('workflow_edges');
    }
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
        
        {fileStorageAvailable ? (
          <div className="flex items-center space-x-2 ml-4">
            <select
              value={workflowName}
              onChange={e => {
                if (e.target.value === 'NEW_WORKFLOW') {
                  onCreateNew();
                } else {
                  onLoadWorkflow(e.target.value);
                }
              }}
              className="px-3 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            >
              <option value="Untitled Workflow">🖥️ Select workflow...</option>
              <option value="NEW_WORKFLOW">➕ Create New Workflow</option>
              {availableWorkflows.length > 0 && (
                <optgroup label="🖥️ Server Workflows">
                  {availableWorkflows.map(workflow => (
                    <option key={workflow} value={workflow}>📄 {workflow}</option>
                  ))}
                </optgroup>
              )}
              {availableWorkflows.length === 0 && (
                <option disabled>No saved workflows found</option>
              )}
            </select>
            
                         {workflowName !== 'Untitled Workflow' && (
               <>
                 <input
                   type="text"
                   value={workflowName}
                   onChange={e => setWorkflowName(e.target.value)}
                   className="px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm w-48"
                   placeholder="Workflow name..."
                   title="Workflow Name"
                 />
                 {availableWorkflows.includes(workflowName) && (
                   <button
                     onClick={() => {
                       if (confirm(`Are you sure you want to delete "${workflowName}"?`)) {
                         onDeleteWorkflow(workflowName);
                       }
                     }}
                     className="p-1 hover:bg-gray-600 text-red-400 hover:text-red-300 rounded transition-all duration-200"
                     title="Delete workflow"
                   >
                     <Trash2 size={14} />
                   </button>
                 )}
               </>
             )}
          </div>
        ) : (
          <input
            type="text"
            value={workflowName}
            onChange={e => setWorkflowName(e.target.value)}
            className="ml-4 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm w-56"
            placeholder="Workflow name..."
            title="Workflow Name"
          />
        )}
      </div>

      <div className="flex items-center space-x-2">
        {fileStorageAvailable && (
          <div className="flex items-center space-x-2 mr-2">
            <div 
              className="text-xs text-green-400 cursor-help" 
              title="Workflows stored on server in /server/workflows/ directory"
            >
              🖥️ Server Storage
            </div>
            {onRefreshWorkflows && (
              <button
                onClick={onRefreshWorkflows}
                className="p-1 hover:bg-gray-700 text-gray-400 hover:text-white rounded transition-all duration-200"
                title="Refresh workflow list from server"
              >
                <RefreshCw size={12} />
              </button>
            )}
          </div>
        )}
        <button
          onClick={resetBoard}
          className="p-2 hover:bg-gray-700 text-yellow-400 hover:text-white rounded-lg transition-all duration-200"
          title={fileStorageAvailable ? "Create new workflow" : "Reset board"}
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={exportWorkflow}
          className="p-2 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
          title="Export current workflow as JSON file"
        >
          <Download size={18} />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
          title="Import workflow from JSON file (saves to server)"
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
