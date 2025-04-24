"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import { Separator } from "../ui/separator";

// type LowStockItem = {
//   inventoryId: string;
//   productId: string;
//   productName: string;
//   quantity: number;
//   threshold: number;
//   supplierName: string;
// };

type ReorderResponse = {
  success: boolean;
  message: string;
  details: any[];
};

type LowStockItem = {
  id: string;
  name: string;
  currentQuantity: number;
  threshold: number;
  reorderLevel: number;
  needsReorder: boolean;
  lastUpdated: string;
};

export const LowStockReorder = () => {
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [reordering, setReordering] = useState(false);
  const [response, setResponse] = useState<ReorderResponse | null>(null);
  const [orderQuntity, setReOrderQuantity] = useState(0);
  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await axios.get(
          "https://ims-clxd.onrender.com//api/manager/lowstock",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const items: LowStockItem[] = res.data.data.items;
        setLowStockItems(items || []);
        setReOrderQuantity(res.data.data.summary.needingReorder);
      } catch (error) {
        toast.error("Error fetching low stock items", {
          description: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  const handleReorder = async () => {
    setReordering(true);
    try {
      const res = await axios.post(
        "https://ims-clxd.onrender.com//api/manager/reorder",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setResponse(res.data);
      toast.success("Reorder Successful", {
        description: res.data.message,
      });
    } catch (error) {
      toast.error("Reorder Failed", {
        description: "Something went wrong while reordering.",
      });
    } finally {
      setReordering(false);
    }
  };

  return (
    <ScrollArea className="h-[85vh] p-6">
      <h2 className="text-2xl font-bold mb-4">Low Stock Inventory</h2>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!loading && lowStockItems.length === 0 && (
        <p className="text-muted-foreground">
          All inventory levels are healthy.
        </p>
      )}

      {!loading && lowStockItems.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 gap-10">
            {lowStockItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {item.name}
                    <Badge variant="destructive">Low</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Inventory ID: {item.id}
                  </p>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>Current Quantity: {item.currentQuantity}</p>
                  <p>Threshold: {item.threshold}</p>
                  <p>Reorder Level: {orderQuntity}</p>
                  <p className="text-xs text-muted-foreground">
                    Last Updated: 3 days ago
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <Separator />
            <Button
              onClick={handleReorder}
              disabled={reordering || lowStockItems.length === 0}
              className="mt-4 w-full"
            >
              {reordering ? "Processing Reorder..." : "Reorder All"}
            </Button>
          </div>
        </>
      )}

      {response && (
        <div className="mt-8 space-y-6">
          <h3 className="text-xl font-semibold">Reorder Summary</h3>
          <p className="text-muted-foreground">{response.message}</p>

          {response.details.map((detail, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base">
                  Inventory ID: {detail.inventoryId}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>Product ID: {detail.productId}</p>
                <p>Quantity Reordered: {detail.quantity}</p>
                <p>Status: {detail.status.message}</p>
                <Badge variant="secondary">
                  {detail.status.priorityStatus}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};
