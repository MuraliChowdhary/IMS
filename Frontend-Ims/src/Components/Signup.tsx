import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignin = () => {
    navigate("/signin");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();


    if (!name || !mobile || !email || !password) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }

    setError("");

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username: name,
          email,
          password,
          contact: mobile,
        }
      );

      if (response.status === 201) {

        setSuccess(response.data.message || "Registration successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const user = response.data.user;
        toast.success("Successfully registered!");
        navigate("/" + `${user.role.toLowerCase()}` + "Dashboard");
      } else {

        setError(response.data.message || "An unexpected error occurred.");
      }
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Something went wrong. Please try again.";
      setError(errorMessage);
      setSuccess("");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="bg-slate-50 w-96 h-3/4 rounded-xl p-9 shadow-2xl flex flex-col justify-evenly items-center">
          <div className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900 mb-1">
            Sign Up
          </div>
          <form onSubmit={handleSubmit} className="w-full">

            <div className="w-full mb-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="Name"
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>

            <div className="w-full mb-2">
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="mobile"
                placeholder="Mobile"
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setMobile(e.target.value)}
                value={mobile}
                required
              />
            </div>

            <div className="w-full mb-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <div className="w-full mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>

            <div className="w-full flex justify-center mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white px-10 py-2 rounded font-sans transition-colors duration-200 ${loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-sky-600 cursor-pointer"
                  }`}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </div>
          </form>

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
            <div className="text-red-500 text-sm mt-4 text-center">
              {error}
            </div>
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