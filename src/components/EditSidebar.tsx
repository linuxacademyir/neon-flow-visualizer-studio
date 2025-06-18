import React, { useState, useEffect } from 'react';
import { X, CircleCheckBig, CircleAlert, Ban, Settings, User, Users, Bot, Router, Merge as Join, Timer, AlertTriangle, RotateCcw, Merge, MessageSquare, Mail, MousePointer, Edit } from 'lucide-react';
import { BranchConfigPanel } from './BranchConfigPanel';
import type { BranchConfig } from './BranchConfigPanel';

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

const actorTypeOptions = ['External User', 'Internal User', 'AI Agent', 'System User'];

const eventTypeOptions = [
  { label: 'Triggable', value: 'triggable', icon: CircleCheckBig },
  { label: 'Conditionally Triggable', value: 'conditionally_triggable', icon: CircleAlert },
  { label: 'Non Triggable', value: 'non_triggable', icon: Ban },
];

// Add SVG React components for actor icons (copied from CustomNode.tsx)
const ExternalUserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const InternalUserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
);
const AIAgentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);
const SystemUserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M11 9h4a2 2 0 0 0 2-2V3"/><circle cx="9" cy="9" r="2"/><path d="M7 21v-4a2 2 0 0 1 2-2h4"/><circle cx="15" cy="15" r="2"/></svg>
);
const ShuffleRouterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/></svg>
);

const JoinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-merge-icon lucide-merge"><path d="m8 6 4-4 4 4"/><path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22"/><path d="m20 22-5-5"/></svg>
);

const EscalationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw-icon lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);

const iconMap = {
  'Send Email': Mail,
  'Update Signature': Edit,
  'Track Click': MousePointer,
  'System based action': SystemUserIcon,
  'User based action': User,
  'Participant based action': Users,
  'AI agent based action': Bot,
  'Router': ShuffleRouterIcon,
  'Join': JoinIcon,
  'Wait': Timer,
  'Escalation': EscalationIcon,
  'Iterator': RotateCcw,
  'Aggregator': Merge,
  'Comment': MessageSquare,
  'External User': ExternalUserIcon,
  'Internal User': InternalUserIcon,
  'AI Agent': AIAgentIcon,
  'System User': SystemUserIcon,
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
      if (selectedNode.type === 'controller' || selectedNode.type === 'trigger') {
        onUpdateNode(selectedNode.id, { label: newType });
      } else if (selectedNode.type === 'action') {
        onUpdateNode(selectedNode.id, { actor: newType });
      }
    }
  };

  if (!isOpen) return null;

  const isController = selectedNode?.type === 'controller';
  const canChangeType = selectedNode && (selectedNode.type === 'trigger' || selectedNode.type === 'action' || selectedNode.type === 'controller');
  
  let typeOptions = [];
  if (selectedNode?.type === 'action') {
    typeOptions = actorTypeOptions;
  } else if (selectedNode?.type === 'trigger') {
    typeOptions = nodeTypeOptions.trigger;
  } else if (selectedNode?.type === 'controller') {
    typeOptions = nodeTypeOptions.controller;
  }
  
  const isCommentNode = selectedNode && selectedNode.data.label === 'Comment';
  const isEventNode = selectedNode?.type === 'event';
  const isFormNode = selectedNode?.type === 'form';

  // Helper for updating questions array
  const handleQuestionChange = (idx: number, updates: any) => {
    if (!selectedNode) return;
    const questions = [...(selectedNode.data.questions || [])];
    questions[idx] = { ...questions[idx], ...updates };
    onUpdateNode(selectedNode.id, { questions });
  };
  const handleAddQuestion = () => {
    if (!selectedNode) return;
    const questions = [...(selectedNode.data.questions || [])];
    questions.push({ question: '', fieldType: 'text', options: [] });
    onUpdateNode(selectedNode.id, { questions });
  };
  const handleRemoveQuestion = (idx: number) => {
    if (!selectedNode) return;
    const questions = [...(selectedNode.data.questions || [])];
    questions.splice(idx, 1);
    onUpdateNode(selectedNode.id, { questions });
  };
  const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
    if (!selectedNode) return;
    const questions = [...(selectedNode.data.questions || [])];
    const options = [...(questions[qIdx].options || [])];
    options[optIdx] = value;
    questions[qIdx].options = options;
    onUpdateNode(selectedNode.id, { questions });
  };
  const handleAddOption = (qIdx: number) => {
    if (!selectedNode) return;
    const questions = [...(selectedNode.data.questions || [])];
    const options = [...(questions[qIdx].options || [])];
    options.push('');
    questions[qIdx].options = options;
    onUpdateNode(selectedNode.id, { questions });
  };
  const handleRemoveOption = (qIdx: number, optIdx: number) => {
    if (!selectedNode) return;
    const questions = [...(selectedNode.data.questions || [])];
    const options = [...(questions[qIdx].options || [])];
    options.splice(optIdx, 1);
    questions[qIdx].options = options;
    onUpdateNode(selectedNode.id, { questions });
  };

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'radio', label: 'Radio' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date' },
    { value: 'number', label: 'Number' },
    { value: 'file', label: 'File' },
    { value: 'boolean', label: 'Boolean' },
  ];

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
          {canChangeType && !isEventNode && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                {(() => {
                  if (selectedNode?.type === 'action') {
                    const Icon = iconMap[selectedNode.data.actor] || null;
                    if (Icon) {
                      return <Icon />;
                    }
                  }
                  return null;
                })()}
                {isController ? 'Controller type' : 'Action Type'}
              </label>
              <select
                value={selectedNode?.type === 'action' ? (selectedNode.data.actor || '') : selectedType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={selectedNode?.type === 'controller'}
              >
                <option value="">Select type...</option>
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
          {selectedNode && !isEventNode && (
            <>
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
            </>
          )}
          {selectedNode && isEventNode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  {(() => {
                    const type = selectedNode.data.eventType;
                    if (type === 'triggable') {
                      return (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
                      );
                    }
                    if (type === 'conditionally_triggable') {
                      return (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                      );
                    }
                    if (type === 'non_triggable') {
                      return (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
                      );
                    }
                    return null;
                  })()}
                  Event Type
                </label>
                <select
                  value={selectedNode.data.eventType || ''}
                  onChange={e => onUpdateNode(selectedNode.id, { eventType: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select event type...</option>
                  {eventTypeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Custom Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onBlur={handleSave}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter custom name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  onBlur={handleSave}
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter node description"
                />
              </div>
            </>
          )}
          {isFormNode && (
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-white mb-2">Form Questions</h3>
              {(selectedNode.data.questions || []).map((q: any, idx: number) => (
                <div key={idx} className="border border-gray-700 rounded p-2 mb-2 bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={q.question}
                      onChange={e => handleQuestionChange(idx, { question: e.target.value })}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Question #${idx + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-red-400 hover:text-red-600 px-2"
                      title="Remove question"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-xs text-gray-400">Field Type:</label>
                    <select
                      value={q.fieldType}
                      onChange={e => handleQuestionChange(idx, { fieldType: e.target.value, options: (['dropdown','radio','checkbox'].includes(e.target.value) ? (q.options || ['']) : []) })}
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {fieldTypes.map(ft => (
                        <option key={ft.value} value={ft.value}>{ft.label}</option>
                      ))}
                    </select>
                  </div>
                  {['dropdown','radio','checkbox'].includes(q.fieldType) && (
                    <div className="mb-2">
                      <label className="text-xs text-gray-400">Options:</label>
                      {(q.options || []).map((opt: string, optIdx: number) => (
                        <div key={optIdx} className="flex items-center gap-2 mb-1">
                          <input
                            type="text"
                            value={opt}
                            onChange={e => handleOptionChange(idx, optIdx, e.target.value)}
                            className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Option #${optIdx + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(idx, optIdx)}
                            className="text-red-400 hover:text-red-600 px-2"
                            title="Remove option"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddOption(idx)}
                        className="text-xs text-blue-400 hover:text-blue-600 mt-1"
                      >
                        + Add Option
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddQuestion}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white text-sm rounded px-3 py-2 mt-2"
              >
                + Add Question
              </button>
            </div>
          )}
          {/* Router branch count input and settings */}
          {selectedNode?.type === 'controller' && (selectedNode?.data?.label === 'Router' || selectedType === 'Router') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  Number of Output Branches
                </label>
                <input
                  type="number"
                  min={2}
                  max={10}
                  value={selectedNode.data.branchCount || 2}
                  onChange={e => {
                    const value = Math.max(2, Math.min(10, parseInt(e.target.value, 10) || 2));
                    onUpdateNode(selectedNode.id, { branchCount: value });
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Number of branches"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Run Mode</label>
                <select
                  value={selectedNode.data.runMode || 'ALL'}
                  onChange={e => onUpdateNode(selectedNode.id, { runMode: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">ALL — run all eligible branches</option>
                  <option value="N">N — run exactly N eligible branches</option>
                </select>
              </div>
              {selectedNode.data.runMode === 'N' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">N (number of branches to run)</label>
                    <input
                      type="number"
                      min={1}
                      max={selectedNode.data.branchCount || 2}
                      value={selectedNode.data.runN || 1}
                      onChange={e => {
                        let value = parseInt(e.target.value, 10) || 1;
                        value = Math.max(1, value); // Don't cap here, just validate
                        onUpdateNode(selectedNode.id, { runN: value });
                      }}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="N"
                    />
                    {(selectedNode.data.runN || 1) > (selectedNode.data.branchCount || 2) && (
                      <div className="text-xs text-red-400 mt-1">N cannot be greater than Number of Branches ({selectedNode.data.branchCount || 2})</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Method</label>
                    <select
                      value={selectedNode.data.runNMethod || 'Random'}
                      onChange={e => onUpdateNode(selectedNode.id, { runNMethod: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Random">Random — pick N randomly</option>
                      <option value="First">First — pick the first N</option>
                      <option value="Priority">Priority — pick the top N by priority</option>
                    </select>
                  </div>
                </>
              )}
              <hr className="my-4 border-gray-700" />
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">Configure Branch</label>
                <BranchConfigSidebar
                  branchCount={selectedNode.data.branchCount || 2}
                  branchConfigs={selectedNode.data.branchConfigs || []}
                  onUpdateConfigs={configs => onUpdateNode(selectedNode.id, { branchConfigs: configs })}
                  nodeType={'router'}
                />
              </div>
            </>
          )}
          {/* Wait Node UI */}
          {selectedNode?.type === 'controller' && (selectedNode?.data?.label === 'Wait' || selectedType === 'Wait') && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">When should it pause?</label>
              <select
                value={selectedNode.data.pauseType || ''}
                onChange={e => onUpdateNode(selectedNode.id, { pauseType: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                <option value="">Select pause type...</option>
                <option value="unconditional">Simply pause (unconditional wait)</option>
                <option value="event">Pause by an event from an action</option>
                <option value="condition">Pause by a condition</option>
                <option value="error">Pause by an error from an action</option>
                <option value="other">Pause by other reasons</option>
              </select>
              {/* Pause by Event */}
              {selectedNode.data.pauseType === 'event' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Triggered by Actor Type</label>
                    <select
                      value={selectedNode.data.pauseEventActorType || ''}
                      onChange={e => onUpdateNode(selectedNode.id, { pauseEventActorType: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select actor type...</option>
                      <option value="AI Agent">AI Agent</option>
                      <option value="Internal User">Internal User</option>
                      <option value="External User">External User</option>
                      <option value="System">System</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Action Name</label>
                    <input
                      type="text"
                      value={selectedNode.data.pauseEventActionName || ''}
                      onChange={e => onUpdateNode(selectedNode.id, { pauseEventActionName: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. User Uploaded File, Payment Confirmed, Webhook Received"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Event Name</label>
                    <input
                      type="text"
                      value={selectedNode.data.pauseEventName || ''}
                      onChange={e => onUpdateNode(selectedNode.id, { pauseEventName: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. file_uploaded, payment_confirmed, webhook_received"
                    />
                  </div>
                </div>
              )}
              {/* Pause by Condition */}
              {selectedNode.data.pauseType === 'condition' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pause Conditions</label>
                  <BranchConfigPanel
                    branchCount={1}
                    initialConfig={selectedNode.data.pauseConditionConfig || {
                      branch: 1,
                      name: 'Pause Condition',
                      description: '',
                      priority: 1,
                      conditions: [{ type: 'expression', expression: '' }],
                      operators: [],
                    }}
                    onChange={cfg => onUpdateNode(selectedNode.id, { pauseConditionConfig: cfg })}
                  />
                </div>
              )}
              {/* Pause by Error */}
              {selectedNode.data.pauseType === 'error' && (
                <div className="space-y-4">
                  <label className="block text-xs text-gray-400 mb-1">Action Name</label>
                  <input
                    type="text"
                    value={selectedNode.data.pauseErrorActionName || ''}
                    onChange={e => onUpdateNode(selectedNode.id, { pauseErrorActionName: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Action that may error"
                  />
                </div>
              )}
              {/* Pause by Other Reasons */}
              {selectedNode.data.pauseType === 'other' && (
                <div className="space-y-4">
                  <label className="block text-xs text-gray-400 mb-1">Other Reason</label>
                  <input
                    type="text"
                    value={selectedNode.data.pauseOtherReason || ''}
                    onChange={e => onUpdateNode(selectedNode.id, { pauseOtherReason: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the reason for pausing"
                  />
                </div>
              )}
            </div>
          )}
          {/* Wait Node Pause UI */}
          {selectedNode?.type === 'controller' && (selectedNode?.data?.label === 'Wait' || selectedType === 'Wait') && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">How should this step resume?</label>
              <select
                value={selectedNode.data.waitType || ''}
                onChange={e => onUpdateNode(selectedNode.id, { waitType: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                <option value="">Select how to resume...</option>
                <option value="time">Resume by Time</option>
                <option value="event">Resume by Event</option>
                <option value="condition">Resume by Conditions</option>
              </select>
              {/* Wait by Time */}
              {selectedNode.data.waitType === 'time' && (
                <div className="space-y-4">
                  <div className="mb-2">
                    <label className="block text-xs text-gray-400 mb-1">Wait mode</label>
                    <select
                      value={selectedNode.data.waitTimeMode === 'datetime' ? 'datetime' : 'duration'}
                      onChange={e => onUpdateNode(selectedNode.id, { waitTimeMode: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="duration">Duration</option>
                      <option value="datetime">Specific Date/Time</option>
                    </select>
                  </div>
                  {/* Duration input */}
                  {selectedNode.data.waitTimeMode !== 'datetime' && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Wait for how long?</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          min={1}
                          value={selectedNode.data.waitDurationValue || ''}
                          onChange={e => onUpdateNode(selectedNode.id, { waitDurationValue: parseInt(e.target.value, 10) || '' })}
                          className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="30"
                        />
                        <select
                          value={selectedNode.data.waitDurationUnit || 'seconds'}
                          onChange={e => onUpdateNode(selectedNode.id, { waitDurationUnit: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="seconds">seconds</option>
                          <option value="minutes">minutes</option>
                          <option value="hours">hours</option>
                        </select>
                      </div>
                    </div>
                  )}
                  {/* Specific Date/Time input */}
                  {selectedNode.data.waitTimeMode === 'datetime' && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Wait until when?</label>
                      <input
                        type="datetime-local"
                        value={selectedNode.data.waitUntil || ''}
                        onChange={e => onUpdateNode(selectedNode.id, { waitUntil: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              )}
              {/* Wait by Event */}
              {selectedNode.data.waitType === 'event' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Triggered by Actor Type</label>
                    <select
                      value={selectedNode.data.waitEventActorType || ''}
                      onChange={e => onUpdateNode(selectedNode.id, { waitEventActorType: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select actor type...</option>
                      <option value="AI Agent">AI Agent</option>
                      <option value="Internal User">Internal User</option>
                      <option value="External User">External User</option>
                      <option value="System">System</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Action Name</label>
                    <input
                      type="text"
                      value={selectedNode.data.waitEventActionName || ''}
                      onChange={e => onUpdateNode(selectedNode.id, { waitEventActionName: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. User Uploaded File, Payment Confirmed, Webhook Received"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Event Name</label>
                    <input
                      type="text"
                      value={selectedNode.data.waitEventName || ''}
                      onChange={e => onUpdateNode(selectedNode.id, { waitEventName: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. file_uploaded, payment_confirmed, webhook_received"
                    />
                  </div>
                </div>
              )}
              {/* Wait by Condition */}
              {selectedNode.data.waitType === 'condition' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Resume Conditions</label>
                  <BranchConfigPanel
                    branchCount={1}
                    initialConfig={selectedNode.data.waitConditionConfig || {
                      branch: 1,
                      name: 'Resume Condition',
                      description: '',
                      priority: 1,
                      conditions: [{ type: 'always' }],
                      operators: [],
                    }}
                    onChange={cfg => onUpdateNode(selectedNode.id, { waitConditionConfig: cfg })}
                  />
                </div>
              )}
            </div>
          )}
          {/* Escalation Node UI */}
          {selectedNode?.type === 'controller' && (selectedNode?.data?.label === 'Escalation' || selectedType === 'Escalation') && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">How should this step retry?</label>
              <select
                value={selectedNode.data.retryType || ''}
                onChange={e => onUpdateNode(selectedNode.id, { retryType: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                <option value="">Select how to retry...</option>
                <option value="time">Retry by Time</option>
                <option value="event">Retry by Event</option>
                <option value="condition">Retry by Conditions</option>
              </select>
              {/* Retry by Time */}
              {selectedNode.data.retryType === 'time' && (
                <div className="mb-4 space-y-2">
                  <div className="mb-2">
                    <label className="block text-xs text-gray-400 mb-1">Retry mode</label>
                    <select
                      value={selectedNode.data.retryTimeMode === 'datetime' ? 'datetime' : 'duration'}
                      onChange={e => onUpdateNode(selectedNode.id, { retryTimeMode: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="duration">Duration</option>
                      <option value="datetime">Specific Date/Time</option>
                    </select>
                  </div>
                  {/* Duration input */}
                  {selectedNode.data.retryTimeMode !== 'datetime' && (
                    <div className="flex gap-2 items-center mb-2">
                      <label className="block text-xs text-gray-400 mb-1">Retry after how long?</label>
                      <input
                        type="number"
                        min={1}
                        value={selectedNode.data.retryDurationValue || ''}
                        onChange={e => onUpdateNode(selectedNode.id, { retryDurationValue: parseInt(e.target.value, 10) || '' })}
                        className="w-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="30"
                      />
                      <select
                        value={selectedNode.data.retryDurationUnit || 'seconds'}
                        onChange={e => onUpdateNode(selectedNode.id, { retryDurationUnit: e.target.value })}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="seconds">seconds</option>
                        <option value="minutes">minutes</option>
                        <option value="hours">hours</option>
                      </select>
                    </div>
                  )}
                  {/* Specific Date/Time input */}
                  {selectedNode.data.retryTimeMode === 'datetime' && (
                    <div className="mb-2">
                      <label className="block text-xs text-gray-400 mb-1">Retry at what date/time?</label>
                      <input
                        type="datetime-local"
                        value={selectedNode.data.retryUntil || ''}
                        onChange={e => onUpdateNode(selectedNode.id, { retryUntil: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              )}
              {/* Retry by Event */}
              {selectedNode.data.retryType === 'event' && (
                <div className="mb-4 space-y-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Triggered by Actor Type</label>
                    <select
                      value={selectedNode.data.retryEventActorType || ''}
                      onChange={e => onUpdateNode(selectedNode.id, { retryEventActorType: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select actor type...</option>
                      <option value="AI Agent">AI Agent</option>
                      <option value="Internal User">Internal User</option>
                      <option value="External User">External User</option>
                      <option value="System">System</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Action Name</label>
                    <input
                      type="text"
                      value={selectedNode.data.retryEventActionName || ''}
                      onChange={e => onUpdateNode(selectedNode.id, { retryEventActionName: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. User Uploaded File, Payment Confirmed, Webhook Received"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Event Name</label>
                    <input
                      type="text"
                      value={selectedNode.data.retryEventName || ''}
                      onChange={e => onUpdateNode(selectedNode.id, { retryEventName: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. file_uploaded, payment_confirmed, webhook_received"
                    />
                  </div>
                </div>
              )}
              {/* Retry by Condition */}
              {selectedNode.data.retryType === 'condition' && (
                <div className="mb-4 space-y-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Retry Conditions</label>
                  <BranchConfigPanel
                    branchCount={1}
                    initialConfig={selectedNode.data.retryConditionConfig || {
                      branch: 1,
                      name: 'Retry Condition',
                      description: '',
                      priority: 1,
                      conditions: [{ type: 'expression', expression: '' }],
                      operators: [],
                    }}
                    onChange={cfg => onUpdateNode(selectedNode.id, { retryConditionConfig: cfg })}
                  />
                </div>
              )}
              {/* What to retry? */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">What to retry?</label>
                <select
                  value={selectedNode.data.retryWhat || 'same'}
                  onChange={e => onUpdateNode(selectedNode.id, { retryWhat: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                >
                  <option value="same">Retry the same action</option>
                  <option value="another">Retry another action</option>
                  <option value="rollback">Rollback to a node</option>
                </select>
                {selectedNode.data.retryWhat === 'another' && (
                  <input
                    type="text"
                    value={selectedNode.data.retryAnotherActionName || ''}
                    onChange={e => onUpdateNode(selectedNode.id, { retryAnotherActionName: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    placeholder="Enter action name to retry"
                  />
                )}
                {selectedNode.data.retryWhat === 'rollback' && (
                  <input
                    type="text"
                    value={selectedNode.data.retryRollbackNodeName || ''}
                    onChange={e => onUpdateNode(selectedNode.id, { retryRollbackNodeName: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    placeholder="Enter node name to rollback to"
                  />
                )}
              </div>
            </div>
          )}
          {/* Join input count input and join mode settings */}
          {selectedNode?.type === 'controller' && (selectedNode?.data?.label === 'Join' || selectedType === 'Join') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  Number of Inputs Branches
                </label>
                <input
                  type="number"
                  min={2}
                  max={10}
                  value={selectedNode.data.inputCount || 2}
                  onChange={e => {
                    const value = Math.max(2, Math.min(10, parseInt(e.target.value, 10) || 2));
                    onUpdateNode(selectedNode.id, { inputCount: value });
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Number of inputs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Join Mode</label>
                <select
                  value={selectedNode.data.joinMode || 'ALL'}
                  onChange={e => onUpdateNode(selectedNode.id, { joinMode: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">ALL — wait for all input branches</option>
                  <option value="N">N — wait for exactly N input branches</option>
                </select>
              </div>
              {selectedNode.data.joinMode === 'N' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">N (number of input branches to wait for)</label>
                    <input
                      type="number"
                      min={1}
                      max={selectedNode.data.inputCount || 2}
                      value={selectedNode.data.joinN || 1}
                      onChange={e => {
                        let value = parseInt(e.target.value, 10) || 1;
                        value = Math.max(1, value);
                        onUpdateNode(selectedNode.id, { joinN: value });
                      }}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="N"
                    />
                    {(selectedNode.data.joinN || 1) > (selectedNode.data.inputCount || 2) && (
                      <div className="text-xs text-red-400 mt-1">N cannot be greater than Number of Inputs Branches ({selectedNode.data.inputCount || 2})</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Method</label>
                    <select
                      value={selectedNode.data.joinNMethod || 'First'}
                      onChange={e => onUpdateNode(selectedNode.id, { joinNMethod: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="First">First — wait for the first N</option>
                      <option value="Random">Random — wait for any N</option>
                      <option value="Priority">Priority — wait for the top N by priority</option>
                    </select>
                  </div>
                </>
              )}
              <hr className="my-4 border-gray-700" />
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">Configure Input Branch</label>
                <BranchConfigSidebar
                  branchCount={selectedNode.data.inputCount || 2}
                  branchConfigs={selectedNode.data.inputBranchConfigs || []}
                  onUpdateConfigs={configs => onUpdateNode(selectedNode.id, { inputBranchConfigs: configs })}
                  nodeType={'join'}
                />
              </div>
            </>
          )}
          <div className="text-xs text-gray-500 mt-4">
            <p><strong>Type:</strong> {selectedNode.type}</p>
            <p><strong>ID:</strong> {selectedNode.id}</p>
          </div>
        </div>
      )}
    </div>
  );
};

interface BranchConfigSidebarProps {
  branchCount: number;
  branchConfigs: BranchConfig[];
  onUpdateConfigs: (configs: BranchConfig[]) => void;
  nodeType: 'router' | 'join';
}

const BranchConfigSidebar: React.FC<BranchConfigSidebarProps> = ({ branchCount, branchConfigs, onUpdateConfigs, nodeType }) => {
  const [selectedBranch, setSelectedBranch] = React.useState<number>(1);

  // Ensure configs array is always up to date with branchCount
  React.useEffect(() => {
    if (branchConfigs.length !== branchCount) {
      const newConfigs = Array.from({ length: branchCount }, (_, i) =>
        branchConfigs[i] || {
          branch: i + 1,
          name: '',
          description: '',
          priority: 1,
          conditions: [{ type: 'always' }] as import('./BranchConfigPanel').BranchCondition[],
        }
      );
      onUpdateConfigs(newConfigs);
    }
    // eslint-disable-next-line
  }, [branchCount]);

  const handleBranchChange = (cfg: BranchConfig) => {
    const newConfigs = [...branchConfigs];
    newConfigs[cfg.branch - 1] = cfg;
    onUpdateConfigs(newConfigs);
  };

  return (
    <div>
      <div className="mb-2">
        <label className="block text-xs text-gray-400 mb-1">Select Branch</label>
        <select
          value={selectedBranch}
          onChange={e => setSelectedBranch(Number(e.target.value))}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Array.from({ length: branchCount }, (_, i) => (
            <option key={i + 1} value={i + 1}>Branch {i + 1}</option>
          ))}
        </select>
      </div>
      <BranchConfigPanel
        key={selectedBranch}
        branchCount={branchCount}
        initialConfig={branchConfigs[selectedBranch - 1]}
        onChange={handleBranchChange}
        nodeType={nodeType}
      />
    </div>
  );
};
