"use client";
import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { EllipsisVertical, Newspaper } from "lucide-react";
import BlogListPage from "@/components/Blogs";
import AdsListPage from "./Ads/Ads";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ email?: string; role?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Invalid user data in storage", e);
      }
    }
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.location.href = "/";
  };

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-cyan-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
            <Newspaper className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
            Latest News
          </h1>
          {mounted && token && user && (
            <div className="flex items-center space-x-4">
              {/* User Info (Desktop) */}
              <div className="hidden sm:block bg-cyan-800 rounded-lg px-3 py-2">
                <p className="text-xs text-cyan-200 capitalize">{user.role}</p>
                <p className="text-sm font-medium">{user.email || "User"}</p>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden sm:flex items-center space-x-2">
                {(isAdmin || isStaff) && (
                  <>
                    <Link
                      href="/BlogPostForm"
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-full transition-colors"
                    >
                      + Blog
                    </Link>
                    <Link
                      href="/Ads"
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-full transition-colors"
                    >
                      + Ad
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <>
                    <Link
                      href="/Login/Admin"
                      className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-full transition-colors"
                    >
                      + Admin
                    </Link>
                    <Link
                      href="/Login/update-admin"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors"
                    >
                      Update Logins
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-full transition-colors"
                >
                  Logout
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="sm:hidden">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 bg-cyan-800 rounded-lg"
                  aria-label="Toggle menu"
                >
                  <EllipsisVertical className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="sm:hidden bg-cyan-800 px-4 py-3 mx-4 rounded-b-lg shadow-lg">
            <div className="flex flex-col space-y-2">
              {(isAdmin || isStaff) && (
                <>
                  <Link
                    href="/BlogPostForm"
                    className="px-3 py-2 text-white hover:bg-cyan-700 rounded-md text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    + Blog
                  </Link>
                  <Link
                    href="/Ads"
                    className="px-3 py-2 text-white hover:bg-cyan-700 rounded-md text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    + Ad
                  </Link>
                </>
              )}
              {isAdmin && (
                <>
                  <Link
                    href="/Login/Admin"
                    className="px-3 py-2 text-white hover:bg-cyan-700 rounded-md text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    + Admin
                  </Link>
                  <Link
                    href="/Login/update-admin"
                    className="px-3 py-2 text-white hover:bg-cyan-700 rounded-md text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    Update Logins
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="px-3 py-2 text-red-400 hover:bg-cyan-700 rounded-md text-sm text-left"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-grow  mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
           <Suspense fallback={<div className="text-center py-8">Loading news...</div>}>
          <BlogListPage />
        </Suspense>
      </div>
    </div>
  );
}