import * as React from "react"

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  className = ""
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        ${checked ? 'bg-blue-600' : 'bg-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-colors duration-200 ease-in-out
        ${className}
      `}
      onClick={() => !disabled && onChange(!checked)}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow
          transition duration-200 ease-in-out
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
}