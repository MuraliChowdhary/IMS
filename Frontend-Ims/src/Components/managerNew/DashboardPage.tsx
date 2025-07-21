/*
File: src/pages/manager/DashboardPage.tsx
Description: The main dashboard page that now fetches live data and includes the Add Product dialog.
*/
import { useState, useEffect } from 'react';
import axios from 'axios';
import { StatCard } from "@/Components/managerNew/StatCard";
import { TopPerformers } from "@/Components/managerNew/TopPerformers";
import { RecentActivity } from "@/Components/managerNew/RecentActivity";
import { AddProductDialog } from "@/Components/managerNew/addProduct"; // Re-importing the dialog
import { Button } from '@/Components/ui/button'; // Importing Button
import {
    IconCurrencyRupee,
    IconShoppingCart,
    IconArchive,
    IconAlertTriangle,
    IconClockExclamation,
    IconPackage,
    IconFlame,
    IconPercentage,
    IconPlus,
} from "@tabler/icons-react";
import { Skeleton } from '@/Components/ui/skeleton';
import { toast } from 'sonner';

// --- Interface for our new API response ---
interface DashboardData {
    todaySales: {
        total: number;
        change: string;
    };
    transactions: number;
    inventoryValue: number;
    lowStockItems: number;
    expiringThisWeek: number;
    topSellerToday: {
        name: string;
        unitsSold: number;
    };
    activeAlerts: number;
    profitMargin: {
        value: number;
        change: number;
    };
}

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false); // State for the dialog

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('https://ims-clxd.onrender.com/api/manager/dashboard-overview', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (error) {
            toast.error("Failed to load dashboard data. Please try again.");
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // This function can be used to refresh data after a product is added
    const handleProductAdded = () => {
        console.log("Product added, refreshing dashboard data.");
        toast.info("Refreshing dashboard data...");
        fetchDashboardData(); // Refetch all dashboard stats
    };

    if (loading) {
        return <DashboardLoadingSkeleton />;
    }

    return (
        <>
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
                    <Button onClick={() => setIsAddProductOpen(true)}>
                        <IconPlus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-4 xl:grid-cols-4">
                        <StatCard
                            title="Today's Sales"
                            value={formatCurrency(data?.todaySales.total || 0)}
                            description={`${data?.todaySales.change || 0}% from yesterday`}
                            icon={IconCurrencyRupee}
                        />
                        <StatCard
                            title="Total Transactions"
                            value={String(data?.transactions || 0)}
                            description={`${data?.transactions || 0} bills generated today`}
                            icon={IconShoppingCart}
                        />
                        <StatCard
                            title="Inventory Value"
                            value={formatCurrency(data?.inventoryValue || 0)}
                            description="Total value of all stock"
                            icon={IconArchive}
                        />
                        <StatCard
                            title="Today's Profit Margin"
                            value={`${data?.profitMargin.value || 0}%`}
                            description={`A ${data?.profitMargin.change || 0}% improvement`}
                            icon={IconPercentage}
                            valueClassName="text-green-600"
                        />
                        <StatCard
                            title="Low Stock Items"
                            value={String(data?.lowStockItems || 0)}
                            description="Items below reorder level"
                            icon={IconPackage}
                            valueClassName="text-red-600"
                        />
                        <StatCard
                            title="Expiring This Week"
                            value={String(data?.expiringThisWeek || 0)}
                            description="Products needing attention"
                            icon={IconClockExclamation}
                            valueClassName="text-yellow-600"
                        />
                        <StatCard
                            title="Top Seller (Today)"
                            value={data?.topSellerToday.name || 'N/A'}
                            description={`${data?.topSellerToday.unitsSold || 0} units sold`}
                            icon={IconFlame}
                        />
                        <StatCard
                            title="Active Alerts"
                            value={String(data?.activeAlerts || 0)}
                            description="Total low stock & expiring"
                            icon={IconAlertTriangle}
                        />
                    </div>

                    <div className="lg:col-span-4 xl:col-span-3">
                        <TopPerformers />
                    </div>
                    <div className="lg:col-span-4 xl:col-span-1">
                        <RecentActivity />
                    </div>
                </div>
            </div>

            {/* --- Add Product Dialog --- */}
            <AddProductDialog
                isOpen={isAddProductOpen}
                onClose={() => setIsAddProductOpen(false)}
                onProductAdded={handleProductAdded}
            />
        </>
    );
}

// --- Loading Skeleton Component ---
const DashboardLoadingSkeleton = () => (
    <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-4 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
            </div>
            <div className="lg:col-span-4 xl:col-span-3">
                <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-4 xl:col-span-1">
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    </div>
);
