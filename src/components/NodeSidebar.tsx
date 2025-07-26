import { useState } from 'react';
import { ChevronDown, ChevronRight, Play, Diamond, FileText, CircleCheckBig, CircleAlert, Ban } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

const nodeCategories = {
  main: {
    color: '#00bfff',
    shape: 'rounded-rectangle',
    icon: Play,
    items: ['Action + Event', 'Action', 'Event', 'Form', 'End']
  },
  controllers: {
    color: '#ff00ff',
    shape: 'diamond',
    icon: Diamond,
    items: ['Router', 'Join', 'Wait', 'Escalation', 'Iterator', 'Aggregator']
  },
  extras: {
    color: '#ffff00',
    shape: 'rectangle',
    icon: FileText,
    items: ['Comment']
  }
};

const eventTypeOptions = [
  { label: 'Trigger', value: 'triggable', icon: CircleCheckBig },
  { label: 'Conditionally Trigger', value: 'conditionally_triggable', icon: CircleAlert },
  { label: 'Not Trigger', value: 'non_triggable', icon: Ban },
];
const EVENT_COLOR = '#FFF700'; // Electric Yellow

export const NodeSidebar = ({ setNodes, setEdges }: any) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    main: false,
    controllers: false,
    extras: false
  });
  const reactFlowInstance = useReactFlow();

  const toggleCategory = (category: string) => {
    setCollapsed(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const addNode = (type: string, label: string) => {
    // Get viewport center in screen coordinates
    let position = { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 };
    if (reactFlowInstance && reactFlowInstance.getViewport) {
      const canvas = document.querySelector('.react-flow');
      let center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
      // getViewport returns { x, y, zoom }
      const { x, y, zoom } = reactFlowInstance.getViewport();
      position = {
        x: (center.x - x) / zoom,
        y: (center.y - y) / zoom,
      };
    }

    if (type === 'main' && label === 'Action + Event') {
      const actionId = `${type}-${Date.now()}`;
      const eventId = `event-${Date.now()}`;
      const actionNode = {
        id: actionId,
        type: 'action',
        position,
        data: {
          label: 'Action',
          name: 'Action',
          actor: '',
          description: '',
          notes: undefined,
          onDelete: (nodeId: string) => {
            setNodes((nds: any) => nds.filter((node: any) => node.id !== nodeId && node.id !== eventId));
          },
          onEdit: (nodeId: string) => {},
        },
      };
      const eventNode = {
        id: eventId,
        type: 'event',
        position: { x: actionNode.position.x + 180, y: actionNode.position.y },
        data: {
          label: 'Event',
          name: 'Event',
          onDelete: (nodeId: string) => {
            setNodes((nds: any) => nds.filter((node: any) => node.id !== nodeId));
          },
          onEdit: (nodeId: string) => {},
        },
      };
      setNodes((nds: any) => [...nds, actionNode, eventNode]);
      // Add edge connecting action to event
      setEdges((eds: any) => [...eds, { id: `e-${actionId}-${eventId}`, source: actionId, target: eventId, type: 'default' }]);
      return;
    }
    if (type === 'main' && label === 'Action') {
      const actionId = `${type}-${Date.now()}`;
      const actionNode = {
        id: actionId,
        type: 'action',
        position,
        data: {
          label: 'Action',
          name: 'Action',
          actor: '',
          description: '',
          notes: undefined,
          onDelete: (nodeId: string) => {
            setNodes((nds: any) => nds.filter((node: any) => node.id !== nodeId));
          },
          onEdit: (nodeId: string) => {},
        },
      };
      setNodes((nds: any) => [...nds, actionNode]);
      return;
    }
    if (type === 'main' && label === 'Event') {
      const eventId = `event-${Date.now()}`;
      const eventNode = {
        id: eventId,
        type: 'event',
        position,
        data: {
          label: 'Event',
          name: 'Event',
          onDelete: (nodeId: string) => {
            setNodes((nds: any) => nds.filter((node: any) => node.id !== nodeId));
          },
          onEdit: (nodeId: string) => {},
        },
      };
      setNodes((nds: any) => [...nds, eventNode]);
      return;
    }
    if (type === 'main' && label === 'Form') {
      const formId = `${type}-form-${Date.now()}`;
      const formNode = {
        id: formId,
        type: 'form',
        position,
        data: {
          label: 'Form',
          name: 'Form',
          questions: [
            {
              question: '',
              fieldType: 'input', // default type
              options: [], // for dropdown, radio, etc.
            },
          ],
          onDelete: (nodeId: string) => {
            setNodes((nds: any) => nds.filter((node: any) => node.id !== nodeId));
          },
          onEdit: (nodeId: string) => {},
        },
      };
      setNodes((nds: any) => [...nds, formNode]);
      return;
    }
    if (type === 'main' && label === 'End') {
      const endId = `${type}-end-${Date.now()}`;
      const endNode = {
        id: endId,
        type: 'end',
        position,
        data: {
          label: 'End',
          name: 'End',
          endType: 'success', // default end type (success, error, lost)
          onDelete: (nodeId: string) => {
            setNodes((nds: any) => nds.filter((node: any) => node.id !== nodeId));
          },
          onEdit: (nodeId: string) => {},
        },
      };
      setNodes((nds: any) => [...nds, endNode]);
      return;
    }
    const id = `${type}-${Date.now()}`;
    const newNode = {
      id,
      type: type === 'main' ? 'action' : type === 'controllers' ? 'controller' : 'extra',
      position,
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
                    style={{
                      borderLeft: item === 'Event'
                        ? '3px solid #D726FF'
                        : item === 'Form' && category === 'main'
                          ? '3px solid #FF8C00'
                        : item === 'End' && category === 'main'
                          ? '3px solid #FF0000'
                        : category === 'controllers'
                          ? '3px solid #39FF14'
                        : item === 'Action + Event'
                          ? '3px solid transparent'
                        : `3px solid ${config.color}`,
                      ...(item === 'Action + Event' && {
                        borderImage: 'linear-gradient(to bottom, #00bfff 50%, #D726FF 50%) 1',
                      })
                    }}
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
