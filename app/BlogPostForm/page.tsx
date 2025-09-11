"use client";

import BlogPostForm from "@/components/BlogPostForm";
import { Suspense } from "react";

export default function BlogPostFormPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <BlogPostForm />
    </Suspense>
  );
}
