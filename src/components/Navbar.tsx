
import { useRef } from 'react';
import { Download, Upload, FileDown, Lock, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import html2canvas from 'html2canvas';

interface NavbarProps {
  nodes: any[];
  edges: any[];
  setNodes: (nodes: any) => void;
  setEdges: (edges: any) => void;
}

export const Navbar = ({ nodes, edges, setNodes, setEdges }: NavbarProps) => {
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        backgroundColor: '#121217',
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
        <h1 className="text-xl font-bold text-white">Workflow Builder</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={exportWorkflow}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
        >
          <Upload size={16} />
          <span>Export</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
        >
          <Download size={16} />
          <span>Import</span>
        </button>

        <button
          onClick={downloadAsPNG}
          className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
        >
          <FileDown size={16} />
          <span>Download</span>
        </button>

        <div className="flex items-center space-x-2 bg-gray-700 rounded p-1">
          <button
            onClick={() => zoomOut()}
            className="p-2 text-gray-300 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>

          <button
            onClick={() => zoomIn()}
            className="p-2 text-gray-300 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>

          <button
            onClick={() => fitView()}
            className="p-2 text-gray-300 hover:text-white transition-colors"
            title="Fit View"
          >
            <Maximize size={16} />
          </button>

          <button
            className="p-2 text-gray-300 hover:text-white transition-colors"
            title="Lock"
          >
            <Lock size={16} />
          </button>
        </div>
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
