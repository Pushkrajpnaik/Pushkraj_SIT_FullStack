import React from 'react';
import { Network, RotateCw, Maximize2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const SummaryStats = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard 
        title="Valid Trees" 
        value={summary.total_trees} 
        icon={Network} 
        colorClass="bg-blue-50 text-blue-600"
      />
      <StatCard 
        title="Cycles" 
        value={summary.total_cycles} 
        icon={RotateCw} 
        colorClass="bg-amber-50 text-amber-600"
      />
      <StatCard 
        title="Largest Tree Root" 
        value={summary.largest_tree_root || "N/A"} 
        icon={Maximize2} 
        colorClass="bg-purple-50 text-purple-600"
      />
    </div>
  );
};

export default SummaryStats;
