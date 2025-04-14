import { Card, CardContent, CardHeader } from "../ui/card";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

// Define types
interface Product {
  name: string;
  current?: number;
  days_left?: number;
  recommended_order?: number;
  revenue?: number;
  profit?: number;
  average_daily_sales?: number;
  current_stock?: number;
}

interface ReportData {
  report_generated: string;
  summary: {
    total_products: number;
    low_stock_items: number;
    out_of_stock_items: number;
    total_inventory_value: number;
  };
  reorder_recommendations: Product[];
  top_performing_products: Product[];
  high_demand_items: Product[];
}

const AnalyticsDashboard = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: [
            {
              name: "Milk",
              current_stock: 8,
              sales_history: [10, 12, 9, 8, 7, 6, 5],
              price: 3.5,
              cost: 2.0,
            },
            {
              name: "Bread",
              current_stock: 12,
              sales_history: [15, 14, 13, 12, 11, 10, 9],
              price: 3.0,
              cost: 1.5,
            },
            {
              name: "Eggs",
              current_stock: 30,
              sales_history: [20, 25, 22, 18, 15, 17, 19],
              price: 0.5,
              cost: 0.3,
            },
            {
              name: "Rice",
              current_stock: 5,
              sales_history: [7, 9, 6, 5, 4, 3, 2],
              price: 1.2,
              cost: 0.6,
            },
            {
              name: "Chicken",
              current_stock: 2,
              sales_history: [5, 4, 6, 7, 8, 6, 5],
              price: 6.0,
              cost: 3.5,
            },
            {
              name: "Butter",
              current_stock: 15,
              sales_history: [3, 4, 3, 4, 5, 6, 3],
              price: 4.5,
              cost: 2.8,
            },
            {
              name: "Cheese",
              current_stock: 0,
              sales_history: [6, 5, 6, 7, 6, 5, 4],
              price: 5.0,
              cost: 3.0,
            },
            {
              name: "Yogurt",
              current_stock: 9,
              sales_history: [10, 11, 9, 8, 7, 6, 5],
              price: 2.0,
              cost: 1.0,
            },
            {
              name: "Apples",
              current_stock: 25,
              sales_history: [12, 14, 13, 11, 10, 12, 13],
              price: 1.5,
              cost: 0.7,
            },
            {
              name: "Toilet Paper",
              current_stock: 20,
              sales_history: [2, 2, 3, 3, 4, 2, 3],
              price: 0.8,
              cost: 0.4,
            },
          ],
        }),
      });

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Inventory Analytics Dashboard</h1>
        <Button onClick={handleGenerateReport} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              Generating...
            </span>
          ) : (
            "Generate Analytics"
          )}
        </Button>
      </div>

      {!data ? (
        <p className="text-gray-500">Click "Generate Analytics" to view insights.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Summary */}
          <Card className="col-span-1">
            <CardHeader className="font-bold text-lg mb-2">Summary</CardHeader>
            <CardContent className="space-y-2">
              <p>Total Products: {data.summary.total_products}</p>
              <p>Low Stock Items: {data.summary.low_stock_items}</p>
              <p>Out of Stock Items: {data.summary.out_of_stock_items}</p>
              <p>Total Inventory Value: ${data.summary.total_inventory_value.toFixed(2)}</p>
            </CardContent>
          </Card>

          {/* Reorder Recommendations */}
          <Card className="col-span-1">
            <CardHeader className="font-bold text-lg mb-2">Reorder Recommendations</CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc pl-5">
                {data.reorder_recommendations.map((item, index) => (
                  <li key={index} className="mb-1">
                    <span className="font-medium">{item.name}:</span>{" "}
                    Current: {item.current}, Recommended: {item.recommended_order}{" "}
                    (Days Left: {item.days_left})
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Top Performing Products */}
          <Card className="col-span-1">
            <CardHeader className="font-bold text-lg mb-2">Top Performing Products</CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc pl-5">
                {data.top_performing_products.map((product, index) => (
                  <li key={index} className="mb-1">
                    <span className="font-medium">{product.name}:</span>{" "}
                    Revenue: ${product.revenue?.toFixed(2)}, Profit: ${product.profit?.toFixed(2)}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* High Demand Items */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-1">
            <CardHeader className="font-bold text-lg mb-2">High Demand Items</CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc pl-5">
                {data.high_demand_items.map((item, index) => (
                  <li key={index} className="mb-1">
                    <span className="font-medium">{item.name}:</span>{" "}
                    Avg Sales: {item.average_daily_sales?.toFixed(2)}/day, Stock: {item.current_stock}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
