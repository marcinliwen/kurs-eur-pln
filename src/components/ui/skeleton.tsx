import React, { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`animate-pulse rounded-md bg-gray-300 ${className}`}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
