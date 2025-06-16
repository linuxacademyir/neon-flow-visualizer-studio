
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
  Merge as Join,
  Timer,
  AlertTriangle,
  RotateCcw,
  Merge,
  MessageSquare,
  Mail,
  MousePointer,
} from 'lucide-react';

const iconMap = {
  // Email specific actions
  'Send Email': Mail,
  'Update Signature': Edit,
  'Track Click': MousePointer,
  
  // Standard actions
  'System based action': Settings,
  'User based action': User,
  'Participant based action': Users,
  'AI agent based action': Bot,
  
  // Controllers
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
  
  const displayName = data.name && data.name !== data.label ? data.name : data.label;
  
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
    <div className={`workflow-node workflow-node--${type}`} title={hoverText}>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="workflow-handle workflow-handle--target"
      />
      
      <div className="workflow-node__content">
        <IconComponent size={type === 'action' ? 12 : 14} />
        <span className="workflow-node__label">{displayName}</span>
      </div>
      
      <div className="workflow-node__toolbar">
        <button onClick={handleEdit} title="Edit node" className="workflow-node__button">
          <Edit size={10} />
        </button>
        <button onClick={handleDelete} title="Delete node" className="workflow-node__button">
          <Trash2 size={10} />
        </button>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="workflow-handle workflow-handle--source"
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
