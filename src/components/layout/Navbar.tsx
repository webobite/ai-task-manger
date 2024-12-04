import React from 'react';
import { BrainCircuit, Bell } from 'lucide-react';

export function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">AI Task Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}