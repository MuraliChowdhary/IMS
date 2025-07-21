/*
File: src/pages/manager/ExpiryManagementDashboard.tsx
Description: A comprehensive dashboard to view, filter, and manage expiring products, powered by the enhanced backend API.
*/
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  IconClockExclamation,
  IconTag,
  IconChevronLeft,
  IconChevronRight,
  IconCurrencyRupee,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { toast } from 'sonner'; 
// --- TypeScript Interfaces matching the API Response ---
interface ExpiryProductData {
  inventoryId: string;
  productName: string;
  SKU: string;
  imageUrls: string[];
  category: string;
  quantity: number;
  price: number;
  totalValue: number;
  expirationDate: string; // ISO string
  daysRemaining: number;
  supplierName: string;
  suggestedAction: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalCount: number;
}

interface SummaryInfo {
  totalItems: number;
  totalValueAtRisk: number;
  displaying: number;
}

interface ExpiryApiResponse {
  summary: SummaryInfo;
  pagination: PaginationInfo;
  data: ExpiryProductData[];
}

// --- Helper Functions ---
const getUrgencyBadge = (daysRemaining: number | null) => {
    if (daysRemaining === null) return { text: 'N/A', className: 'bg-gray-100 text-gray-800' };
    if (daysRemaining <= 3) return { text: `${daysRemaining} days`, className: 'bg-red-100 text-red-800 border-red-200' };
    if (daysRemaining <= 7) return { text: `${daysRemaining} days`, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { text: `${daysRemaining} days`, className: 'bg-blue-100 text-blue-800 border-blue-200' };
};

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

// --- Main Component ---
export default function ExpiryManagementDashboard() {
  const [apiData, setApiData] = useState<ExpiryApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    days: 30,
    page: 1,
    category: '',
  });

  useEffect(() => {
    const fetchExpiringItems = async () => {
      setLoading(true);
      try {
        // --- REAL API CALL ---
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Authentication error. Please log in again.");
            setLoading(false);
            return;
        }

        const response = await axios.get<ExpiryApiResponse>('http://localhost:5000/api/manager/expiring', { 
          params: filters,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setApiData(response.data);

      } catch (error) {
        toast.error("Failed to fetch expiry report. Please ensure the backend server is running.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpiringItems();
  }, [filters]);

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };
  
  const handleDaysFilterChange = (newDays: number) => {
    setFilters(prev => ({...prev, page: 1, days: newDays}));
  };

  const { summary, pagination, data: items } = apiData || {};

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
      {/* --- Header --- */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expiry Management</h1>
        <p className="text-muted-foreground">Proactively manage items nearing expiration to minimize waste.</p>
      </div>

      {/* --- Summary Cards & Filters --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Items</CardTitle>
                <IconClockExclamation className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{summary?.totalItems ?? 0}</div>
                <p className="text-xs text-muted-foreground">Within {filters.days} days</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Value at Risk</CardTitle>
                <IconCurrencyRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(summary?.totalValueAtRisk ?? 0)}</div>
                <p className="text-xs text-muted-foreground">Total value of expiring stock</p>
            </CardContent>
        </Card>
        <div className="lg:col-span-2 flex items-center justify-start lg:justify-end gap-2 flex-wrap">
            <Button variant={filters.days === 7 ? 'default' : 'outline'} onClick={() => handleDaysFilterChange(7)}>7 Days</Button>
            <Button variant={filters.days === 14 ? 'default' : 'outline'} onClick={() => handleDaysFilterChange(14)}>14 Days</Button>
            <Button variant={filters.days === 30 ? 'default' : 'outline'} onClick={() => handleDaysFilterChange(30)}>30 Days</Button>
        </div>
      </div>

      {/* --- Expiry Table --- */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[350px]">Product</TableHead>
              <TableHead>Expires In</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">Suggested Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="h-48 text-center">Loading expiry report...</TableCell></TableRow>
            ) : !items || items.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-48 text-center">No products expiring within {filters.days} days.</TableCell></TableRow>
            ) : (
              items.map((item) => {
                const urgency = getUrgencyBadge(item.daysRemaining);
                return (
                    <TableRow key={item.inventoryId}>
                        <TableCell>
                            <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 rounded-md"><AvatarImage src={item.imageUrls[0]} alt={item.productName} className="object-cover" /><AvatarFallback>{item.productName.substring(0, 2)}</AvatarFallback></Avatar>
                            <div>
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-muted-foreground">SKU: {item.SKU}</p>
                            </div>
                            </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className={urgency.className}>{urgency.text}</Badge></TableCell>
                        <TableCell className="font-medium">{item.quantity} units</TableCell>
                        <TableCell>{formatCurrency(item.totalValue)}</TableCell>
                        <TableCell className="text-right">
                            <Button size="sm" variant="outline"><IconTag className="mr-2 h-4 w-4" />{item.suggestedAction}</Button>
                        </TableCell>
                    </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Pagination --- */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
            <span className="text-sm text-muted-foreground">Page {pagination.currentPage} of {pagination.totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1}><IconChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages}><IconChevronRight className="h-4 w-4" /></Button>
        </div>
      )}
    </div>
  );
}
