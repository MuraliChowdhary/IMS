/*
File: src/pages/manager/PendingSupplierOrdersPage.tsx
Description: A clean UI to display pending orders from suppliers, fetched from a live backend API.
*/
"use client";

import  { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { IconTruck, IconMail, IconPhone, IconMapPin, IconHash, IconCircleCheck, IconCircleX } from "@tabler/icons-react";

// --- TypeScript Interfaces matching your API response ---
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

interface ApiResponse {
    pendingOrders: Order[];
}

// --- Helper Functions ---
const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
        'REORDER_REQUESTED': 'bg-blue-100 text-blue-800',
        'PENDING': 'bg-yellow-100 text-yellow-800',
        'PRICE_PROPOSED': 'bg-purple-100 text-purple-800',
    };
    return (
        <Badge variant="outline" className={`border-none ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.replace(/_/g, ' ')}
        </Badge>
    );
};

// --- Main Component ---
export default function PendingSupplierOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Authentication token not found. Please log in.");
            setLoading(false);
            return;
        }

        const response = await axios.get<ApiResponse>(
          "http://localhost:5000/api/manager/pendingStoreOrdersBySupplier",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data.pendingOrders);
      } catch (error) {
        toast.error("Failed to load pending orders. Please check the server.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Pending Supplier Orders</h1>
        <p className="text-muted-foreground">Review and manage outstanding orders placed with suppliers.</p>
      </div>

      {loading && (
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <IconTruck className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">All Caught Up!</h3>
            <p className="text-muted-foreground">There are no pending orders from suppliers.</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {!loading && orders.map((order) => (
          <Card key={order.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <IconHash className="h-5 w-5 text-muted-foreground" />
                    <span className="truncate">Order #{order.id}</span>
                </div>
                {getStatusBadge(order.status)}
              </CardTitle>
              <CardDescription>
                Placed on: {format(new Date(order.createdAt), 'PPP')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-t border-b py-4 mb-4">
                <h4 className="font-semibold text-sm mb-2">Supplier Details</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                    <p className="flex items-center gap-2 font-medium text-primary">{order.supplier.name}</p>
                    <p className="flex items-center gap-2"><IconMail className="h-4 w-4"/> {order.supplier.email}</p>
                    <p className="flex items-center gap-2"><IconPhone className="h-4 w-4"/> {order.supplier.contact}</p>
                    <p className="flex items-center gap-2"><IconMapPin className="h-4 w-4"/> {order.supplier.location}</p>
                </div>
              </div>
              
              <h4 className="font-semibold text-sm mb-2">Products Requested</h4>
              <ScrollArea className="h-32 pr-4">
                <ul className="space-y-2">
                  {order.products.map((product) => (
                    <li key={product.id} className="bg-muted p-3 rounded-lg text-sm flex justify-between items-center">
                      <div>
                        <p className="font-medium">Product ID: {product.productId}</p>
                        <p className="text-muted-foreground">Qty: {product.quantity} • Proposed: {formatCurrency(product.proposedPrice)}</p>
                      </div>
                      <Badge variant="secondary">{product.negotiationStatus}</Badge>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
              <p className="text-sm mt-4 text-muted-foreground">Notes: {order.orderNotes}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-muted/50 px-6 py-4">
                <p className="font-bold text-lg">Total: {formatCurrency(order.totalAmount)}</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm"><IconCircleX className="h-4 w-4 mr-2"/> Reject</Button>
                    <Button size="sm"><IconCircleCheck className="h-4 w-4 mr-2"/> Approve</Button>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
