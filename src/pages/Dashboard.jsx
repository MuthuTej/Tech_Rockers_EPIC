import React, { useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid,
  RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { stageConfig, getEngineerById, nextStage } from '../data/mockData';
import { StageBadge, Avatar } from '../components/UI/Badge';
import { Modal } from '../components/UI/Modal';
import { useToast } from '../components/UI/Toast';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  if (user?.role === 'manager') return <ManagerDashboard />;
  return <EngineerDashboard />;
}

/* ============== MANAGER DASHBOARD ============== */
function ManagerDashboard() {
  const { blocks, auditLog, engineers, assignBlock } = useAppData();
  const { user } = useAuth();
  const toast = useToast();

  const [assignFor, setAssignFor] = useState(null);
  const [pickedEng, setPickedEng] = useState('');

  const engs = engineers.filter((e) => e.role === 'engineer');
  const unassigned = blocks.filter((b) => !b.assignedTo || b.assignedTo === '');

  const kpis = useMemo(() => ({
    total: blocks.length,
    completed: blocks.filter((b) => b.stage === 'COMPLETED').length,
    totalEst: blocks.reduce((s, b) => s + b.estHours, 0),
  }), [blocks]);

  const pendingApprovals = blocks.filter(b => b.stage === 'REVIEW');

  const engStats = useMemo(() => engs.map((e) => {
    const mine = blocks.filter((b) => b.assignedTo === e.id || b.assignedTo === e.email);
    const committed = mine.reduce((s, b) => s + b.estHours, 0);
    const pct = e.maxHours ? Math.round((committed / e.maxHours) * 100) : 0;
    return { engineer: e, count: mine.length, committed, pct };
  }), [blocks, engs]);

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
  const maintainabilityData = [{ name: 'Score', value: 85, fill: '#10B981' }];
  const recentBlocks = blocks.slice(0, 5);

  const openAssign = (b) => { setPickedEng(''); setAssignFor(b); };
  const submitAssign = () => {
    if (!pickedEng) { toast.warning('Pick an engineer', ''); return; }
    const eng = getEngineerById(pickedEng);
    assignBlock(assignFor.id, pickedEng, user);
    toast.success('Assigned', `${assignFor.name} → ${eng ? eng.name : pickedEng}`);
    setAssignFor(null);
  };

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

      {/* Unassigned Blocks */}
      {unassigned.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              Unassigned Blocks
              <span className="bg-red-100 text-red-600 py-0.5 px-2.5 rounded-full text-xs font-bold">{unassigned.length}</span>
            </h3>
            <Link to="/resources" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">View Resources →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {unassigned.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{b.name}</div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">{b.id} · {b.techNode} · {b.estHours}h</div>
                </div>
                <button
                  onClick={() => openAssign(b)}
                  className="ml-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Assign
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engineer Workload */}
      {engStats.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Engineer Workload</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {engStats.map(({ engineer, count, committed, pct }) => {
              const barColor = pct > 90 ? '#EF4444' : pct > 70 ? '#F59E0B' : '#10B981';
              return (
                <div key={engineer.id} className="p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar initials={engineer.initials} size={32} />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-gray-800 truncate">{engineer.name}</div>
                      <div className="text-[10px] text-gray-400">{count} blocks</div>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: Math.min(100, pct) + '%', background: barColor }} />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-gray-500">
                    <span>{committed}h committed</span>
                    <span style={{ color: barColor }}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Approvals & Maintainability Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        <div className="text-xs text-gray-500 font-medium">By {eng ? eng.name : 'Unknown'} · {b.techNode}</div>
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

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <h3 className="text-lg font-bold text-gray-800 w-full text-left mb-2">Maintainability</h3>
          <p className="text-xs text-gray-500 w-full text-left mb-6">Overall system code &amp; layout health</p>
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
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
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
                {recentBlocks.map((b) => {
                  const eng = getEngineerById(b.assignedTo);
                  const isCompleted = b.stage === 'COMPLETED';
                  const isReview = b.stage === 'REVIEW';
                  return (
                    <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-mono text-xs">
                            {b.id.substring(0, 3)}
                          </div>
                          <div className="font-semibold text-gray-800">{b.name}</div>
                        </div>
                      </td>
                      <td className="py-3 text-gray-600 font-medium">{eng ? eng.name : 'Unassigned'}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] uppercase font-bold
                          ${isCompleted ? 'bg-green-50 text-green-700' : isReview ? 'bg-yellow-50 text-yellow-700' : 'bg-blue-50 text-blue-700'}`}>
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

      {/* Assign Engineer Modal */}
      <Modal
        open={!!assignFor}
        onClose={() => setAssignFor(null)}
        title="Assign Engineer"
        footer={
          <>
            <button className="liq-btn liq-btn-ghost" onClick={() => setAssignFor(null)}>Cancel</button>
            <button className="liq-btn liq-btn-primary" onClick={submitAssign}>Confirm</button>
          </>
        }
      >
        {assignFor && (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-700">{assignFor.name}</div>
              <div className="text-xs text-gray-400 font-mono">{assignFor.id} · {assignFor.techNode} · {assignFor.estHours}h</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Select Engineer</label>
              {engs.length === 0 ? (
                <div className="text-sm text-red-500 p-3 bg-red-50 rounded-lg">
                  No engineers found. Make sure the database is seeded and engineers have logged in.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {engs.map((e) => {
                    const engBlocks = blocks.filter((b) => b.assignedTo === e.id || b.assignedTo === e.email);
                    const committed = engBlocks.reduce((s, b) => s + b.estHours, 0);
                    const pct = e.maxHours ? Math.round((committed / e.maxHours) * 100) : 0;
                    const barColor = pct > 90 ? '#EF4444' : pct > 70 ? '#F59E0B' : '#10B981';
                    return (
                      <label
                        key={e.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${pickedEng === e.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}
                      >
                        <input
                          type="radio"
                          name="engineer"
                          value={e.id}
                          checked={pickedEng === e.id}
                          onChange={() => setPickedEng(e.id)}
                          className="accent-blue-600"
                        />
                        <Avatar initials={e.initials} size={32} />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-800">{e.name}</div>
                          <div className="h-1 rounded-full bg-gray-200 mt-1 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: Math.min(100, pct) + '%', background: barColor }} />
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{committed}h / {e.maxHours}h · {engBlocks.length} blocks</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ============== ENGINEER DASHBOARD ============== */
function EngineerDashboard() {
  const { user } = useAuth();
  const { blocks, advanceStage } = useAppData();
  const toast = useToast();

  const [confirm, setConfirm] = useState(null);

  const mine = blocks.filter((b) => b.assignedTo === user.id);

  const kpis = {
    total: mine.length,
    inProgress: mine.filter((b) => b.stage === 'IN PROGRESS').length,
    hoursLogged: mine.reduce((s, b) => s + b.actualHours, 0),
  };

  const handleAdvance = (b) => {
    const target = nextStage(b.stage);
    if (target) setConfirm({ block: b, target });
  };

  const doAdvance = () => {
    advanceStage(confirm.block.id, user);
    toast.success('Stage Advanced', `${confirm.block.name} → ${confirm.target}`);
    setConfirm(null);
  };

  const activeBlocks = mine.filter((b) => !['COMPLETED', 'REJECTED'].includes(b.stage));
  const doneBlocks = mine.filter((b) => ['COMPLETED', 'REJECTED'].includes(b.stage));

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

      {/* Active Blocks */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Active Assignments</h3>
        {activeBlocks.length === 0 ? (
          <div className="text-gray-400 py-8 text-center">No active blocks assigned to you.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBlocks.map((b) => {
              const canAdvance = !['REVIEW', 'COMPLETED', 'REJECTED'].includes(b.stage);
              const isLVS = b.stage === 'LVS';
              const target = nextStage(b.stage);
              const stageColor = stageConfig[b.stage]?.color || '#6B7280';

              return (
                <div key={b.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow" style={{ borderLeft: `3px solid ${stageColor}` }}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-800">{b.name}</h4>
                      <span className="text-xs font-mono text-gray-400">{b.id}</span>
                    </div>
                    <StageBadge stage={b.stage} />
                  </div>

                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>{b.techNode} · {b.complexity}</span>
                    <span>{b.actualHours} / {b.estHours}h</span>
                  </div>

                  {canAdvance && (
                    <button
                      onClick={() => handleAdvance(b)}
                      className={`w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        isLVS
                          ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                          : 'border border-blue-500 text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {isLVS ? 'Submit for Review' : `Advance to ${stageConfig[target]?.label || target}`}
                      <ArrowRight size={14} />
                    </button>
                  )}
                  {b.stage === 'REVIEW' && (
                    <div className="text-center text-xs text-yellow-600 font-semibold py-2 bg-yellow-50 rounded-lg">
                      Awaiting manager approval
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed / Rejected */}
      {doneBlocks.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Completed &amp; Rejected</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doneBlocks.map((b) => (
              <div key={b.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{b.name}</div>
                  <div className="text-xs font-mono text-gray-400 mt-0.5">{b.id} · {b.techNode}</div>
                  {b.stage === 'REJECTED' && b.rejectionComment && (
                    <div className="mt-1 text-xs text-red-500 italic">"{b.rejectionComment}"</div>
                  )}
                </div>
                <StageBadge stage={b.stage} />
              </div>
            ))}
          </div>
        </div>
      )}

      {mine.length === 0 && (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-400">
          No blocks assigned to you yet. Your manager will assign work soon.
        </div>
      )}

      {/* Advance Stage Confirm Modal */}
      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="Advance Block Stage"
        footer={
          <>
            <button className="liq-btn liq-btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
            <button className="liq-btn liq-btn-primary" onClick={doAdvance}>Confirm</button>
          </>
        }
      >
        {confirm && (
          <div>
            <div className="text-sm">
              <span className="font-mono text-blue-600">{confirm.block.id}</span> — {confirm.block.name}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <StageBadge stage={confirm.block.stage} size="lg" />
              <ArrowRight size={16} className="text-gray-400" />
              <StageBadge stage={confirm.target} size="lg" />
            </div>
            {confirm.target === 'REVIEW' && (
              <div className="mt-4 text-xs rounded-md p-3 bg-yellow-50 text-yellow-700">
                This will notify the manager for approval.
              </div>
            )}
          </div>
        )}
      </Modal>
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
