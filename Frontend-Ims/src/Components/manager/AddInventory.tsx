import { useState } from "react";
import { BACKEND_URL } from "../../../Config";
import axios from "axios";
import { Sidebar } from "./Sidebar";

const AddInventory = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    productId: "",
    quantity: "",
    threshold: "",
    price: "",
    expirationDate: "",
    reorderLevel: "",
    reorderQuantity: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert expirationDate to ISO-8601 format
    const formattedDate = new Date(form.expirationDate).toISOString();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/manager/addinventory`,
        {
          productId: form.productId,
          quantity: parseInt(form.quantity),
          threshold: parseInt(form.threshold),
          price: parseFloat(form.price),
          expirationDate: formattedDate, // ✅ Fixed format
          reorderLevel: parseInt(form.reorderLevel),
          reorderQuantity: parseInt(form.reorderQuantity),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        console.log(response.data);
        setSuccess(response.data.message);
      } else {
        console.log(response.data);
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error adding inventory:", error);
      setError("Failed to add inventory.");
    }
  };
  // const formattedExpirationDate = new Date(req.body.expirationDate).toISOString();

  return (
    <div className="flex">
      <Sidebar />
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow mt-10">
        <h2 className="text-xl font-bold mb-4">Add Inventory</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              value={form[key as keyof typeof form]}
              onChange={handleChange}
              placeholder={key}
              className="w-full p-2 border rounded"
            />
          ))}
          <button
            onClick={handleSubmit}
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Inventory
          </button>
        </form>
        {error && (
          <div className="text-red-500 text-sm mt-4 text-center">{error}</div>
        )}
        {success && (
          <div className="text-green-500 text-lg mt-4 text-center ">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddInventory;
