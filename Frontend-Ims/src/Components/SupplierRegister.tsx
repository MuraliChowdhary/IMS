import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SupplierRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignin = () => {
    navigate("/supplier/login");
  };

  const handleSubmit = async () => {
    try {
      //username,contact, email,location,password,role
      const response = await axios.post(
        "http://localhost:5000/api/auth/supplier/register",
        {
          username: name,
          email,
          password,
          contact: mobile,
          location: location,
          role: "MANUFACTURER",
        }
      );

      if (response.status !== 201) {
        setError(response.data.message);
      } else {
        setSuccess(response.data.message);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        //const user = response.data.user;
        navigate("/supplier");
      }
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Something went wrong. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-br from-green-100/80 to-cyan-100/90  w-full h-screen flex items-center justify-center">
        <div className="bg-slate-50 w-96 h-3/4 rounded-xl  p-9 shadow-2xl  flex flex-col justify-evenly items-center">
          <div className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900 mb-1">
            Supplier Sign Up
          </div>
          <div className="w-full">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded mb-1"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Mobile
            </label>
            <input
              type="text"
              id="mobile"
              placeholder="Mobile"
              className="w-full p-2 border border-gray-300 rounded mb-1"
              onChange={(e) => setMobile(e.target.value)}
              value={mobile}
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded mb-1"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="w-full mt-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded mb-1"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="w-full mt-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Location
            </label>
            <input
              type="location"
              id="location"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded mb-1"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            />
          </div>
          <div className="w-full mt-4 flex justify-center">
            <button
              onClick={handleSubmit}
              className=" sm:bg-red-400 md:bg-blue-600 text-white px-10 py-2 rounded hover:bg-blue-800 font-sans lg:bg-green-400"
            >
              Submit
            </button>
          </div>
          <div className="mt-4 text-sm">
            Already a member?{" "}
            <a
              onClick={handleSignin}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Sign in
            </a>
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-4 text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-500 text-sm mt-4 text-center">
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
