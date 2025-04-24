import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SupplierLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const handleSignup = () => {
    navigate("/supplier/register");
  };
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://ims-clxd.onrender.com/api/auth/supplier/login",
        {
          email: email,
          password: password,
          role: "MANUFACTURER",
        }
      );
      if (response.status !== 201) {
        setError(response.data.message);
      } else {
        setSuccess(response.data.message);

        console.log(response.data);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        //const user = response.data.user
        navigate("/supplier");
      }
    } catch (err) {
      console.log(err);
      setError(
        (err as AxiosError<{ message: string }>).response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  }; ////bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500

  return (
    <div>
      <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/80 h-screen text-white flex justify-center items-center">
        <div className="bg-slate-50 w-96 h-auto  rounded-2xl   p-12 shadow-2xl  flex flex-col justify-evenly items-center">
          <div className=" text-center text-2xl/9 font-bold tracking-tight text-gray-900 mb-3">
            Supplier Sign in
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
              className="w-full p-2 border border-gray-300 rounded mb-3 text-gray-950"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full">
            <div className="flex justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 mb-1 "
              >
                Password
              </label>
              <button className="text-blue-700 hover:underline font-sans mb-1">
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded mb-3 text-gray-950"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-full flex justify-center ">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-10 py-2 rounded hover:bg-sky-600 font-sans cursor-pointer mb-2"
            >
              Sign in
            </button>
          </div>

          <div className="text-gray-950">
            Not a member?{" "}
            <a
              onClick={handleSignup}
              className="text-blue-700 hover:underline font-sans cursor-pointer"
            >
              Sign up
            </a>
            {error && (
              <div className="text-red-500 text-sm  text-center">{error}</div>
            )}
            {success && (
              <div className="text-green-500 text-sm text-center">
                {success}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
