import * as React from "react"

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date | null;
  maxDate?: Date | null;
  className?: string;
}

export function DatePicker({ 
  selected, 
  onChange, 
  minDate, 
  maxDate, 
  className = "" 
}: DatePickerProps) {
  return (
    <input
      type="date"
      value={selected ? selected.toISOString().split('T')[0] : ''}
      onChange={(e) => {
        const value = e.target.value;
        onChange(value ? new Date(value) : null);
      }}
      min={minDate ? minDate.toISOString().split('T')[0] : undefined}
      max={maxDate ? maxDate.toISOString().split('T')[0] : undefined}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${className}`}
    />
  );
}