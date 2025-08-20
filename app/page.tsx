"use client";
import BlogListPage from "@/components/Blogs";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ email?: string; role?: string } | null>(
    null
  );

  useEffect(() => {
    // ✅ check if already logged in (localStorage session)
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
        <h1 className="text-4xl font-bold text-white text-center">
          📰📰 Latest News
        </h1>

        {mounted && token && user && (
          <div className="flex items-center space-x-6">
            {/* ✅ Show logged in user */}
            <div className="text-white text-sm">
              <p className="font-semibold">{user.email || "User"}</p>
              <p className="text-gray-300">{user.role}</p>
            </div>

            <div className="flex space-x-4">
              {/* Both Admin + Staff can create blogs */}
              {(isAdmin || isStaff) && (
                <Link
                  href="/BlogPostForm"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold p-2 rounded-full transition-colors duration-200 shadow-md hidden sm:block"
                >
                  + Create Blog
                </Link>
              )}

              {/* Admin only */}
              {isAdmin && (
                <>
                  <Link
                    href="/Login/Admin"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold p-2 rounded-full transition-colors duration-200 shadow-md hidden sm:block"
                  >
                    + Admin
                  </Link>
                  <Link
                    href="/Ads"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 rounded-full transition-colors duration-200 shadow-md hidden sm:block"
                  >
                    + Create an Ad
                  </Link>
                  <Link
                    href="/Login/update-admin"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-full transition-colors duration-200 shadow-md hidden sm:block"
                  >
                    Update-Logins
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
          </div>
        )}
      </div>

      <div className="flex-grow">
        <Suspense fallback={<div>Loading...</div>}>
          <BlogListPage />
        </Suspense>
      </div>
    </div>
  );
}
