// src/Components/manager/StatCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { type Icon as TablerIcon } from "@tabler/icons-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: TablerIcon;
  valueClassName?: string;
}

export function StatCard({ title, value, description, icon: Icon, valueClassName }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueClassName}`}>{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}