import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// import { useCart } from "./CardContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated on component mount
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleClick = () => {
    navigate("/cart");
  };

  const handleSignin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    // Clear token and update state
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/");
  };
  return (
    <div>
      <div className="bg-blue-600 p-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="ml-5 text-white flex-none hidden md:block">Logo</div>

          <div className="flex-grow max-w-full  md:max-w-2xl mx-5 mt-3 md:mt-0 md:ml-64">
            <form>
              <div className="relative">
                <div className="flex items-center">
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search Everything at PrimeMart online and in Store"
                    required
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-900 absolute left-3 top-2.5 mt-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>
              </div>
            </form>
          </div>

          <div className="flex space-x-9 text-white mt-3 md:mt-0 cursor-pointer ">
            <div className="flex items-center hover:bg-blue-950 rounded-full p-2 transition duration-200 ease-in-out transform hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-6 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              <div className="flex flex-col">
                <div className="text-sm">Reorder</div>
                <div className="text-white font-medium text-sm">MyItems</div>
              </div>
            </div>

            <div className="flex items-center hover:bg-blue-950 rounded-full p-2 transition duration-200 ease-in-out transform hover:scale-105 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <div className="flex items-center hover:bg-blue-950 rounded-full p-2 transition duration-200 ease-in-out transform hover:scale-105 cursor-pointer">
                {isAuthenticated ? (
                  <div className="flex flex-col">
                    <div className="text-sm" onClick={handleLogout}>
                      Logout
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="text-sm" onClick={handleSignin}>
                      Signin
                    </div>
                    <div
                      className="text-white font-medium text-sm"
                      onClick={handleSignin}
                    >
                      Account
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center hover:bg-blue-950 rounded-full p-2 transition duration-200 ease-in-out transform hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
                onClick={handleClick}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              <div>0.00</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 bg-gray-200 p-2">
        <div className="col-span-4">
          <div className="flex space-x-10">
            <div className="flex cursor-pointer">
              <div className="ml-4">Departments</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>

            <div className="flex cursor-pointer">
              <div>Services</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="col-span-6 cursor-pointer hidden md:block">
          <div className="flex justify-between items-center text-sm">
            <div className="hover:underline">Deals</div>
            <div className="hover:underline">Grocery&Essentials</div>
            <div className="hover:underline">Fashion</div>
            <div className="hover:underline">Electronics</div>
            <div className="hover:underline">Registry</div>
            <div className="hover:underline">Home</div>
            <div className="hover:underline">New&Trending</div>
          </div>
        </div>
      </div>

      {/* <div>
        <ProductsList />
      </div> */}
    </div>
  );
};
