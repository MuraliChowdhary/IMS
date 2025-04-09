import { useState } from "react";

export function NavBar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };
  return (
    <div
      className={`${
        isOpen ? "w-60" : "w-16"
      } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        {isOpen && <h1 className="text-xl font-bold">Sales Manager</h1>}
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            className={`w-5 h-5 transform ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
      </div>

      <nav className="flex-1 p-2">
        <ul>
          <li>
            <a
              href="/sales"
              className={`flex ${
                isOpen ? "justify-start" : "justify-center"
              } items-center p-3 rounded-md bg-blue-50 text-blue-600 mb-1`}
            >
              <svg
                className={`w-5 h-5 ${isOpen ? "mr-3" : "mr-0"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              {isOpen && <span>Dashboard</span>}
            </a>
          </li>
          <li>
            <a
              href="/sales/customers"
              className={`flex ${
                isOpen ? "justify-start" : "justify-center"
              } items-center p-3 rounded-md text-gray-700 hover:bg-gray-50 mb-1`}
            >
              <svg
                className={`w-5 h-5 ${isOpen ? "mr-3" : "mr-0"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
              </svg>
              {isOpen && <span>Customers</span>}
            </a>
          </li>
          <li>
            <a
              href="/sales/salesReports"
              className={`flex ${
                isOpen ? "justify-start" : "justify-center"
              } items-center p-3 rounded-md text-gray-700 hover:bg-gray-50 mb-1`}
            >
              <svg
                className={`w-5 h-5 ${isOpen ? "mr-3" : "mr-0"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
              {isOpen && <span>Sales Reports</span>}
            </a>
          </li>
          <li>
            <a
              href="/quotations"
              className={`flex ${
                isOpen ? "justify-start" : "justify-center"
              } items-center p-3 rounded-md text-gray-700 hover:bg-gray-50 mb-1`}
            >
              <svg
                className={`w-5 h-5 ${isOpen ? "mr-3" : "mr-0"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {isOpen && <span>Quotations</span>}
            </a>
          </li>
        </ul>
      </nav>

      <div
        className={`p-4 border-t border-gray-200 ${
          isOpen ? "block" : "flex justify-center"
        }`}
      >
        <button className="flex items-center text-red-500 hover:text-red-700">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
          {isOpen && (
            <span onClick={handleLogout} className="ml-2 cursor-pointer">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default NavBar;
