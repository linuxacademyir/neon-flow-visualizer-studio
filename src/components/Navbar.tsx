
import { useRef, useState, useEffect } from 'react';
import { Download, Upload, FileDown, Sun, Moon } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import html2canvas from 'html2canvas';

interface NavbarProps {
  nodes: any[];
  edges: any[];
  setNodes: (nodes: any) => void;
  setEdges: (edges: any) => void;
}

export const Navbar = ({ nodes, edges, setNodes, setEdges }: NavbarProps) => {
  const { fitView } = useReactFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [theme, setTheme] = useState('dark');

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
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          label: node.data.label,
          name: node.data.name,
          actor: node.data.actor,
          description: node.data.description
        }
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type
      }))
    };

    const blob = new Blob([JSON.stringify(workflow, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
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
        setEdges(workflow.edges || []);
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
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={exportWorkflow}
          className="p-2 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
          title="Export workflow"
        >
          <Upload size={18} />
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
          title="Import workflow"
        >
          <Download size={18} />
        </button>

        <button
          onClick={downloadAsPNG}
          className="p-2 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
          title="Download as PNG"
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
