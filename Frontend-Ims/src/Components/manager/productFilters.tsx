import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Loader2 } from "lucide-react";
// import { Loader2 } from 'lucide-react';
// import { SidebarProvider, SidebarTrigger } from "../ui/sidebar"
// import AppSidebar from './app-sidebar';
const ProductFilters = () => {
  const [search, setSearch] = useState("Oneplus");
  const [category, setCategory] = useState("Mobile");
  const [stockLevel, setStockLevel] = useState("low");
  const [supplier, setSupplier] = useState("cm77dfehf0002v1osfa2ne9j6");
  const [isPerishable, setIsPerishable] = useState("false");
  const [sortBy, setSortBy] = useState("price:desc");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://ims-clxd.onrender.com/api/manager/productFilters",
        {
          search,
          category,
          stockLevel,
          supplier,
          isPerishable,
          sortBy,
          page,
          limit: 10,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts(response.data.products);
      setPage(response.data.page);
    } catch (err: any) {
      setError("Failed to fetch products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <main className="flex-1 p-6">
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Filter</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Search</Label>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div>
                <Label>Category</Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div>
                <Label>Stock Level</Label>
                <Select value={stockLevel} onValueChange={setStockLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stock level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Supplier ID</Label>
                <Input
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                />
              </div>

              <div>
                <Label>Is Perishable</Label>
                <Select value={isPerishable} onValueChange={setIsPerishable}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price:desc">Price Desc</SelectItem>
                    <SelectItem value="price:asc">Price Asc</SelectItem>
                    <SelectItem value="name:asc">Name Asc</SelectItem>
                    <SelectItem value="name:desc">Name Desc</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="md:col-span-3" onClick={fetchProducts}>
                Apply Filters
              </Button>
            </CardContent>
          </Card>

          {/* Product Results */}
          {loading ? (
            <div className="flex justify-center mt-10">
              <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            </div>
          ) : error ? (
            <div className="text-red-600 text-center">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <Card key={product.id}>
                  <CardHeader>
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <CardTitle className="mt-4">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {product.description}
                    </p>
                    <div className="text-lg font-semibold">
                      ₹{product.price}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        Stock: {product.stock}
                      </Badge>
                      <Badge
                        className="text-xs"
                        style={{ backgroundColor: product.statusColor }}
                      >
                        {product.stockStatus.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Supplier: {product.supplier?.name}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductFilters;
