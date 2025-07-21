/*
File: src/pages/manager/ProductCatalogPage.tsx
Description: Displays all products from the inventory in a detailed, filterable table.
*/
import { useEffect, useState } from 'react';
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
  IconPlus,
  IconAdjustmentsHorizontal,
  IconPencil,
  IconTrash,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconDotsVertical,
} from "@tabler/icons-react";
import { Input } from "@/Components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { toast } from 'sonner';

// --- TypeScript Interfaces based on your API response ---
interface Supplier {
  id: string;
  name: string;
}

interface InventoryItem {
  id: string;
  quantity: number;
  threshold: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  SKU: string | null;
  imageUrls: string[];
  supplier: Supplier;
  supplierId: string;
  inventories: InventoryItem[];
  stockStatus: 'high' | 'low' | 'unknown';
  statusColor: 'green' | 'red' | 'gray';
  description: string;
  isPerishable: boolean;
  seasonality: string | null;
  shelfLife: number | null;
}

interface ApiResponse {
  products: Product[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}

// --- Mock Data (simulating your API response) ---
const mockApiResponse: ApiResponse = {
  "products": [
    { "id": "cm9vr2f1l0004v150e740qpmo", "name": "Fresh Pears", "price": 50.99, "supplierId": "cm77dfehf0002v1osfa2ne9j6", "stock": 150, "category": "Fruits", "description": "Juicy, sweet and ripe pears packed with nutrients and perfect for snacking or desserts.", "SKU": "PEAR-001-FR", "isPerishable": true, "seasonality": "Autumn", "shelfLife": 30, "imageUrls": ["https://res.cloudinary.com/dwvo1c5xo/image/upload/v1745522334/pears_txww2o.jpg"], "supplier": { "id": "cm77dfehf0002v1osfa2ne9j6", "name": "Fresh Produce Inc." }, "inventories": [], "stockStatus": "high", "statusColor": "green" },
    { "id": "cm7bnge5y0001v1lcqa5pzjj4", "name": "Oneplus 12", "price": 39000, "supplierId": "cm77dfehf0002v1osfa2ne9j6", "stock": 10, "category": "Mobile", "description": "A high-quality mobile.", "SKU": "OP-12-BLK", "isPerishable": false, "seasonality": "Winter", "shelfLife": 365, "imageUrls": ["https://res.cloudinary.com/dwvo1c5xo/image/upload/v1739952902/onrplus_a9kbdz.jpg"], "supplier": { "id": "cm77dfehf0002v1osfa2ne9j6", "name": "Global Electronics" }, "inventories": [{ "id": "cm7byes410003v1d4axtveexc", "quantity": 10, "threshold": 5 }], "stockStatus": "low", "statusColor": "red" },
    { "id": "cm9vq3g5s0001v150zbpb47m4", "name": "Basmati Rice 5kg", "price": 49.5, "supplierId": "cm77dfehf0002v1osfa2ne9j6", "stock": 200, "category": "Grocery", "description": "High-quality staple rice suitable for daily cooking needs.", "SKU": "RICE-5KG-001", "isPerishable": false, "seasonality": "All Season", "shelfLife": 365, "imageUrls": ["https://res.cloudinary.com/dwvo1c5xo/image/upload/v1745520721/rice_klhokn.jpg"], "supplier": { "id": "cm77dfehf0002v1osfa2ne9j6", "name": "National Foods" }, "inventories": [{ "id": "cm9vr47n30005v150m0x60mro", "quantity": 200, "threshold": 30 }], "stockStatus": "high", "statusColor": "green" },
    { "id": "cm77ecvk30001v1kk091pourr", "name": "Smart TV 55-inch", "price": 199.99, "supplierId": "cm77dfehf0002v1osfa2ne9j6", "stock": 27, "category": "Electronics", "description": "A high-quality electronic gadget", "SKU": "TV-55-4K", "isPerishable": false, "seasonality": null, "shelfLife": null, "imageUrls": ["https://res.cloudinary.com/dwvo1c5xo/image/upload/v1739691524/samsungtv_r5gnjd.webp"], "supplier": { "id": "cm77dfehf0002v1osfa2ne9j6", "name": "Samsung Electronics" }, "inventories": [{ "id": "cm7byd6n50002v1d4g97if0h6", "quantity": 27, "threshold": 10 }], "stockStatus": "low", "statusColor": "red" },
    { "id": "cm9vo3aqd0003v1sgtp94386s", "name": "Tata Iodized Salt", "price": 18, "supplierId": "cm77dfehf0002v1osfa2ne9j6", "stock": 98, "category": "Grocery", "description": "Tata Salt 1kg - Vacuum evaporated iodised salt", "SKU": "TATA-SALT-1KG", "isPerishable": false, "seasonality": "All Season", "shelfLife": 12, "imageUrls": ["https://res.cloudinary.com/dwvo1c5xo/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1745516498/tatasalt_khcjkr.jpg"], "supplier": { "id": "cm77dfehf0002v1osfa2ne9j6", "name": "Tata Consumer Goods" }, "inventories": [{ "id": "cm9vo7sg50006v1sgf212gk69", "quantity": 98, "threshold": 20 }], "stockStatus": "high", "statusColor": "green" }
  ],
  "pagination": { "total": 5, "pages": 1, "currentPage": 1, "limit": 10 }
};

// --- Helper to get badge color ---
const getStatusBadgeClasses = (color: 'green' | 'red' | 'gray'): string => {
    const classMap = {
        green: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
        red: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
        gray: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
    };
    return classMap[color] || classMap.gray;
};

// --- Main Component ---
export default function ProductCatalogPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async (page = 1, search = "") => {
      setLoading(true);
      try {
        // --- REAL API CALL (commented out, using mock data for now) ---
        // const response = await axios.get(`/api/products?page=${page}&limit=10&search=${search}`);
        // setData(response.data);

        // --- SIMULATING API CALL WITH MOCK DATA ---
        setTimeout(() => {
            const filteredProducts = mockApiResponse.products.filter(p => 
                p.name.toLowerCase().includes(search.toLowerCase())
            );
            setData({
                products: filteredProducts,
                pagination: { ...mockApiResponse.pagination, total: filteredProducts.length }
            });
            setLoading(false);
        }, 500); // Simulate network delay

      } catch (error) {
        toast.error("Failed to fetch products.");
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => {
        fetchProducts(currentPage, searchTerm);
    }, 300); // Debounce search input

    return () => clearTimeout(debounceFetch);
  }, [searchTerm, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.pagination.pages || 1)) {
        setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Product Catalog</h1>
          <p className="text-muted-foreground">
            Browse and manage all products in your inventory.
          </p>
        </div>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      {/* --- Filters --- */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name or SKU..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <IconAdjustmentsHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* --- Products Table --- */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center">Loading products...</TableCell></TableRow>
            ) : data?.products.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="h-24 text-center">No products found.</TableCell></TableRow>
            ) : (
              data?.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 rounded-md">
                        <AvatarImage src={product.imageUrls[0]} alt={product.name} className="object-cover" />
                        <AvatarFallback className="rounded-md">{product.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {product.SKU || 'N/A'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>₹{product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock} units</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeClasses(product.statusColor)}>
                        {product.stockStatus.charAt(0).toUpperCase() + product.stockStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <IconDotsVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem><IconPencil className="mr-2 h-4 w-4" /> Edit Product</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500"><IconTrash className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Pagination --- */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-sm text-muted-foreground">
            Page {data?.pagination.currentPage} of {data?.pagination.pages}
        </span>
        <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
        >
            <IconChevronLeft className="h-4 w-4" />
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === data?.pagination.pages}
        >
            <IconChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
