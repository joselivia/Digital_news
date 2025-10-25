'use client';
import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import AdsListPage from "@/app/Ads/Ads";
import Image from "next/image";

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
    <div className="bg-gray-100 dark:bg-gray-950">
      {/* Logo & Sponsored Section */}
      <header className="bg-white dark:bg-gray-900 shadow-xl">
        <div className="container flex justify-between items-center mx-auto px-4 sm:px-6 lg:px-8 ">
          {/* Logo */}
          <div className="flex justify-center sm:justify-start mb-6">
            <Link href="/" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-20 rounded-full blur-md group-hover:opacity-30 transition-opacity duration-300"></div>
              <Image
                src="/logo.png"
                alt="Sports Blog Logo"
                width={150}
                height={150}
                className="object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-lg"
                priority
                onError={(e) => (e.currentTarget.src = "/placeholder-logo.png")}
              />
            </Link>
          </div>

          {/* Sponsored Section */}
          <section className="relative bg-cover bg-center rounded-2xl shadow-lg p-2 overflow-hidden" style={{ backgroundImage: "url('/sports-bg.jpg')" }}>
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-2 tracking-wide drop-shadow-md">
                Sponsored 
              </h2>
              <div className="max-w-5xl mx-auto animate-slide-in">
                <AdsListPage />
              </div>
            </div>
          </section>
        </div>
      </header>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-900 dark:bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Desktop Menu */}
            <div className="hidden md:flex justify-center flex-1">
              <ul className="flex space-x-10 font-semibold text-lg tracking-wide">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`${
                        item.label === ""
                          ? "text-orange-500 dark:text-orange-400"
                          : "text-gray-100 dark:text-gray-200"
                      } hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300 relative group`}
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-1 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-3xl p-3 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? (
                  <FiX className="text-red-400" />
                ) : (
                  <FiMenu className="text-orange-400" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div className="md:hidden fixed inset-y-0 right-0 w-3/4 max-w-sm bg-gray-900 dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50">
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-3xl text-red-400"
                  aria-label="Close menu"
                >
                  <FiX />
                </button>
              </div>
              <ul className="flex flex-col space-y-6 p-6 font-semibold text-lg tracking-wide">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`${
                        item.label === "Sports"
                          ? "text-orange-500 dark:text-orange-400"
                          : "text-gray-100 dark:text-gray-200"
                      } hover:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}