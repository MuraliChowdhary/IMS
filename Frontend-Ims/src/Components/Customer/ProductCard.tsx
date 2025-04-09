import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useCart } from "./CardContext"; // Import Cart context

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
  discountInformation?: DiscountInformation; // Discount is optional now
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
          `https://ims-clxd.onrender.com/api/customer/products/${id}`,
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

    const { discountValue, discountType } = discountInformation;
    let calculatedPrice = price;

    if (discountType === "percentage") {
      calculatedPrice -= (discountValue / 100) * price;
    } else if (discountType === "fixed") {
      calculatedPrice -= discountValue;
    }

    return calculatedPrice;
  }, [product]);

  const handleAddToCart = (product: Product) => {
    if (product) {
      addToCart(product);
      setIsAddedToCart(true);
    }
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

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
      <div className="flex flex-row justify-center items-center px-10 mt-10">
        <div className="flex flex-col items-center">
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            width={400}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="text-center mx-10 flex-grow">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <h3 className="text-lg mt-4 font-semibold">{product.description}</h3>

          <div className="flex flex-col mt-10">
            <div className="mb-4 text-lg font-semibold">About:</div>
            <ul className="list-disc list-inside text-lg text-gray-500">
              <li>
                <span className="text-lg font-semibold text-black">
                  Description:
                </span>{" "}
                {product.description}
              </li>
              <li>
                <span className="text-lg font-semibold text-black">
                  Category:
                </span>{" "}
                {product.description}
              </li>
              <li>
                <span className="text-lg font-semibold text-black">Stock:</span>{" "}
                {product.stock} available
              </li>
              <li>
                <span className="text-lg font-semibold text-black">SKU:</span>{" "}
                {product.SKU}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <div className="flex items-center mb-4">
            <div className="text-green-700 font-semibold text-xl mr-4">
              Now ${finalPrice.toFixed(2)}
            </div>
            <div className="line-through text-gray-500">${product.price}</div>
          </div>

          {isAddedToCart ? (
            <button
              onClick={handleGoToCart}
              className="border p-2 rounded bg-green-500 text-white hover:bg-green-600 transition duration-200 w-full"
            >
              Go to Cart
            </button>
          ) : (
            <button
              onClick={() => handleAddToCart(product)}
              className="border p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition duration-200 w-full"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
