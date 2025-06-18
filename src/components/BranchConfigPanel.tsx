import React, { useState, useEffect } from 'react';

export type BranchCondition =
  | { type: 'always' }
  | { type: 'expression'; expression: string }
  | { type: 'cooldown'; seconds: number };

export interface BranchConfig {
  branch: number;
  name: string;
  description?: string;
  priority: number;
  conditions: BranchCondition[];
  operators?: ('AND' | 'OR')[];
}

interface BranchConfigPanelProps {
  branchCount: number;
  initialConfig?: BranchConfig;
  onChange: (config: BranchConfig) => void;
  nodeType?: 'router' | 'join';
}

function getConditionTypes(nodeType?: 'router' | 'join') {
  if (nodeType === 'join') {
    return [
      { value: 'always', label: 'Always Join' },
      { value: 'expression', label: 'Expression' },
      { value: 'cooldown', label: 'Cooldown' },
    ];
  }
  if (nodeType === 'router') {
    return [
      { value: 'always', label: 'Always Run' },
      { value: 'expression', label: 'Expression' },
      { value: 'cooldown', label: 'Cooldown' },
    ];
  }
  // Default: only Expression and Cooldown
  return [
    { value: 'expression', label: 'Expression' },
    { value: 'cooldown', label: 'Cooldown' },
  ];
}

export const BranchConfigPanel: React.FC<BranchConfigPanelProps> = ({ branchCount, initialConfig, onChange, nodeType }) => {
  const [branch] = useState<number>(initialConfig?.branch ?? 1);
  const [name, setName] = useState<string>(initialConfig?.name ?? '');
  const [description, setDescription] = useState<string>(initialConfig?.description ?? '');
  const [priority, setPriority] = useState<number>(initialConfig?.priority ?? 1);
  const [conditions, setConditions] = useState<BranchCondition[]>(
    initialConfig?.conditions?.length
      ? initialConfig.conditions
      : [{ type: 'expression', expression: '' }]
  );
  const [operators, setOperators] = useState<("AND" | "OR")[]>(
    initialConfig?.operators?.length === (initialConfig?.conditions?.length || 1) - 1
      ? initialConfig.operators as ("AND" | "OR")[]
      : []
  );

  useEffect(() => {
    onChange({ branch, name, description, priority, conditions, operators });
    // eslint-disable-next-line
  }, [branch, name, description, priority, conditions, operators]);

  const handleOperatorChange = (idx: number, value: 'AND' | 'OR') => {
    setOperators(prev => prev.map((op, i) => (i === idx ? value : op)));
  };

  const handleConditionTypeChange = (idx: number, type: 'always' | 'expression' | 'cooldown') => {
    setConditions(prev =>
      prev.map((cond, i) => {
        if (i !== idx) return cond;
        if (type === 'always') return { type: 'always' };
        if (type === 'expression') return { type: 'expression', expression: '' };
        return { type: 'cooldown', seconds: 0 };
      })
    );
  };

  const handleConditionFieldChange = (idx: number, field: 'expression' | 'seconds', value: string | number) => {
    setConditions(prev =>
      prev.map((cond, i) => {
        if (i !== idx) return cond;
        if (cond.type === 'expression' && field === 'expression') {
          return { ...cond, expression: value as string };
        }
        if (cond.type === 'cooldown' && field === 'seconds') {
          return { ...cond, seconds: Number(value) };
        }
        return cond;
      })
    );
  };

  const addCondition = () => {
    setConditions(prev => [...prev, { type: 'expression', expression: '' }]);
    setOperators(prev => [...prev, 'AND']);
  };

  const removeCondition = (idx: number) => {
    setConditions(prev => prev.filter((_, i) => i !== idx));
    setOperators(prev => prev.filter((_, i) => i !== idx && i !== idx - 1 ? true : prev.length > 1));
  };

  return (
    <div className="space-y-4">
      {/* Branch meta fields */}
      <div className="flex flex-col gap-2 bg-gray-800 p-3 rounded border border-gray-700">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Branch Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter branch name"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Priority</label>
          <input
            type="number"
            min={1}
            value={priority}
            onChange={e => setPriority(Number(e.target.value) || 1)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Priority (1 = highest)"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Describe this branch's purpose"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Conditions</label>
        <div className="space-y-3">
          {conditions.map((cond, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <div className="flex items-center justify-center my-2">
                  <select
                    value={operators[idx - 1] || 'AND'}
                    onChange={e => handleOperatorChange(idx - 1, e.target.value as 'AND' | 'OR')}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                </div>
              )}
              <div className="bg-gray-800 p-3 rounded border border-gray-700 relative">
                <div className="flex items-center gap-2 mb-2">
                  <select
                    value={cond.type}
                    onChange={e => handleConditionTypeChange(idx, e.target.value as 'always' | 'expression' | 'cooldown')}
                    data-testid="condition-type-select"
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {getConditionTypes(nodeType).map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {conditions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCondition(idx)}
                      className="ml-auto text-xs text-red-400 hover:text-red-600 px-2 py-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {cond.type === 'expression' && (
                  <input
                    type="text"
                    value={cond.expression}
                    onChange={e => handleConditionFieldChange(idx, 'expression', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. input.age > 18"
                  />
                )}
                {cond.type === 'cooldown' && (
                  <input
                    type="number"
                    min={0}
                    value={cond.seconds}
                    onChange={e => handleConditionFieldChange(idx, 'seconds', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cooldown in seconds"
                  />
                )}
              </div>
            </React.Fragment>
          ))}
          <button
            type="button"
            onClick={addCondition}
            className="mt-2 px-3 py-1 bg-gray-700 text-blue-300 border border-gray-600 rounded hover:bg-gray-600 text-xs"
          >
            + Add Condition
          </button>
        </div>
      </div>
    </div>
  );
}; 