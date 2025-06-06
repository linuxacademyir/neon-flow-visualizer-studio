
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Edit, 
  Trash2,
  Clock,
  Database,
  User,
  Users,
  Bot,
  Settings,
  GitBranch,
  RotateCcw,
  Pause,
  Timer,
  Merge,
  RefreshCw,
  StopCircle,
  Play,
  CheckCircle,
  MessageSquare,
  FileText
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
  
  // Controllers
  'Condition': GitBranch,
  'Parallel': GitBranch,
  'Switch': GitBranch,
  'Loop handler': RotateCcw,
  'Aggregator': Merge,
  'Timeout controller': Timer,
  'Sleep': Pause,
  'Joint': Merge,
  'Retry': RefreshCw,
  'Timeout': StopCircle,
  'Pause until': Play,
  'Validation': CheckCircle,
  
  // Extras
  'Comment': MessageSquare,
};

export const CustomNode = memo(({ id, data, type }: any) => {
  const IconComponent = iconMap[data.label as keyof typeof iconMap] || Settings;
  
  // Show original label for display, custom name on hover
  const displayName = data.label;
  const customName = data.name && data.name !== data.label ? data.name : null;
  const hoverText = customName || data.description || '';

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
      {/* Left side handles */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left-1"
        className="connection-handle"
        style={{ top: '30%' }}
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left-2"
        className="connection-handle"
        style={{ top: '70%' }}
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
      
      {/* Right side handles */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right-1"
        className="connection-handle"
        style={{ top: '30%' }}
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right-2"
        className="connection-handle"
        style={{ top: '70%' }}
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
