import { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">
          {title}
        </h1>
        {description && (
          <p className="hidden sm:block text-sm lg:text-base text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
