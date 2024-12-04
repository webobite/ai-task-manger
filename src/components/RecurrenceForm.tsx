import React from 'react';
import { RecurrencePattern } from '../types/task';

interface RecurrenceFormProps {
  value: RecurrencePattern;
  onChange: (pattern: RecurrencePattern) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export function RecurrenceForm({ value, onChange }: RecurrenceFormProps) {
  const handleTypeChange = (type: RecurrencePattern['type']) => {
    const newPattern: RecurrencePattern = { type };

    switch (type) {
      case 'daily':
        newPattern.interval = 1;
        break;
      case 'weekly':
        newPattern.daysOfWeek = [new Date().getDay()];
        break;
      case 'weekday':
        newPattern.daysOfWeek = [1, 2, 3, 4, 5];
        break;
      case 'weekend':
        newPattern.daysOfWeek = [0, 6];
        break;
      case 'custom':
        newPattern.daysOfWeek = [];
        newPattern.interval = 1;
        break;
    }

    onChange(newPattern);
  };

  const handleDayToggle = (day: number) => {
    const currentDays = value.daysOfWeek || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort();

    onChange({ ...value, daysOfWeek: newDays });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Repeat Pattern
        </label>
        <select
          value={value.type}
          onChange={(e) => handleTypeChange(e.target.value as RecurrencePattern['type'])}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="weekday">Weekdays Only</option>
          <option value="weekend">Weekends Only</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {value.type === 'daily' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Repeat every
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={value.interval || 1}
              onChange={(e) =>
                onChange({ ...value, interval: parseInt(e.target.value, 10) })
              }
              className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-gray-700">day(s)</span>
          </div>
        </div>
      )}

      {(value.type === 'weekly' || value.type === 'custom') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repeat on
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => handleDayToggle(day.value)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  value.daysOfWeek?.includes(day.value)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day.label.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}

      {value.type !== 'daily' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            value={value.time || '09:00'}
            onChange={(e) => onChange({ ...value, time: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      )}
    </div>
  );
}