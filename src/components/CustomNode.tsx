import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Edit, 
  Trash2,
  Settings,
  User,
  Users,
  Bot,
  Router,
  JoinIcon as Join,
  Timer,
  AlertTriangle,
  RotateCcw,
  Merge,
  MessageSquare,
} from 'lucide-react';

const iconMap = {
  // Triggers (updated system icon to match actions)
  'System based': Settings,
  'User based': User,
  'Participant based': Users,
  'AI agent based': Bot,
  
  // Actions
  'System based action': Settings,
  'User based action': User,
  'Participant based action': Users,
  'AI agent based action': Bot,
  
  // Controllers (updated to use correct lucide-react icons)
  'Router': Router,
  'Join': Join,
  'Wait': Timer,
  'Escalation': AlertTriangle,
  'Iterator': RotateCcw,
  'Aggregator': Merge,
  
  // Extras
  'Comment': MessageSquare,
};

export const CustomNode = memo(({ id, data, type }: any) => {
  const IconComponent = iconMap[data.label as keyof typeof iconMap] || Settings;
  
  // Show custom name if available, otherwise show original label
  const displayName = data.name && data.name !== data.label ? data.name : data.label;
  
  // Create tooltip text - show custom name in full if it exists, plus description/notes
  const tooltipParts = [];
  if (data.name && data.name !== data.label) {
    tooltipParts.push(`Name: ${data.name}`);
  }
  if (data.description) {
    tooltipParts.push(`Description: ${data.description}`);
  }
  if (data.notes) {
    tooltipParts.push(`Notes: ${data.notes}`);
  }
  const hoverText = tooltipParts.length > 0 ? tooltipParts.join('\n') : '';

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onEdit?.(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this node?')) {
      data.onDelete?.(id);
    }
  };

  return (
    <div className={`react-flow__node-${type}`} title={hoverText}>
      {/* Left handle */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left"
        className="react-flow__handle"
        style={type === 'controller' ? { 
          left: '-6px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          zIndex: 100
        } : {}}
      />
      
      <div className="node-content">
        <IconComponent size={type === 'trigger' ? 14 : 16} />
        <span>{displayName}</span>
      </div>
      
      <div className="node-toolbar">
        <button onClick={handleEdit} title="Edit node">
          <Edit size={10} />
        </button>
        <button onClick={handleDelete} title="Delete node">
          <Trash2 size={10} />
        </button>
      </div>
      
      {/* Right handle */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right"
        className="react-flow__handle"
        style={type === 'controller' ? { 
          right: '-6px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          zIndex: 100
        } : {}}
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
