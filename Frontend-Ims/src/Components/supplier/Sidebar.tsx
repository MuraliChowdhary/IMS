// // components/Sidebar.jsx
// import React, { useState } from 'react';

// function Sidebar() {
//   const [isOpen, setIsOpen] = useState(true);

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   const supplierLinks = [
//     { name: "Dashboard", icon: "📊", path: "/supplier" },
//     { name: "Orders", icon: "📦", path: "/supplier/orders" },
//     { name: "QC Management", icon: "✅", path: "/supplier/qc" },
//     { name: "Shipping", icon: "🚚", path: "/supplier/shipping" },
//   ];

//   return (
//     <div className={`${isOpen ? 'w-60' : 'w-16'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}>
//       <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//         {isOpen && <h1 className="text-xl font-bold">Supplier Panel</h1>}
//         <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 focus:outline-none">
//           {/* Toggle Icon */}
//         </button>
//       </div>
//       <nav className="flex-1 p-2">
//         <ul>
//           {supplierLinks.map((link, index) => (
//             <li key={index}>
//               <a href={link.path} className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-50 mb-1">
//                 <span className="mr-3">{link.icon}</span>
//                 {isOpen && <span>{link.name}</span>}
//               </a>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </div>
//   );
// }

// export default Sidebar;

import { useState } from "react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const supplierLinks = [
    { name: "Dashboard", icon: "📊", path: "/supplier" },
    { name: "Orders", icon: "📦", path: "/supplier/orders" },
    { name: "QC Management", icon: "✅", path: "/supplier/qc" },
    { name: "Shipping", icon: "🚚", path: "/supplier/shipping" },
  ];

  const handleLogout = () => {
    // Handle logout logic here
  };
  return (
    <div
      className={`${
        isOpen ? "w-60" : "w-16"
      } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        {isOpen && <h1 className="text-xl font-bold">Supplier</h1>}
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
          {supplierLinks.map((link, index) => (
            <li key={index}>
              <a
                href={link.path}
                className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-50 mb-1"
              >
                <span className="mr-3">{link.icon}</span>
                {isOpen && <span>{link.name}</span>}
              </a>
            </li>
          ))}
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
            <span onClick={handleLogout} className="ml-2">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
