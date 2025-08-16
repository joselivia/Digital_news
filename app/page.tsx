import BlogListPage from "@/components/Blogs";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex flex-col bg-cyan-900 min-h-screen ">
      <div className="flex flex-row justify-between items-center p-4">
        <h1 className="text-4xl font-bold text-white text-center">
          📰📰 Latest News
        </h1>
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
         <Link
          href="/BlogPostForm"
          className="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-full transition-colors duration-200 shadow-md hidden sm:block"
        >
          Logout
        </Link></div>
      </div>
      <div className="flex-grow">     

    <Suspense fallback={<div>Loading...</div>}>
    <BlogListPage />
    </Suspense>

      </div>
    </div>
  );
}
