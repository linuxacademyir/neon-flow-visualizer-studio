
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
  // Triggers
  'Time based': Clock,
  'System based': Database,
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
  'Annotation': FileText,
};

export const CustomNode = memo(({ id, data, type }: any) => {
  const IconComponent = iconMap[data.label as keyof typeof iconMap] || Settings;
  
  // Show custom name if available, otherwise show label
  const displayName = data.name && data.name !== data.label ? data.name : data.label;

  return (
    <div className={`react-flow__node-${type}`}>
      <Handle type="target" position={Position.Top} />
      
      <div className="node-content">
        <IconComponent size={type === 'trigger' ? 16 : 18} />
        <span>{displayName}</span>
      </div>
      
      <div className="node-toolbar">
        <button onClick={(e) => { e.stopPropagation(); data.onEdit?.(id); }}>
          <Edit size={12} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); data.onDelete?.(id); }}>
          <Trash2 size={12} />
        </button>
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
