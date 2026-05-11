import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Layers, Kanban, Clock, Users, CheckCircle, ScrollText,
  ChevronsLeft, ChevronsRight, LogOut, Cpu, 
  Briefcase, Calendar, MessageSquare, Box, Cloud, Bell, HelpCircle, Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Avatar, RoleBadge } from '../UI/Badge';

// Matching the icon list loosely to the ones in the image, but preserving routes
const items = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/blocks', label: 'Blocks', Icon: Briefcase },
  { to: '/kanban', label: 'Kanban', Icon: CheckCircle },
  { to: '/effort', label: 'Effort', Icon: MessageSquare },
  { to: '/resources', label: 'Resources', Icon: Users },
  { to: '/approvals', label: 'Approvals', Icon: Box },
  { to: '/audit', label: 'Audit Log', Icon: Cloud },
];

export function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const { blocks } = useAppData();
  const pendingCount = blocks.filter((b) => b.stage === 'REVIEW').length;
  const width = collapsed ? 80 : 260;

  return (
    <aside
      className="h-screen sticky top-0 flex flex-col bg-white border-r border-gray-100 transition-[width] duration-300 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.1)] z-50"
      style={{ width }}
    >
      {/* Logo / User Profile Section */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4 overflow-hidden">
          {user?.picture ? (
            <img src={user.picture} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            user ? user.initials.charAt(0) : 'C'
          )}
        </div>
        {!collapsed && (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="text-sm text-gray-500">Welcome,</div>
            <div className="text-lg font-bold text-gray-900 uppercase tracking-wide">{user ? user.name : 'CRAFTUI'}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="px-6 py-2">
        {!collapsed && <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Main Menu</div>}
        <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-thin">
          {items.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                [
                  'group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative',
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                  collapsed ? 'justify-center' : ''
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -left-6 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-blue-600" />
                  )}
                  <Icon size={20} className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"} strokeWidth={isActive ? 2.5 : 2} />
                  {!collapsed && <span className="truncate">{label}</span>}
                  
                  {label === 'Approvals' && pendingCount > 0 && !collapsed && (
                     <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs font-bold">{pendingCount}</span>
                  )}
                  {label === 'Approvals' && pendingCount > 0 && collapsed && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex-1"></div>

      {/* Upcoming Events Section (Mock data to match design) */}
      {!collapsed && (
        <div className="px-6 pb-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Upcoming events</div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                05:48AM
              </div>
              <div className="text-sm font-semibold text-gray-800">Meeting with a client</div>
              <div className="text-xs text-gray-400">Tell how to boost website traffic</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-yellow-500">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                10:28AM
              </div>
              <div className="text-sm font-semibold text-gray-800">New project discussion</div>
              <div className="text-xs text-gray-400">Business Cards Does Your Business</div>
            </div>
          </div>
        </div>
      )}

      {/* User / Logout */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-1 flex justify-center"
          >
            {collapsed ? <ChevronsRight size={18} /> : <><ChevronsLeft size={18} className="mr-2"/> Collapse</>}
          </button>
          {!collapsed && (
            <button onClick={logout} title="Sign out" className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
