import React from 'react';
import { ChevronRight, Circle, GitBranch } from 'lucide-react';

const TreeNode = ({ label, children }) => {
  const childEntries = Object.entries(children);
  const hasChildren = childEntries.length > 0;

  return (
    <div className="ml-6 mt-1">
      <div className="flex items-center gap-2 group">
        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs border border-primary-200">
          {label}
        </div>
        {hasChildren && <ChevronRight className="w-3 h-3 text-gray-400" />}
      </div>
      
      {hasChildren && (
        <div className="border-l border-gray-200 ml-3 pl-3 py-1">
          {childEntries.map(([childLabel, childChildren]) => (
            <TreeNode key={childLabel} label={childLabel} children={childChildren} />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeView = ({ hierarchy }) => {
  const { root, tree, depth, has_cycle } = hierarchy;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary-600" />
          <span className="font-semibold text-gray-700">Root: {root}</span>
        </div>
        {has_cycle ? (
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">Cycle Detected</span>
        ) : (
          <span className="text-xs text-gray-500 font-medium">Depth: {depth}</span>
        )}
      </div>
      
      <div className="p-6">
        {has_cycle ? (
          <div className="flex flex-col items-center justify-center py-4 text-gray-400">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2">
              <Circle className="w-5 h-5" />
            </div>
            <p className="text-sm">Empty tree due to circular dependency</p>
          </div>
        ) : (
          <div className="-ml-6">
            <TreeNode label={root} children={tree[root]} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeView;
