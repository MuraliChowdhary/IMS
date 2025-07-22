import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import {
  Activity,
  AlertCircle,
  ArrowUpDown,
  Box,
  Calendar,
  Clock,
  Coffee,
  DollarSign,
  Flame,
  LineChart,
  LucideIcon,
  Package,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

interface Recommendation {
  currentStock: number;
  daysOfSupplyRemaining: number;
  daysUntilExpiry: number;
  id: string;
  name: string;
  reason: string;
  recommendedOrderQuantity: number;
  reorderLevel: number;
  urgency: string;
}

interface DailySales {
  averageBasketSize: number;
  changeFromYesterday: number;
  items: number;
  total: number;
  transactions: number;
}

interface InventoryStats {
  expiringWithin7Days: number;
  lowStockItems: number;
  totalValue: number;
  turnoverRate: number;
}

interface SummaryData {
  dailySales: DailySales;
  date: string;
  inventory: InventoryStats;
  monthlySales: number;
  weeklySales: number;
}

interface TopProduct {
  category: string;
  dailyAvgSales: number;
  demand: string;
  estimatedProfitMargin: number;
  id: string;
  monthlyProfit: number;
  monthlyRevenue: number;
  monthlyUnitsSold: number;
  name: string;
  price: number;
}

interface HighDemandItem {
  category: string;
  currentStock: number;
  dailyAvgSales: number;
  daysRemaining: number;
  demandTrend: string;
  demandVsForecast: number;
  id: string;
  name: string;
  reorderSuggestion: number;
  turnoverRate: number;
}

interface CategoryAnalysis {
  averageMargin: number;
  category: string;
  contribution: number;
  productCount: number;
  totalProfit: number;
  totalRevenue: number;
}

interface ProfitProduct {
  category: string;
  contribution: number;
  costPrice: number;
  id: string;
  monthlyProfit: number;
  monthlyRevenue: number;
  name: string;
  price: number;
  profitMargin: number;
}

interface ProfitMarginData {
  categoryAnalysis: CategoryAnalysis[];
  lowMarginProducts: ProfitProduct[];
  overallMargin: number;
  topProfitProducts: ProfitProduct[];
  totalMonthlyProfit: number;
}

interface SeasonalInsight {
  category: string;
  currentStatus: string;
  id: string;
  monthsUntilNextPeak: number;
  name: string;
  nextPeakMonth: number;
  recommendedAction: string;
  seasonalPattern: string;
}

interface UpcomingPeakProduct {
  category: string;
  id: string;
  monthsAway: number;
  name: string;
  peakMonth: number;
  suggestedStockIncrease: string;
}

interface SeasonalAnalysis {
  analysisDate: string;
  currentMonth: number;
  currentPeakCategories: string[];
  seasonalInsights: SeasonalInsight[];
  upcomingPeakProducts: UpcomingPeakProduct[];
}

const MLDashboard: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [highDemandItems, setHighDemandItems] = useState<HighDemandItem[]>([]);
  const [profitMarginData, setProfitMarginData] = useState<ProfitMarginData | null>(null);
  const [seasonalAnalysis, setSeasonalAnalysis] = useState<SeasonalAnalysis | null>(null);
  const [loading, setLoading] = useState({
    recommendations: false,
    summary: false,
    topProducts: false,
    highDemand: false,
    profitMargin: false,
    seasonal: false,
  });

  const fetchData = async (endpoint: string, setData: any, loadingKey: string) => {
    try {
      setLoading(prev => ({ ...prev, [loadingKey]: true }));
      const response = await axios.get(`https://api-historicalsalesdata.onrender.com/api/ml/${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
        //  Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      setData(response.data);
    } catch (error) {
      toast.error(`Failed to fetch ${loadingKey.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  useEffect(() => {
    fetchData('reorder-recommendations', (data: any) => setRecommendations(data.recommendations), 'recommendations');
    fetchData('summary', setSummary, 'summary');
    fetchData('top-performing-products', (data: any) => setTopProducts(data.topProducts), 'topProducts');
    fetchData('high-demand-items', (data: any) => setHighDemandItems(data.highDemandItems), 'highDemand');
    fetchData('profit-margin-analysis', setProfitMarginData, 'profitMargin');
    fetchData('seasonal-analysis', setSeasonalAnalysis, 'seasonal');
  }, []);

  const getIconForCategory = (category: string): LucideIcon => {
    const icons: Record<string, LucideIcon> = {
      'Dairy': Coffee,
      'Cooking Essentials': Flame,
      'Personal Care': Users,
      'Snacks': Package,
      'Beverages': Coffee,
    };
    return icons[category] || Box;
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'HIGH':
        return <Badge variant="destructive" className="flex items-center gap-1"><Zap className="h-3 w-3" /> High</Badge>;
      case 'MEDIUM':
        return <Badge variant="default" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Medium</Badge>;
      default:
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Low</Badge>;
    }
  };

  const getDemandBadge = (demand: string) => {
    switch (demand) {
      case 'HIGH':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> High</Badge>;
      case 'MEDIUM':
        return <Badge variant="default" className="bg-yellow-600 hover:bg-yellow-700 flex items-center gap-1"><Activity className="h-3 w-3" /> Medium</Badge>;
      default:
        return <Badge variant="outline" className="flex items-center gap-1"><ArrowUpDown className="h-3 w-3" /> Low</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PEAK':
        return <Badge variant="destructive" className="flex items-center gap-1"><Flame className="h-3 w-3" /> Peak</Badge>;
      case 'NORMAL':
        return <Badge variant="default" className="flex items-center gap-1"><Activity className="h-3 w-3" /> Normal</Badge>;
      default:
        return <Badge variant="outline" className="flex items-center gap-1"><ArrowUpDown className="h-3 w-3" /> Low</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
      {/* Summary Cards */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Daily Summary - {summary?.date}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Daily Sales
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(summary?.dailySales.total || 0)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className={summary?.dailySales.changeFromYesterday && summary.dailySales.changeFromYesterday >= 0 ? 'text-green-500' : 'text-red-500'}>
                {summary?.dailySales.changeFromYesterday && summary.dailySales.changeFromYesterday >= 0 ? '+' : ''}
                {summary?.dailySales.changeFromYesterday?.toFixed(2)}%
              </span>
              <span>from yesterday</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingCart className="h-4 w-4" />
              Transactions
            </div>
            <div className="text-2xl font-bold">{summary?.dailySales.transactions}</div>
            <div className="text-sm">
              {summary?.dailySales.items} items sold
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Box className="h-4 w-4" />
              Inventory Value
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(summary?.inventory.totalValue || 0)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-600">{summary?.inventory.lowStockItems} low stock</span>
              <span>•</span>
              <span className="text-red-500">{summary?.inventory.expiringWithin7Days} expiring</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LineChart className="h-4 w-4" />
              Turnover Rate
            </div>
            <div className="text-2xl font-bold">
              {summary?.inventory.turnoverRate?.toFixed(2)}%
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span>Weekly: {formatCurrency(summary?.weeklySales || 0)}</span>
              <span>•</span>
              <span>Monthly: {formatCurrency(summary?.monthlySales || 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reorder Recommendations */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6" />
            Reorder Recommendations
          </CardTitle>
          <CardDescription>Items that need immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          {loading.recommendations ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reorder recommendations
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendations.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(item.currentStock / item.reorderLevel) * 100} 
                          className="h-2 w-16" 
                        />
                        <span>{item.currentStock}/{item.reorderLevel}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getUrgencyBadge(item.urgency)}
                        <span className="text-xs text-muted-foreground">
                          Order {item.recommendedOrderQuantity} units
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Top Performing Products */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-6 w-6" />
            Top Performers
          </CardTitle>
          <CardDescription>Highest revenue generating products</CardDescription>
        </CardHeader>
        <CardContent>
          {loading.topProducts ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : topProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No top performing products
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Demand</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.slice(0, 5).map((product) => {
                  const Icon = getIconForCategory(product.category);
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          {product.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatCurrency(product.monthlyRevenue)}</span>
                          <span className="text-xs text-muted-foreground">
                            {product.monthlyUnitsSold} units
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getDemandBadge(product.demand)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </CardFooter>
      </Card>

      {/* High Demand Items */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            High Demand Items
          </CardTitle>
          <CardDescription>Products with highest demand</CardDescription>
        </CardHeader>
        <CardContent>
          {loading.highDemand ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : highDemandItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No high demand items
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Daily Sales</TableHead>
                  <TableHead>Stock Days</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highDemandItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{item.dailyAvgSales.toFixed(1)}</span>
                        <span className={`text-xs ${item.demandVsForecast >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ({item.demandVsForecast >= 0 ? '+' : ''}{item.demandVsForecast.toFixed(1)}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(item.currentStock / (item.dailyAvgSales * item.daysRemaining)) * 100} 
                          className="h-2 w-16" 
                        />
                        <span>{item.daysRemaining.toFixed(1)}d</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Profit Margin Analysis */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Profit Margin Analysis
          </CardTitle>
          <CardDescription>
            Overall margin: {profitMarginData?.overallMargin.toFixed(1)}% • 
            Total profit: {profitMarginData ? formatCurrency(profitMarginData.totalMonthlyProfit) : '₹0'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading.profitMargin ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : !profitMarginData ? (
            <div className="text-center py-8 text-muted-foreground">
              No profit margin data
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">By Category</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Avg Margin</TableHead>
                      <TableHead>Contribution</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profitMarginData.categoryAnalysis.map((category) => (
                      <TableRow key={category.category}>
                        <TableCell className="font-medium">{category.category}</TableCell>
                        <TableCell>{category.averageMargin.toFixed(1)}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={category.contribution} className="h-2 w-16" />
                            <span>{category.contribution.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Top Profit Products</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Margin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profitMarginData.topProfitProducts.slice(0, 3).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{formatCurrency(product.monthlyProfit)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.profitMargin.toFixed(1)}%</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seasonal Analysis */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Seasonal Analysis
          </CardTitle>
          <CardDescription>
            Current peak categories: {seasonalAnalysis?.currentPeakCategories.join(', ')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading.seasonal ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : !seasonalAnalysis ? (
            <div className="text-center py-8 text-muted-foreground">
              No seasonal data
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Upcoming Peak Products</h3>
                <div className="space-y-2">
                  {seasonalAnalysis.upcomingPeakProducts.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Next peak in {product.monthsAway} month(s)
                        </p>
                      </div>
                      <Badge variant="outline">
                        +{product.suggestedStockIncrease}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Current Status</h3>
                <div className="space-y-2">
                  {seasonalAnalysis.seasonalInsights.slice(0, 3).map((insight) => (
                    <div key={insight.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{insight.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {insight.seasonalPattern}
                        </p>
                      </div>
                      {getStatusBadge(insight.currentStatus)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MLDashboard;