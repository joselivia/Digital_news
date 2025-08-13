import BlogListPage from "@/components/Blogs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col bg-cyan-900 min-h-screen ">
      <div className="flex flex-row justify-between items-center p-4">
        <h1 className="text-4xl font-bold text-white text-center">
          📰📰 Latest News
        </h1>
        <Link
          href="/BlogPostForm"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-full transition-colors duration-200 shadow-md hidden sm:block"
        >
          + Create Blog
        </Link>
      </div>
      <div className="flex-grow">
        <BlogListPage />
      </div>
    </div>
  );
}
