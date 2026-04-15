import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'purple' | 'green' | 'orange' | 'red' | 'gray' | 'yellow';
  size?: 'sm' | 'md';
}

export default function Badge({ children, variant = 'purple', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        {
          'bg-violet-100 text-violet-700': variant === 'purple',
          'bg-green-100 text-green-700': variant === 'green',
          'bg-orange-100 text-orange-700': variant === 'orange',
          'bg-red-100 text-red-700': variant === 'red',
          'bg-gray-100 text-gray-600': variant === 'gray',
          'bg-yellow-100 text-yellow-700': variant === 'yellow',
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
        }
      )}
    >
      {children}
    </span>
  );
}
