// src/Components/manager/RecentActivity.tsx
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { IconPlus, IconTransfer, IconTruck } from "@tabler/icons-react";

const activities = [
    { action: "Stock Added", item: "Tata Salt 1kg", time: "2m ago", icon: IconPlus },
    { action: "Stock Transferred", item: "From Warehouse A", time: "1h ago", icon: IconTransfer },
    { action: "Supplier Order", item: "Placed for Amul", time: "3h ago", icon: IconTruck },
    { action: "Stock Added", item: "Colgate 200g", time: "5h ago", icon: IconPlus },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
            <div key={activity.item + activity.time} className="flex items-center gap-4">
                <Avatar className="h-9 w-9 bg-slate-100">
                    <AvatarFallback>
                        <activity.icon className="h-5 w-5 text-slate-600"/>
                    </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.item}</p>
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
        ))}
      </CardContent>
    </Card>
  );
}