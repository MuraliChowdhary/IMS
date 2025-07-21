// src/Components/manager/TopPerformers.tsx
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";

const performers = [
  { name: "Tata Salt 1kg", units: "82 units sold", revenue: "₹3,780", tag: "High", tagColor: "bg-green-100 text-green-800", initials: "TS" },
  { name: "Amul Milk 1L", units: "65 units sold", revenue: "₹3,140", tag: "High", tagColor: "bg-green-100 text-green-800", initials: "AM" },
  { name: "Tata Rice 5kg", units: "21 units sold", revenue: "₹9,650", tag: "Medium", tagColor: "bg-yellow-100 text-yellow-800", initials: "TR" },
];

export function TopPerformers() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Highest revenue generating products this week.</CardDescription>
        </div>
        <Button variant="link" onClick={()=>{window.location.href = "/manager/top-performers"}}>View All</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Demand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {performers.map((item) => (
              <TableRow key={item.name}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                       <AvatarFallback>{item.initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                       <p className="font-medium">{item.name}</p>
                       <p className="text-xs text-muted-foreground">{item.units}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{item.revenue}</TableCell>
                <TableCell className="text-right">
                  <Badge className={`${item.tagColor} hover:${item.tagColor}`}>{item.tag}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}