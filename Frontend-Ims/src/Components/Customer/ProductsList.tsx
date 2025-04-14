import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("token", localStorage.getItem("token"));
        const response = await axios.get(
          "http://localhost:5000/api/customer/products",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        console.log("success");
        console.log(response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("Error fetching products:", error.message);
        } else {
          console.log("Error fetching products:", error);
        }
      }
    };
    fetchProducts();
  }, []);

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
    discountInformation?: DiscountInformation; // Discount is optional now
  }

  const calculateFinalPrice = (product: Product): number => {
    const { price, discountInformation } = product;

    // Check if discount information exists
    if (!discountInformation) {
      return price; // Return original price if no discount info
    }

    const { discountValue, discountType } = discountInformation;

    let finalPrice = price;

    if (discountType === "percentage") {
      finalPrice -= (discountValue / 100) * price;
    } else if (discountType === "fixed") {
      finalPrice -= discountValue;
    }

    return finalPrice;
  };

  const handleClick = (productId: string) => {
    console.log(productId);
    navigate(`/productCard/${productId}`);
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 cursor-pointer">
      {products.map((product: Product, index) => (
        <div key={index} className="flex flex-col">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 absolute top-11 left-44 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>

            <img
              onClick={() => handleClick(product.id)}
              src={product.imageUrls[0]}
              alt={product.name}
              width={170}
              height={150}
              className="m-3 mt-7"
            />
          </div>
          <div className="flex space-x-3">
            <div className="ml-10 text-green-700 font-semibold">
              Now ${calculateFinalPrice(product).toFixed(2)}
            </div>
            <div className="ml-10 text-gray-500 text-sm line-through">
              ${product.price}
            </div>
          </div>
          <div className="ml-10">{product.description}</div>
          <div>
            <button
              onClick={() => handleClick(product.id)}
              className="ml-10 rounded-full p-2 mt-2 border border-slate-950 text-md hover:bg-gray-200"
            >
              Options
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
