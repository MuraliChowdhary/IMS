"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";

type Product = {
  id: string;
  productId: string;
  quantity: number;
  proposedPrice: number;
  negotiationStatus: string;
};

type Supplier = {
  name: string;
  email: string;
  contact: string;
  location: string;
};

type Order = {
  id: string;
  totalAmount: number;
  createdAt: string;
  orderNotes: string;
  status: string;
  products: Product[];
  supplier: Supplier;
};

export const PendingOrderSupplier = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://ims-clxd.onrender.com//api/manager/pendingStoreOrdersBySupplier",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrders(response.data.pendingOrders);
      } catch (error) {
        setError("Failed to load pending orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <ScrollArea className="h-[80vh] p-4">
      <h2 className="text-2xl font-bold mb-4">Supplier Pending Orders</h2>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && orders.length === 0 && (
        <p className="text-muted-foreground">No pending orders found.</p>
      )}

      {orders.map((order) => (
        <Card key={order.id} className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Order ID: {order.id}</span>
              <Badge variant="secondary">{order.status}</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Created on: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm mt-1 text-gray-500">
              Notes: {order.orderNotes}
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <p className="font-semibold text-sm">Supplier:</p>
              <p>
                {order.supplier.name} ({order.supplier.email})
              </p>
              <p>
                {order.supplier.contact} | {order.supplier.location}
              </p>
            </div>

            <div className="mt-2">
              <p className="font-semibold text-sm mb-1">Products:</p>
              <ul className="space-y-2">
                {order.products.map((product) => (
                  <li
                    key={product.id}
                    className="bg-muted p-2 rounded-lg text-sm flex justify-between"
                  >
                    <span>Product ID: {product.productId}</span>
                    <span>
                      Qty: {product.quantity} | ₹
                      {product.proposedPrice.toFixed(2)} |{" "}
                      <Badge>{product.negotiationStatus}</Badge>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4 font-bold">Total Amount: ₹{order.totalAmount}</p>
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
};
