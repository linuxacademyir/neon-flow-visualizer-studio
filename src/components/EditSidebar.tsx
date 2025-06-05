
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EditSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: any;
  onUpdateNode: (nodeId: string, updates: any) => void;
  onDeleteNode: (nodeId: string) => void;
  onEditNode: (nodeId: string) => void;
}

const nodeTypeOptions = {
  trigger: ['Time based', 'System based', 'User based', 'Participant based', 'AI agent based'],
  action: ['System based action', 'User based action', 'Participant based action', 'AI agent based action']
};

export const EditSidebar = ({ 
  isOpen, 
  onClose, 
  selectedNode, 
  onUpdateNode 
}: EditSidebarProps) => {
  const [name, setName] = useState('');
  const [actor, setActor] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setName(selectedNode.data.name || selectedNode.data.label || '');
      setActor(selectedNode.data.actor || '');
      setDescription(selectedNode.data.description || '');
      setSelectedType(selectedNode.data.label || '');
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { name, actor, description });
    }
  };

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { label: newType, name: newType });
      setName(newType);
    }
  };

  if (!isOpen) return null;

  const canChangeType = selectedNode && (selectedNode.type === 'trigger' || selectedNode.type === 'action');
  const typeOptions = selectedNode?.type === 'trigger' ? nodeTypeOptions.trigger : nodeTypeOptions.action;

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Edit Node</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {selectedNode && (
        <div className="space-y-4">
          {canChangeType && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Node Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Node Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSave}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter node name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Node Actor
            </label>
            <input
              type="text"
              value={actor}
              onChange={(e) => setActor(e.target.value)}
              onBlur={handleSave}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter node actor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSave}
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter node description"
            />
          </div>

          <div className="text-xs text-gray-500 mt-4">
            <p><strong>Type:</strong> {selectedNode.type}</p>
            <p><strong>ID:</strong> {selectedNode.id}</p>
          </div>
        </div>
      )}
    </div>
  );
};
