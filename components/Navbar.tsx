'use client';
import React, { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import AdsListPage from "@/app/Ads/Ads";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = [
    "Advertisement",
    "Politics",
    "Business",
    "Sports",
    "Technology",
    "Entertainment",
  ];

  const navItems = [
    { label: "Home", href: "/" },
    ...categories.map((cat) => ({
      label: cat,
      href: `/?category=${encodeURIComponent(cat)}`,
    })),
    { label: "Login", href: "/Login" },
  ];

  return (
    <div>
      {/* Logo & Ads */}
      <div className="bg-white dark:bg-gray-800 shadow-md">
        <div className="flex flex-row justify-between items-center p-4">
          <div>
            <img src="/logo.png" alt="Site Logo" width={100} height={100} />
          </div>
          <div>
            <AdsListPage />
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-blue-900 border-b shadow-md p-4">
        <div className="flex items-center justify-between">
          {/* Desktop Menu */}
          <div className="hidden md:flex justify-center flex-1">
            <ul className="flex space-x-8 font-medium">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-900 dark:text-white hover:text-blue-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-2xl"
            >
              {sidebarOpen ? <FiX color="red" /> : <FiMenu color="black" />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="md:hidden mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <ul className="flex flex-col space-y-4 p-4 font-medium">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block text-gray-900 dark:text-white hover:text-blue-500"
                    onClick={() => setSidebarOpen(false)} 
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}
