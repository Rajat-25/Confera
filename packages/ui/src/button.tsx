'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({
  children,
  className = '',
  type = 'button',
  onClick,
}: ButtonProps) => {
  return (
    <button type={type} className={`${className}`} onClick={onClick}>
      {children}
    </button>
  );
};
