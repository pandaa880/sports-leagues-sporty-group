import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn('scroll-m-20 text-4xl font-bold tracking-tight font-poppins', className)}>
      {children}
    </h1>
  );
}

export function P({ children, className }: TypographyProps) {
  return <p className={cn('leading-7 font-inter', className)}>{children}</p>;
}
