
import { useState } from 'react';
import { ChevronDown, ChevronRight, Zap, Play, Diamond, FileText } from 'lucide-react';

const nodeCategories = {
  triggers: {
    color: '#00ff00',
    shape: 'circle',
    icon: Zap,
    items: ['System based', 'User based', 'Participant based', 'AI agent based']
  },
  actions: {
    color: '#00bfff',
    shape: 'rounded-rectangle',
    icon: Play,
    items: ['System based action', 'User based action', 'Participant based action', 'AI agent based action']
  },
  controllers: {
    color: '#ff00ff',
    shape: 'diamond',
    icon: Diamond,
    items: ['Condition', 'Parallel', 'Switch', 'Loop handler', 'Aggregator', 'Timeout controller', 'Sleep', 'Joint', 'Retry', 'Timeout', 'Pause until', 'Validation']
  },
  extras: {
    color: '#ffff00',
    shape: 'rectangle',
    icon: FileText,
    items: ['Comment']
  }
};

export const NodeSidebar = ({ setNodes }: any) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    triggers: true,
    actions: true,
    controllers: true,
    extras: true
  });

  const toggleCategory = (category: string) => {
    setCollapsed(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const addNode = (type: string, label: string) => {
    const id = `${type}-${Date.now()}`;
    const newNode = {
      id,
      type: type === 'triggers' ? 'trigger' : type === 'actions' ? 'action' : type === 'controllers' ? 'controller' : 'extra',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
      data: { 
        label,
        name: label,
        actor: '',
        description: '',
        notes: label === 'Comment' ? '' : undefined,
        onDelete: (nodeId: string) => {
          setNodes((nds: any) => nds.filter((node: any) => node.id !== nodeId));
        },
        onEdit: (nodeId: string) => {
          // This will be handled by the parent component
        }
      },
    };
    
    setNodes((nds: any) => [...nds, newNode]);
  };

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-white">Node Picker</h2>
      
      {Object.entries(nodeCategories).map(([category, config]) => {
        const IconComponent = config.icon;
        return (
          <div key={category} className="mb-4">
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center w-full text-left text-sm font-medium text-gray-300 hover:text-white mb-2"
            >
              {collapsed[category] ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
              <IconComponent size={16} className="ml-1 mr-2" />
              <span className="capitalize">{category}</span>
            </button>
            
            {!collapsed[category] && (
              <div className="ml-4 space-y-2">
                {config.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => addNode(category, item)}
                    className="block w-full text-left text-xs text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded transition-colors"
                    style={{ borderLeft: `3px solid ${config.color}` }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
