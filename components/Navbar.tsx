"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";

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
    })),  { label: "Login", href: "/Login" },
  ];

  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <nav className="bg-white dark:bg-blue-900 border-b p-5 sticky top-0 z-50">
      <div className="flex items-center justify-between">
         <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.jpg" 
            alt="Site Logo"
            width={50}
            height={40}
            priority
          />
            </Link>

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
          <button onClick={toggleSidebar} className="text-2xl">
            {sidebarOpen ? <FiX color="red" /> : <FiMenu color="white" />}
          </button>
        </div>
      </div>
      {sidebarOpen && (
        <div className="md:hidden fixed top-16 right-0 w-3/4 h-full bg-gray-800 text-white p-6">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-white hover:text-blue-400"
                  onClick={closeSidebar}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
