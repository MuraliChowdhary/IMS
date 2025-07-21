/*
File: src/pages/manager/LowStockAlertsPage.tsx
Description: A detailed page to view and manage products with low stock levels, connected to a live API.
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
    IconAlertTriangle,
    IconTruck,
    IconSearch,
    IconPlus,
    IconChevronLeft,
    IconChevronRight,
} from "@tabler/icons-react";
import { Input } from "@/Components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { toast } from 'sonner';

// --- TypeScript Interfaces matching the new API response ---
interface LowStockItem {
    id: string;
    quantity: number;
    reorderLevel: number;
    totalStock: number;
    product: {
        id: string;
        name: string;
        SKU: string | null;
        imageUrls: string[];
    };
    supplier: {
        id: string;
        name: string;
    } | null;
}

interface ApiResponse {
    summary: {
        total: number;
        critical: number;
    };
    pagination: {
        currentPage: number;
        totalPages: number;
    };
    data: LowStockItem[];
}

// --- Helper to determine urgency/status ---
const getUrgencyInfo = (stock: number, reorderLevel: number) => {
    if (reorderLevel === 0) return { text: 'N/A', className: 'bg-gray-100 text-gray-800' };
    const percentage = stock / reorderLevel;
    if (percentage <= 0.5) {
        return { text: 'Critical', className: 'bg-red-100 text-red-800 border-red-200' };
    }
    if (percentage <= 1) {
        return { text: 'Low', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    }
    return { text: 'Ok', className: 'bg-green-100 text-green-800 border-green-200' };
};

// --- Main Component ---
export default function LowStockAlertsPage() {
    const [apiData, setApiData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchLowStockItems = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get<ApiResponse>(
                    `https://ims-clxd.onrender.com/api/manager/low-stock-report`,
                    {
                        params: {
                            search: searchTerm,
                            page: currentPage,
                            limit: 10,
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setApiData(response.data);
            } catch (error) {
                toast.error("Failed to fetch low stock items.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const debounceFetch = setTimeout(() => {
            fetchLowStockItems();
        }, 300); // Debounce search to avoid excessive API calls

        return () => clearTimeout(debounceFetch);
    }, [searchTerm, currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= (apiData?.pagination.totalPages || 1)) {
            setCurrentPage(newPage);
        }
    };

    const { summary, pagination, data: items } = apiData || {};

    return (
        <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
            {/* --- Header --- */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Low Stock Alerts</h1>
                    <p className="text-muted-foreground">
                        Products that require immediate attention and reordering.
                    </p>
                </div>
                <Button>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Create Bulk Order
                </Button>
            </div>

            {/* --- Summary Cards --- */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Low Stock Items</CardTitle>
                        <IconAlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary?.total ?? 0}</div>
                        <p className="text-xs text-muted-foreground">Items at or below their reorder level.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critically Low Items</CardTitle>
                        <IconAlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{summary?.critical ?? 0}</div>
                        <p className="text-xs text-muted-foreground">Stock is at 50% or less of reorder level.</p>
                    </CardContent>
                </Card>
            </div>

            {/* --- Search --- */}
            <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by product name or SKU..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* --- Low Stock Table --- */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[350px]">Product</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Stock Level</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="h-48 text-center">Loading alerts...</TableCell></TableRow>
                        ) : !items || items.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="h-48 text-center">No low stock items found. Great job!</TableCell></TableRow>
                        ) : (
                            items.map((item) => {
                                const urgency = getUrgencyInfo(item.totalStock, item.reorderLevel);
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 rounded-md">
                                                    <AvatarImage src={item.product.imageUrls[0]} alt={item.product.name} className="object-cover" />
                                                    <AvatarFallback className="rounded-md">{item.product.name.substring(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{item.product.name}</p>
                                                    <p className="text-sm text-muted-foreground">SKU: {item.product.SKU || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.supplier?.name || 'N/A'}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{item.totalStock} <span className="text-muted-foreground">/ {item.reorderLevel}</span></div>
                                            <p className="text-xs text-muted-foreground">units</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={urgency.className}>{urgency.text}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm">
                                                <IconTruck className="mr-2 h-4 w-4" />
                                                Reorder
                                            </Button>
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
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><IconChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pagination.totalPages}><IconChevronRight className="h-4 w-4" /></Button>
                </div>
            )}
        </div>
    );
}
