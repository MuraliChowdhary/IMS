import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { Switch } from "../ui/switch"; // Import the Switch component

interface Supplier {
  name: string;
  contact: string;
  email: string;
}

interface ExpiringProduct {
  id: string;
  name: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  expirationDate: string;
  daysRemaining: number;
  price: number;
  supplier: Supplier;
  suggestedAction: string;
}

const ExpiryDiscountDashboard: React.FC = () => {
  const [products, setProducts] = useState<ExpiringProduct[]>([]);
  const [discounts, setDiscounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [applyDiscountToggle, setApplyDiscountToggle] = useState<
    Record<string, boolean>
  >({});

  const fetchExpiringProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/manager/expiring",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setProducts(response.data.expiringProducts);
      // Initialize toggle states for each product
      const initialToggleStates = response.data.expiringProducts.reduce(
        (acc: Record<string, boolean>, product: ExpiringProduct) => {
          acc[product.id] = false;
          return acc;
        },
        {}
      );
      setApplyDiscountToggle(initialToggleStates);
    } catch {
      toast.error("Failed to fetch expiring products");
    }
  };

  const handleToggleChange = (productId: string) => {
    setApplyDiscountToggle((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const applyDiscount = async (inventoryId: string): Promise<void> => {
    if (!applyDiscountToggle[inventoryId]) {
      toast.warning("Please enable the toggle to apply discount");
      return; // Explicitly return here to ensure no value is returned in this case
    }

    const discountPercentage = discounts[inventoryId];
    if (!discountPercentage) {
      toast.warning("Enter a discount % first");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/manager/discount",
        {
          inventoryId,
          discountPercentage,
          expiryAction: "Apply discount and promote Rice combo",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      console.log("Success:", response.data.discountedPrice);
      toast.success(`Discount applied: ₹${response.data.discountedPrice}`);

      // Refresh the product list after successful discount application
      fetchExpiringProducts();
    } catch (error) {
      console.error("Error applying discount:", "error");
      toast.error("Failed to apply discount.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpiringProducts();
  }, []);

  return (
    <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No expiring products found.</p>
      ) : (
        products.map((product) => (
          <Card key={product.id} className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
              <p className="text-sm text-muted-foreground">
                Category: {product.category}
              </p>
              <p className="text-sm">Price: ₹{product.price}</p>
              <p className="text-sm">Quantity: {product.quantity}</p>
              <p className="text-sm">
                Expires in: {product.daysRemaining} days
              </p>
              <p className="text-sm text-yellow-600 font-medium mt-1">
                {product.suggestedAction}
              </p>

              <div className="flex items-center space-x-2 mt-3">
                <Switch
                  id={`toggle-${product.id}`}
                  checked={applyDiscountToggle[product.id]}
                  onCheckedChange={() => handleToggleChange(product.id)}
                />
                <Label htmlFor={`toggle-${product.id}`}>
                  {applyDiscountToggle[product.id]
                    ? "Discount Enabled"
                    : "Discount Disabled"}
                </Label>
              </div>

              {applyDiscountToggle[product.id] && (
                <>
                  <div className="mt-3">
                    <Label htmlFor={`discount-${product.id}`}>Discount %</Label>
                    <Input
                      id={`discount-${product.id}`}
                      type="number"
                      placeholder="e.g. 10"
                      min="1"
                      max="100"
                      value={discounts[product.id] || ""}
                      onChange={(e) =>
                        setDiscounts({
                          ...discounts,
                          [product.id]: Number(e.target.value),
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={() => applyDiscount(product.id)}
                    disabled={loading}
                    className="mt-3 w-full"
                  >
                    {loading ? "Applying..." : "Apply Discount"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ExpiryDiscountDashboard;
