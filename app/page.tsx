"use client";
import BlogListPage from "@/components/Blogs";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { EllipsisVertical } from "lucide-react"; 

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ email?: string; role?: string } | null>(
    null
  );
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
    <div className="flex flex-col bg-cyan-900 min-h-screen">
      <div className="flex flex-row justify-between items-center p-4">
        <h1 className="text-4xl font-bold text-white">📰 Latest News</h1>

        {mounted && token && user && (
          <div className="flex items-center space-x-2">
            {/* User Info */}
            <div className="text-white text-sm bg-gray-900 rounded-lg shadow-lg p-3 hidden sm:block">
              <p className="text-gray-300">{user.role}</p>
              <p className="font-semibold">{user.email || "User"}</p>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden sm:flex space-x-2">
              {(isAdmin || isStaff) && (
                <>
                  <Link
                    href="/BlogPostForm"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-2 rounded-full transition-colors shadow-md"
                  >
                    + Blogs
                  </Link>
                  <Link
                    href="/Ads"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 rounded-full transition-colors shadow-md"
                  >
                    + Ads
                  </Link>
                </>
              )}
              {isAdmin && (
                <>
                  <Link
                    href="/Login/Admin"
                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-2 rounded-full transition-colors shadow-md"
                  >
                    + Admin
                  </Link>
                  <Link
                    href="/Login/update-admin"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-full transition-colors shadow-md"
                  >
                    Update Logins
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>

            {/* Mobile Dropdown */}
            <div className="sm:hidden relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 bg-gray-800 rounded-lg"
              >
                <EllipsisVertical className="text-white w-6 h-6" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg flex flex-col p-2 z-50">
                  {(isAdmin || isStaff) && (
                    <>
                      <Link
                        href="/BlogPostForm"
                        className="px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 rounded"
                      >
                        + Blog
                      </Link>
                      <Link
                        href="/Ads"
                        className="px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 rounded"
                      >
                        + Ad
                      </Link>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <Link
                        href="/Login/Admin"
                        className="px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 rounded"
                      >
                        + Admin
                      </Link>
                      <Link
                        href="/Login/update-admin"
                        className="px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 rounded"
                      >
                        Update Logins
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm text-red-600 hover:bg-gray-200 rounded text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-grow">
        <Suspense fallback={<div>Loading...</div>}>
          < BlogListPage   />
        </Suspense>
      </div>
    </div>
  );
}
