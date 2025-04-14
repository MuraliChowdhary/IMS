import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useCart } from "./CardContext";

interface DiscountInformation {
  discountValue: number;
  discountType: "percentage" | "fixed";
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
  description: string;
  stock: number;
  SKU: string;
  quantity: number;
  quantityStatus: string;
  discountInformation?: DiscountInformation;
}

export const ProductsCard = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchItem() {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/customer/products/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
    fetchItem();
  }, [id]);

  const finalPrice = useMemo(() => {
    if (!product) return 0;
    const { price, discountInformation } = product;
    if (!discountInformation) return price;

    return discountInformation.discountType === "percentage"
      ? price - (discountInformation.discountValue / 100) * price
      : price - discountInformation.discountValue;
  }, [product]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setIsAddedToCart(true);
  };

  const handleGoToCart = () => navigate("/cart");

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="text-center mt-10 text-gray-500">
          Loading product details...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col lg:flex-row justify-center items-start gap-10 px-6 py-10">
        
        
        <div className="flex-shrink-0">
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            width={400}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>

       
        <div className="flex flex-col gap-6 max-w-xl">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <h3 className="text-lg text-gray-700">{product.description}</h3>

          <div>
            <div className="mb-2 text-lg font-semibold">Product Information:</div>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                <span className="font-medium text-black">Description:</span>{" "}
                {product.description}
              </li>
              <li>
                <span className="font-medium text-black">SKU:</span> {product.SKU}
              </li>
             
              {product.quantityStatus === "Low" && (
                <li className="text-red-600 font-semibold">Out of Stock</li>
              )}
            </ul>
          </div>

        <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-4 text-xl font-semibold">
              <span className="text-green-700">Now: ${finalPrice.toFixed(2)}</span>
              {product.discountInformation && (
                <span className="line-through text-gray-500">${product.price}</span>
              )}
            </div>

           
            {isAddedToCart && product.quantityStatus !== "Low" ? (
              <button
                onClick={handleGoToCart}
                className="border p-2 rounded bg-green-500 text-white hover:bg-green-600 transition duration-200 w-full"
              >
                Go to Cart
              </button>
            ) : product.quantityStatus !== "Low" ? (
              <button
                onClick={() => handleAddToCart(product)}
                className="border p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition duration-200 w-full"
              >
                Add to Cart
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
