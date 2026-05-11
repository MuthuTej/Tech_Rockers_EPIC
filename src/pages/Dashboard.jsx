import React, { useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid,
  RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { stageConfig, getEngineerById, formatTime } from '../data/mockData';
import { StageBadge, Avatar } from '../components/UI/Badge';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  if (user?.role === 'manager') return <ManagerDashboard />;
  return <EngineerDashboard />;
}

/* ============== MANAGER DASHBOARD ============== */
function ManagerDashboard() {
  const { blocks, auditLog, engineers } = useAppData();

  const kpis = useMemo(() => {
    return {
      total: blocks.length,
      completed: blocks.filter((b) => b.stage === 'COMPLETED').length,
      totalEst: blocks.reduce((s, b) => s + b.estHours, 0),
    };
  }, [blocks]);

  const pendingApprovals = blocks.filter(b => b.stage === 'REVIEW');

  // Mock data for the smooth line charts to match the UI image
  const activityData = [
    { name: 'Jan', current: 120, previous: 80 },
    { name: 'Feb', current: 110, previous: 90 },
    { name: 'Mar', current: 150, previous: 85 },
    { name: 'Apr', current: 200, previous: 120 },
    { name: 'May', current: 180, previous: 140 },
    { name: 'Jun', current: 250, previous: 110 },
    { name: 'Jul', current: 210, previous: 130 },
    { name: 'Aug', current: 180, previous: 160 },
    { name: 'Sep', current: 220, previous: 190 },
    { name: 'Oct', current: 190, previous: 210 },
    { name: 'Nov', current: 260, previous: 230 },
    { name: 'Dec', current: 290, previous: 250 },
  ];

  const maintainabilityData = [{ name: 'Score', value: 85, fill: '#10B981' }]; // Mock score of 85/100
  const recentBlocks = blocks.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Manager Control Center</h2>
        <div className="flex gap-2 text-sm text-gray-500 font-medium bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
          <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-800">Day</button>
          <button className="px-3 py-1 rounded-md hover:bg-gray-50">Week</button>
          <button className="px-3 py-1 rounded-md hover:bg-gray-50">Month</button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Total Blocks" value={kpis.total} subtext="Week comparison" subValue="+12.5%" isPositive={true} color="blue" />
        <KpiCard title="Completed" value={kpis.completed} subtext="Month comparison" subValue="+8.2%" isPositive={true} color="green" />
        <KpiCard title="Est Hours" value={`${kpis.totalEst}h`} subtext="Week comparison" subValue="-2.1%" isPositive={false} color="red" />
      </div>

      {/* Approvals & Maintainability Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approvals Widget */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              Action Needed: Approvals
              {pendingApprovals.length > 0 && (
                <span className="bg-red-100 text-red-600 py-0.5 px-2.5 rounded-full text-xs font-bold">{pendingApprovals.length} Pending</span>
              )}
            </h3>
            <Link to="/approvals" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">View All →</Link>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3 pr-2 scrollbar-thin">
             {pendingApprovals.length > 0 ? (
               pendingApprovals.map(b => {
                 const eng = getEngineerById(b.assignedTo);
                 return (
                   <div key={b.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold text-sm">
                         {b.id.substring(3)}
                       </div>
                       <div>
                         <div className="font-bold text-gray-800">{b.name}</div>
                         <div className="text-xs text-gray-500 font-medium">By {eng ? eng.name : 'Unknown'} • {b.techNode}</div>
                       </div>
                     </div>
                     <Link to="/approvals" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                       Review
                     </Link>
                   </div>
                 );
               })
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-50"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                 <p className="font-medium">You're all caught up!</p>
               </div>
             )}
          </div>
        </div>

        {/* Maintainability Index Widget */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <h3 className="text-lg font-bold text-gray-800 w-full text-left mb-2">Maintainability</h3>
          <p className="text-xs text-gray-500 w-full text-left mb-6">Overall system code & layout health</p>
          
          <div className="relative w-48 h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="75%" outerRadius="100%" barSize={16} data={maintainabilityData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar minAngle={15} background={{ fill: '#F3F4F6' }} clockWise dataKey="value" cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-gray-800">85</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</span>
            </div>
          </div>
          
          <div className="mt-6 w-full grid grid-cols-2 gap-4">
             <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
               <div className="text-xs text-gray-500 font-semibold mb-1">DRC Warnings</div>
               <div className="text-lg font-bold text-gray-800 text-left">12</div>
             </div>
             <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
               <div className="text-xs text-gray-500 font-semibold mb-1">Density Var</div>
               <div className="text-lg font-bold text-green-600 text-left">Low</div>
             </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Pipeline Activity</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="current" stroke="#4F46E5" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="previous" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Latest Active Blocks</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase border-b border-gray-100">
                <tr>
                  <th className="pb-3 font-semibold">Block</th>
                  <th className="pb-3 font-semibold">Engineer</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBlocks.map((b, i) => {
                  const eng = getEngineerById(b.assignedTo);
                  const isCompleted = b.stage === 'COMPLETED';
                  const isReview = b.stage === 'REVIEW';
                  
                  return (
                    <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-mono text-xs">
                            {b.id.substring(0,3)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{b.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-gray-600 font-medium">
                        {eng ? eng.name : 'Unassigned'}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] uppercase font-bold
                          ${isCompleted ? 'bg-green-50 text-green-700' : 
                            isReview ? 'bg-yellow-50 text-yellow-700' : 
                            'bg-blue-50 text-blue-700'}`}>
                          {stageConfig[b.stage]?.label || b.stage}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============== ENGINEER DASHBOARD ============== */
function EngineerDashboard() {
  const { user } = useAuth();
  const { blocks } = useAppData();
  
  const mine = blocks.filter((b) => b.assignedTo === user.id);
  
  const kpis = {
    total: mine.length,
    inProgress: mine.filter((b) => b.stage === 'IN PROGRESS').length,
    hoursLogged: mine.reduce((s, b) => s + b.actualHours, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">My Workspace</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="My Blocks" value={kpis.total} subtext="Assigned to me" color="blue" />
        <KpiCard title="In Progress" value={kpis.inProgress} subtext="Actively working" color="indigo" />
        <KpiCard title="Hours Logged" value={`${kpis.hoursLogged}h`} subtext="Total effort" color="purple" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Current Assignments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mine.map((b) => (
            <div key={b.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h4 className="font-bold text-gray-800">{b.name}</h4>
                   <span className="text-xs font-mono text-gray-500">{b.id}</span>
                 </div>
                 <StageBadge stage={b.stage} />
               </div>
               <div className="flex justify-between text-sm text-gray-600 mt-4">
                 <span>Effort: {b.actualHours} / {b.estHours}h</span>
                 <span className="font-medium text-gray-800">{b.techNode}</span>
               </div>
            </div>
          ))}
          {mine.length === 0 && <div className="text-gray-500 py-8 text-center col-span-2">No blocks assigned yet.</div>}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, subtext, subValue, isPositive, color }) {
  const colorMap = {
    blue: 'border-b-blue-500',
    green: 'border-b-green-500',
    red: 'border-b-red-500',
    indigo: 'border-b-indigo-500',
    purple: 'border-b-purple-500',
  };

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-b-4 ${colorMap[color] || 'border-b-gray-200'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
      </div>
      <div className="flex items-end gap-3 mb-3">
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        {subValue && (
          <div className={`flex items-center text-sm font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '↑' : '↓'} {subValue}
          </div>
        )}
      </div>
      <div className="text-xs font-medium text-gray-400">{subtext}</div>
    </div>
  );
}
