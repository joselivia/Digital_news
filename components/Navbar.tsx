'use client';
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

      <nav className="sticky top-0 z-50 bg-white dark:bg-blue-900 border-b shadow-md p-4">
        <div className="flex items-center justify-between">
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
          <div className="md:hidden flex">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl">
              {sidebarOpen ? <FiX color="red" /> : <FiMenu color="white" />}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}