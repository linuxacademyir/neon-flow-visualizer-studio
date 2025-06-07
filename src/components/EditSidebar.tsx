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
  trigger: ['System based', 'User based', 'Participant based', 'AI agent based'],
  action: ['System based action', 'User based action', 'Participant based action', 'AI agent based action'],
  controller: ['Router', 'Join', 'Wait', 'Escalation', 'Iterator', 'Aggregator']
};

export const EditSidebar = ({ 
  isOpen, 
  onClose, 
  selectedNode, 
  onUpdateNode 
}: EditSidebarProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setName(selectedNode.data.name || selectedNode.data.label || '');
      setDescription(selectedNode.data.description || '');
      setNotes(selectedNode.data.notes || '');
      setSelectedType(selectedNode.data.label || '');
      console.log('Selected node type:', selectedNode.type);
      console.log('Selected node data:', selectedNode.data);
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { name, description, notes });
    }
  };

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { label: newType });
    }
  };

  if (!isOpen) return null;

  const isController = selectedNode?.type === 'controller';
  const canChangeType = selectedNode && (selectedNode.type === 'trigger' || selectedNode.type === 'action' || selectedNode.type === 'controller');
  
  let typeOptions = [];
  if (selectedNode?.type === 'trigger') {
    typeOptions = nodeTypeOptions.trigger;
  } else if (selectedNode?.type === 'action') {
    typeOptions = nodeTypeOptions.action;
  } else if (selectedNode?.type === 'controller') {
    typeOptions = nodeTypeOptions.controller;
  }
  
  const isCommentNode = selectedNode && selectedNode.data.label === 'Comment';

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
                Node Type {isController && "(Controller)"}
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
              Custom Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSave}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter custom name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {isCommentNode ? 'Comment' : 'Description'}
            </label>
            <textarea
              value={isCommentNode ? notes : description}
              onChange={(e) => isCommentNode ? setNotes(e.target.value) : setDescription(e.target.value)}
              onBlur={handleSave}
              rows={isCommentNode ? 3 : 4}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder={isCommentNode ? "Enter your comment..." : "Enter node description"}
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
