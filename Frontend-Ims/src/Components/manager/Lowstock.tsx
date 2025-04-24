import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import axios from "axios";
import { AlertTriangle } from "lucide-react";
import clsx from "clsx";

// ✅ Interfaces
interface LowStockItem {
  id: string;
  name: string;
  currentQuantity: number;
  threshold: number;
  reorderLevel: number;
  needsReorder: boolean;
  lastUpdated: string;
}

interface LowStockSummary {
  totalLowStock: number;
  needingReorder: number;
  criticalItems: number;
}

interface LowStockResponse {
  success: boolean;
  data: {
    items: LowStockItem[];
    summary: LowStockSummary;
  };
}

// ✅ Component
export default function LowStock() {
  const [summary, setSummary] = useState<LowStockSummary | null>(null);
  const [items, setItems] = useState<LowStockItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get<LowStockResponse>(
          "https://ims-clxd.onrender.com//api/manager/lowstock",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSummary(response.data.data.summary);
        setItems(response.data.data.items);
      } catch (error) {
        console.error("Failed to fetch low stock items:", error);
      }
    }
    fetchData();
  }, []);

  // Helper: priority color based on quantity
  const getPriorityColor = (item: LowStockItem) => {
    const percentage = item.currentQuantity / item.threshold;
    if (percentage <= 0.3) return "bg-red-500"; // critical
    if (percentage <= 0.7) return "bg-yellow-500"; // warning
    return "bg-green-500"; // okay-ish
  };

  return (
    <Card className="shadow-lg rounded-2xl border border-gray-200 bg-white">
      <CardHeader className="flex gap-3 items-start">
        <AlertTriangle className="text-red-600 w-6 h-6 mt-1" />
        <div>
          <CardTitle className="text-xl font-semibold">
            Low Stock Overview
          </CardTitle>
          <CardDescription className="text-gray-500">
            Products currently under threshold
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <p className="text-4xl font-bold text-red-600 text-center">
          {summary?.totalLowStock ?? 0}
        </p>
        <p className="text-center text-sm text-gray-500 mb-6">
          items need attention
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-4 p-4 rounded-lg border shadow-sm bg-gray-50"
            >
              <span
                className={clsx(
                  "w-3 h-3 rounded-full mt-1",
                  getPriorityColor(item)
                )}
              ></span>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Qty: <strong>{item.currentQuantity}</strong> / Threshold:{" "}
                  {item.threshold}
                </p>
                <p className="text-xs text-gray-400">
                  Reorder Level: {item.reorderLevel}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="justify-end text-xs text-gray-400">
        Last updated: just now
      </CardFooter>
    </Card>
  );
}
