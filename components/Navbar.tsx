"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
   ];

  const toggleSidebar = () => setSidebarOpen(v => !v);
  const closeSidebar  = () => setSidebarOpen(false);

  return (
    <nav className="bg-white dark:bg-blue-900 border-b p-5 sticky top-0 z-50">
         <div className="md:hidden flex justify-end">
        <button onClick={toggleSidebar} className="text-2xl">
          {sidebarOpen ? <FiX color="red" /> : <FiMenu color="white"/>}
        </button>
      </div>

      {/* desktop nav */}
      <div className="hidden md:flex justify-end">
        <ul className="flex space-x-8 font-medium">
        {navItems.map(item => (
  <li key={item.label}>
    <Link href={item.href} className="text-gray-900 dark:text-white">
      {item.label}
    </Link>
  </li>
))}

        </ul>
      </div>

      {/* mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed top-16 right-0 w-3/4 h-full bg-gray-800 text-white p-6">
          <ul className="space-y-4">
         {navItems.map(item => (
  <li key={item.label}>
    <Link href={item.href} className="text-gray-900 dark:text-white">
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