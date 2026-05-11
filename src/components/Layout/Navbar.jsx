import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Avatar, RoleBadge } from '../UI/Badge';
import { TAPEOUT_DATE } from '../../data/mockData';
import { Rocket } from 'lucide-react';

const titles = {
  '/dashboard': 'Dashboard',
  '/blocks': 'Blocks',
  '/kanban': 'Kanban Board',
  '/effort': 'Effort Estimation',
  '/resources': 'Resource Assignment',
  '/approvals': 'Approvals',
  '/audit': 'Audit Log',
};

export function Navbar() {
  const { user } = useAuth();
  const { blocks } = useAppData();
  const loc = useLocation();
  const title = titles[loc.pathname] || 'LayoutIQ';

  const daysLeft = useMemo(() => {
    const ms = TAPEOUT_DATE.getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / 86400000));
  }, []);
  const danger = daysLeft < 14;

  const completedPct = useMemo(() => {
    if (!blocks.length) return 0;
    const done = blocks.filter((b) => b.stage === 'COMPLETED').length;
    return Math.round((done / blocks.length) * 100);
  }, [blocks]);

  return (
    <header className="sticky top-0 z-40 h-20 bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center px-8 gap-6 shadow-sm">
      <div className="flex items-center gap-3">
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">{title}</h1>
      </div>

      <div className="flex-1"></div>

      {/* Tapeout Countdown */}
      <div className="hidden md:flex justify-center mr-6">
        <div
          className="flex items-center gap-3 rounded-full px-5 py-2 shadow-sm"
          style={{
            background: danger ? '#FEF2F2' : '#F0FDF4',
            border: `1px solid ${danger ? '#FCA5A5' : '#86EFAC'}`,
          }}
        >
          <CountdownRing pct={completedPct} color={danger ? '#EF4444' : '#3b82f6'} />
          <Rocket size={16} style={{ color: danger ? '#EF4444' : '#3b82f6' }} />
          <span className="text-sm font-semibold" style={{ color: danger ? '#991B1B' : '#166534' }}>
            Tapeout in {daysLeft} day{daysLeft === 1 ? '' : 's'}
          </span>
          <span className="text-xs text-gray-500 font-medium">· {completedPct}% complete</span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        </button>
      </div>
    </header>
  );
}

function CountdownRing({ pct, color }) {
  const r = 10;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width="26" height="26" viewBox="0 0 26 26">
      <circle cx="13" cy="13" r={r} stroke="rgba(0,0,0,0.12)" strokeWidth="2.5" fill="none" />
      <circle
        cx="13" cy="13" r={r}
        stroke={color} strokeWidth="2.5" fill="none"
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 13 13)"
      />
    </svg>
  );
}
