'use client'
import BlogListPage from "@/components/Blogs";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    setIsAdmin(adminStatus === "true");
    setMounted(true);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };
  return (
    <div className="flex flex-col bg-cyan-900 min-h-screen ">
      <div className="flex flex-row justify-between items-center p-4">
        <h1 className="text-4xl font-bold text-white text-center">
          📰📰 Latest News
        </h1>   {mounted && isAdmin &&(
        <div className="flex space-x-4">
       
          <Link
            href="/BlogPostForm"
            className="bg-green-600 hover:bg-green-700 text-white font-bold p-2 rounded-full transition-colors duration-200 shadow-md hidden sm:block"
          >
            + Create Blog
          </Link>
          <Link
            href="/Login/update-admin"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-full transition-colors duration-200 shadow-md hidden sm:block"
          >
            Update-Logins
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>)}
      </div>
      <div className="flex-grow">
        <Suspense fallback={<div>Loading...</div>}>
          <BlogListPage />
        </Suspense>
      </div>
    </div>
  );
}
