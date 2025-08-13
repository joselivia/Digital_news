"use client";

import React, { useState } from "react";
import axios from "axios";

import { useRouter } from "next/navigation";
import { baseURL } from "@/config/baseUrl";

const BlogPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<
    { url: string; type: string }[]
  >([]);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMedia(files);

    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setPreviewUrls(previews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    media.forEach((file) => {
      formData.append("media", file);
    });

    try {
      const res = await axios.post(`${baseURL}/api/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        setMessage("✅ Post created successfully!");
        setTitle("");
        setContent("");
        setMedia([]);
        setPreviewUrls([]);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md space-y-4"
    >
      <h2 className="text-xl font-bold text-center">Create a Blog Post</h2>

      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Write your article here..."
        className="w-full p-2 h-40 border rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <input
        type="file"
        name="media"
        multiple
        accept="image/*,video/*,application/pdf"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-1 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

<div className="flex flex-wrap gap-2">
  {previewUrls.map(({ url, type }, idx) => {
    if (type.startsWith("image/")) {
      return (
        <img key={idx} src={url} alt="Preview" className="w-24 h-24 object-cover rounded" />
      );
    } else if (type.startsWith("video/")) {
      return (
        <video key={idx} src={url} controls className="w-24 h-24 rounded object-cover" />
      );
    }
    return null;
  })}
</div>


 <button
  type="submit"
  disabled={submitting}
  className={`w-full text-white py-2 px-4 rounded ${
    submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {submitting ? "Submitting..." : "Submit Post"}
</button>


      {message && (
        <p className="text-center text-sm text-green-600">{message}</p>
      )}
    </form>
  );
};

export default BlogPostForm;
