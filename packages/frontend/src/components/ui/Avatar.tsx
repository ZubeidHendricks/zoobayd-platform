import * as React from "react"

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({
  name,
  src,
  size = 'md',
  className = ""
}: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`
          rounded-full object-cover
          ${sizes[size]}
          ${className}
        `}
      />
    );
  }

  return (
    <div
      className={`
        rounded-full bg-gray-500 text-white
        flex items-center justify-center
        ${sizes[size]}
        ${className}
      `}
    >
      {getInitials(name)}
    </div>
  );
}