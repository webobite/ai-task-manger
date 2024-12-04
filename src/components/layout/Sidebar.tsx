import React from 'react';
import { LayoutDashboard, CheckSquare, BarChart2, Settings } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Tasks', icon: CheckSquare },
  { name: 'Analytics', icon: BarChart2 },
  { name: 'Settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => (
          <button
            key={item.name}
            className="flex items-center gap-2 w-full p-2 text-gray-600 hover:bg-gray-50 rounded-md"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}