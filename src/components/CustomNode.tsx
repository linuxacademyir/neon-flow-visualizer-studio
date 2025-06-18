import { memo, useState, useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from '@xyflow/react';
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
  CircleCheckBig,
  CircleAlert,
  Ban,
  ListChecks,
} from 'lucide-react';

// Add SVG React components for actor icons
const ExternalUserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const InternalUserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
);
const AIAgentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);
const SystemUserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M11 9h4a2 2 0 0 0 2-2V3"/><circle cx="9" cy="9" r="2"/><path d="M7 21v-4a2 2 0 0 1 2-2h4"/><circle cx="15" cy="15" r="2"/></svg>
);
const ShuffleRouterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/></svg>
);

const JoinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-merge-icon lucide-merge"><path d="m8 6 4-4 4 4"/><path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22"/><path d="m20 22-5-5"/></svg>
);

const EscalationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw-icon lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);

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
  'Router': ShuffleRouterIcon,
  'Join': JoinIcon,
  'Wait': Timer,
  'Escalation': EscalationIcon,
  'Iterator': RotateCcw,
  'Aggregator': Merge,
  
  // Extras
  'Comment': MessageSquare,
  
  // Standard actions (actor types)
  'External User': ExternalUserIcon,
  'Internal User': InternalUserIcon,
  'AI Agent': AIAgentIcon,
  'System User': SystemUserIcon,
};

// SVGs for event node icons
const TriggableEventIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
);
const ConditionallyTriggableEventIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
);
const NonTriggableEventIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
);

const eventIconMap = {
  triggable: TriggableEventIcon,
  conditionally_triggable: ConditionallyTriggableEventIcon,
  non_triggable: NonTriggableEventIcon,
};
const EVENT_COLOR = '#FFF700';

export const CustomNode = memo(({ id, data, type }: any) => {
  const [hovered, setHovered] = useState(false);
  const updateNodeInternals = useUpdateNodeInternals();

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

  // Tooltip content logic
  const description = data.description;
  const showTooltip = hovered && description;

  if (type === 'event') {
    // Only show icon if eventType is set
    let EventIcon = null;
    if (data.eventType) {
      switch (data.eventType) {
        case 'conditionally_triggable':
          EventIcon = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          );
          break;
        case 'non_triggable':
          EventIcon = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
          );
          break;
        case 'triggable':
        default:
          EventIcon = () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
          );
          break;
      }
    }
    return (
      <div
        className="workflow-node workflow-node--event"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative' }}
      >
        <Handle 
          type="target" 
          position={Position.Left} 
          className="workflow-handle workflow-handle--target"
        />
        <div className="workflow-node__content">
          {EventIcon ? <EventIcon /> : null}
          <span className="workflow-node__label">{data.name || 'Event'}</span>
        </div>
        <Handle 
          type="source" 
          position={Position.Right} 
          className="workflow-handle workflow-handle--source"
        />
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              top: '-32px',
              left: '-8px',
              background: 'rgba(0,0,0,0.92)',
              color: '#fff',
              padding: '3px 6px',
              borderRadius: '7px',
              fontSize: '0.48rem',
              fontWeight: 500,
              whiteSpace: 'pre-line',
              zIndex: 100,
              pointerEvents: 'none',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)',
              minWidth: '32px',
              maxWidth: '120px',
              textAlign: 'center',
            }}
          >
            {description}
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '100%',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '7px solid rgba(0,0,0,0.92)',
                content: '""',
                display: 'block',
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // Use data.actor for action nodes, data.label otherwise
  const iconKey = type === 'action' ? data.actor : data.label;
  const IconComponent = iconMap[iconKey as keyof typeof iconMap] || Settings;
  
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
  const hoverText = data.description || displayName;

  // Only show icon for action node if actor is set
  // Special rendering for Router node with multiple output handles
  if (type === 'controller' && data.label === 'Router') {
    const branchCount = data.branchCount || 2;
    useEffect(() => {
      updateNodeInternals(id);
    }, [branchCount, id, updateNodeInternals]);
    return (
      <div
        className={`workflow-node workflow-node--controller`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative' }}
      >
        {/* Single input handle on the left */}
        <Handle
          type="target"
          position={Position.Left}
          className="workflow-handle workflow-handle--target"
        />
        <div className="workflow-node__content">
          <ShuffleRouterIcon />
          <span className="workflow-node__label">{displayName}</span>
        </div>
        {/* Multiple output handles on the right */}
        {Array.from({ length: branchCount }).map((_, i) => (
          <Handle
            key={`branch-${i}`}
            id={`branch-${i}`}
            type="source"
            position={Position.Right}
            style={{ top: `${((i + 1) / (branchCount + 1)) * 100}%`, transform: 'translateY(-50%)' }}
            className="workflow-handle workflow-handle--source"
            isConnectable={true}
          />
        ))}
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              top: '-32px',
              left: '-8px',
              background: 'rgba(0,0,0,0.92)',
              color: '#fff',
              padding: '3px 6px',
              borderRadius: '7px',
              fontSize: '0.48rem',
              fontWeight: 500,
              whiteSpace: 'pre-line',
              zIndex: 100,
              pointerEvents: 'none',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)',
              minWidth: '32px',
              maxWidth: '120px',
              textAlign: 'center',
            }}
          >
            {description}
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '100%',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '7px solid rgba(0,0,0,0.92)',
                content: '""',
                display: 'block',
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // Special rendering for Wait node with event resume type
  if (type === 'controller' && data.label === 'Wait') {
    // Ensure handle updates when waitType changes
    useEffect(() => {
      updateNodeInternals(id);
    }, [data.waitType, id, updateNodeInternals]);
    return (
      <div
        className={`workflow-node workflow-node--controller`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative', minHeight: 80 }}
      >
        {/* Single input handle on the left */}
        <Handle
          type="target"
          position={Position.Left}
          className="workflow-handle workflow-handle--target"
        />
        <div className="workflow-node__content">
          <Timer />
          <span className="workflow-node__label">{displayName}</span>
        </div>
        {/* Standard output handle on the right */}
        <Handle
          type="source"
          position={Position.Right}
          className="workflow-handle workflow-handle--source"
        />
        {/* Conditional event output handle at the bottom */}
        {data.waitType === 'event' && (
          <Handle
            type="source"
            id="event-resume"
            position={Position.Bottom}
            className="workflow-handle workflow-handle--source"
            isConnectable={true}
            style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)' }}
          />
        )}
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              top: '-32px',
              left: '-8px',
              background: 'rgba(0,0,0,0.92)',
              color: '#fff',
              padding: '3px 6px',
              borderRadius: '7px',
              fontSize: '0.48rem',
              fontWeight: 500,
              whiteSpace: 'pre-line',
              zIndex: 100,
              pointerEvents: 'none',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)',
              minWidth: '32px',
              maxWidth: '120px',
              textAlign: 'center',
            }}
          >
            {description}
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '100%',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '7px solid rgba(0,0,0,0.92)',
                content: '""',
                display: 'block',
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // Special rendering for Join node
  if (type === 'controller' && data.label === 'Join') {
    const inputCount = Math.max(2, Math.min(10, data.inputCount || 2));
    useEffect(() => {
      updateNodeInternals(id);
    }, [inputCount, id, updateNodeInternals]);
    return (
      <div
        className={`workflow-node workflow-node--controller`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative' }}
      >
        {/* Multiple input handles on the left */}
        {Array.from({ length: inputCount }).map((_, i) => (
          <Handle
            key={`input-${i}`}
            id={`input-${i}`}
            type="target"
            position={Position.Left}
            style={{ top: `${((i + 1) / (inputCount + 1)) * 100}%`, transform: 'translateY(-50%)' }}
            className="workflow-handle workflow-handle--target"
            isConnectable={true}
          />
        ))}
        <div className="workflow-node__content">
          <JoinIcon />
          <span className="workflow-node__label">{displayName}</span>
        </div>
        {/* Standard output handle on the right */}
        <Handle
          type="source"
          position={Position.Right}
          className="workflow-handle workflow-handle--source"
        />
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              top: '-32px',
              left: '-8px',
              background: 'rgba(0,0,0,0.92)',
              color: '#fff',
              padding: '3px 6px',
              borderRadius: '7px',
              fontSize: '0.48rem',
              fontWeight: 500,
              whiteSpace: 'pre-line',
              zIndex: 100,
              pointerEvents: 'none',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)',
              minWidth: '32px',
              maxWidth: '120px',
              textAlign: 'center',
            }}
          >
            {description}
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '100%',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '7px solid rgba(0,0,0,0.92)',
                content: '""',
                display: 'block',
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // Special rendering for Escalation node
  if (type === 'controller' && data.label === 'Escalation') {
    return (
      <div
        className={`workflow-node workflow-node--controller`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative' }}
      >
        {/* Single input handle on the left */}
        <Handle
          type="target"
          position={Position.Left}
          className="workflow-handle workflow-handle--target"
        />
        <div className="workflow-node__content">
          <EscalationIcon />
          <span className="workflow-node__label">{displayName}</span>
        </div>
        {/* Standard output handle on the right */}
        <Handle
          type="source"
          position={Position.Right}
          className="workflow-handle workflow-handle--source"
        />
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              top: '-32px',
              left: '-8px',
              background: 'rgba(0,0,0,0.92)',
              color: '#fff',
              padding: '3px 6px',
              borderRadius: '7px',
              fontSize: '0.48rem',
              fontWeight: 500,
              whiteSpace: 'pre-line',
              zIndex: 100,
              pointerEvents: 'none',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)',
              minWidth: '32px',
              maxWidth: '120px',
              textAlign: 'center',
            }}
          >
            {description}
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '100%',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '7px solid rgba(0,0,0,0.92)',
                content: '""',
                display: 'block',
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // Special rendering for Comment node as a well-shaped speech bubble (rounded rectangle with tail) and no handles
  if (type === 'extra' && data.label === 'Comment') {
    // Static width and height for comment node
    const fontSize = 10;
    const staticWidth = 160;
    const staticHeight = 28; // fits 2 lines at fontSize 10, lineHeight 1.1
    // Truncate text to 2 lines
    const charPerLine = 38;
    const text = (data.notes || '').replace(/\r?\n/g, ' ');
    const truncated = text.length > charPerLine * 2
      ? text.slice(0, charPerLine * 2 - 3) + '...'
      : text;
    // Split for 2 lines
    const textLines = truncated.match(new RegExp(`.{1,${charPerLine}}`, 'g')) || [' '];
    while (textLines.length < 2) textLines.push('');
    return (
      <div
        className="workflow-node workflow-node--extra workflow-node--comment-bubble"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative', padding: 0, background: 'none', border: 'none', boxShadow: 'none', width: staticWidth, height: staticHeight, minWidth: staticWidth, minHeight: staticHeight }}
      >
        {/* Speech bubble SVG: static size */}
        <svg width={staticWidth} height={staticHeight + 10} viewBox={`0 0 ${staticWidth} ${staticHeight + 10}`} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
          <rect x="1" y="1" width={staticWidth - 6} height={staticHeight - 2} rx="6" fill="#222" stroke="#FFD600" strokeWidth="2" />
          <polygon points={`28,${staticHeight - 2} 48,${staticHeight - 2} 38,${staticHeight + 8}`} fill="#222" stroke="#FFD600" strokeWidth="2" />
        </svg>
        <div className="workflow-node__content" style={{ position: 'relative', zIndex: 1, width: staticWidth - 10, height: staticHeight - 4, display: 'block', padding: 0, margin: 0 }}>
          <span className="workflow-node__label" style={{ color: '#FFD600', fontSize, fontFamily: 'monospace', fontStyle: 'italic', textAlign: 'left', width: '100%', wordBreak: 'break-word', lineHeight: 1.1, padding: 0, margin: 0, display: 'block', whiteSpace: 'pre' }}>
            {textLines.join('\n')}
          </span>
        </div>
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              top: '-32px',
              left: '-8px',
              background: 'rgba(0,0,0,0.92)',
              color: '#fff',
              padding: '3px 6px',
              borderRadius: '7px',
              fontSize: '0.48rem',
              fontWeight: 500,
              whiteSpace: 'pre-line',
              zIndex: 100,
              pointerEvents: 'none',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)',
              minWidth: '32px',
              maxWidth: '120px',
              textAlign: 'center',
            }}
          >
            {description}
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '100%',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '7px solid rgba(0,0,0,0.92)',
                content: '""',
                display: 'block',
              }}
            />
          </div>
        )}
      </div>
    );
  }

  if (type === 'form') {
    // Dynamic height calculation
    const baseHeight = 60; // px
    const perQuestionHeight = 22; // px per question
    const questionsCount = Array.isArray(data.questions) ? data.questions.length : 0;
    const dynamicHeight = baseHeight + (questionsCount > 0 ? questionsCount * perQuestionHeight : 0);
    return (
      <div
        className="workflow-node workflow-node--form"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative', minWidth: 180, minHeight: baseHeight, height: dynamicHeight, background: '#111', border: '2px solid #FF073A', boxShadow: '0 0 8px 2px #FF073A88' }}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="workflow-handle workflow-handle--target"
        />
        <div className="workflow-node__content flex flex-col items-center gap-1">
          <ListChecks size={18} />
          <span className="workflow-node__label font-semibold text-base mt-1">{data.name || 'Form'}</span>
          <div className="text-xs text-gray-400 mt-1 w-full">
            {Array.isArray(data.questions) && data.questions.length > 0 ? (
              <ul className="list-disc pl-4">
                {data.questions.map((q: any, idx: number) => (
                  <li key={idx} className="truncate">
                    {q.question ? q.question : 'Untitled'}
                    <span className="ml-2 text-gray-500">[{q.fieldType}]</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span>No questions</span>
            )}
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          className="workflow-handle workflow-handle--source"
        />
      </div>
    );
  }

  return (
    <div
      className={`workflow-node workflow-node--${type}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        className="workflow-handle workflow-handle--target"
      />
      
      <div className="workflow-node__content">
        {type === 'action' && data.actor ? <IconComponent size={14} /> : null}
        <span className="workflow-node__label">{displayName}</span>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="workflow-handle workflow-handle--source"
      />
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            top: '-32px',
            left: '-8px',
            background: 'rgba(0,0,0,0.92)',
            color: '#fff',
            padding: '3px 6px',
            borderRadius: '7px',
            fontSize: '0.48rem',
            fontWeight: 500,
            whiteSpace: 'pre-line',
            zIndex: 100,
            pointerEvents: 'none',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)',
            minWidth: '32px',
            maxWidth: '120px',
            textAlign: 'center',
          }}
        >
          {description}
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '100%',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '7px solid rgba(0,0,0,0.92)',
              content: '""',
              display: 'block',
            }}
          />
        </div>
      )}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
