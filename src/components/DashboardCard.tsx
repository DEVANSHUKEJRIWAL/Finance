import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
}

export function DashboardCard({ title, children }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}