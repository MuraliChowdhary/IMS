// src/Components/manager/QuickActions.tsx
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { IconPlus, IconFileImport, IconTransfer, IconFileAnalytics } from "@tabler/icons-react";

export function QuickActions() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Button variant="outline" className="w-full justify-start p-6 text-base">
          <IconPlus className="mr-2 h-5 w-5" /> Add Product
        </Button>
        <Button variant="outline" className="w-full justify-start p-6 text-base">
          <IconFileImport className="mr-2 h-5 w-5" /> Import CSV
        </Button>
        <Button variant="outline" className="w-full justify-start p-6 text-base">
          <IconTransfer className="mr-2 h-5 w-5" /> Transfer Stock
        </Button>
        <Button variant="outline" className="w-full justify-start p-6 text-base">
          <IconFileAnalytics className="mr-2 h-5 w-5" /> Generate Report
        </Button>
      </CardContent>
    </Card>
  );
}