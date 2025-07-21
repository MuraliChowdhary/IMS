/*
File: src/pages/manager/InventoryPage.tsx
Description: A modern UI for managing product inventory using a shadcn/ui table.
*/
import * as React from "react";
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
  IconUpload,
  IconAdjustmentsHorizontal,
  IconPencil,
  IconTrash,
  IconSearch,
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

// --- Mock Data for Inventory ---
const inventoryData = [
  {
    sku: "SALT-73301",
    name: "Tata Salt 1kg",
    category: "Groceries",
    stock: 245,
    minStock: 50,
    price: 28.0,
    status: "In Stock",
    avatar: "/avatars/tata-salt.png",
  },
  {
    sku: "AMUL-45211",
    name: "Amul Milk 1L",
    category: "Dairy",
    stock: 45,
    minStock: 50,
    price: 58.0,
    status: "Low Stock",
    avatar: "/avatars/amul-milk.png",
  },
  {
    sku: "COLG-88923",
    name: "Colgate Toothpaste 200g",
    category: "Personal Care",
    stock: 112,
    minStock: 20,
    price: 95.0,
    status: "In Stock",
    avatar: "/avatars/colgate.png",
  },
  {
    sku: "BRIT-12345",
    name: "Britannia Family Pack",
    category: "Snacks",
    stock: 0,
    minStock: 30,
    price: 120.0,
    status: "Out of Stock",
    avatar: "/avatars/britannia.png",
  },
  {
    sku: "RICE-67890",
    name: "Tata Rice 5kg",
    category: "Groceries",
    stock: 80,
    minStock: 25,
    price: 450.0,
    status: "In Stock",
    avatar: "/avatars/tata-rice.png",
  },
];

// --- Helper to determine badge color based on status ---
const getStatusBadgeClasses = (status: string): string => {
  switch (status) {
    case "In Stock":
      return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
    case "Low Stock":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100";
    case "Out of Stock":
      return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100";
  }
};


export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredData = inventoryData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            View, manage, and track your product stock.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <IconUpload className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <IconPlus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* --- Filter and Search Section --- */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <IconAdjustmentsHorizontal className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* --- Inventory Table --- */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[350px]">Product</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.sku}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={item.avatar} alt={item.name} />
                      <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-mono">{item.stock} units</p>
                  <p className="text-xs text-muted-foreground">Min: {item.minStock}</p>
                </TableCell>
                <TableCell className="font-mono">₹{item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeClasses(item.status)}>{item.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <span className="sr-only">Actions</span>
                        ...
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <IconPencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <IconTrash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
