"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { baseURL } from "@/config/baseUrl";

const BlogPostForm = () => {
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [existingMedia, setExistingMedia] = useState<
    { url: string; type: string; id?: string }[]
  >([]);

  // Newly uploaded files
  const [media, setMedia] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{ url: string; type: string }[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Advertisement",
    "Politics",
    "Business",
    "Sports",
    "Technology",
    "Entertainment",
  ];

  const router = useRouter();

  // Handle new uploads
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMedia((prev) => [...prev, ...files]); // append instead of replace

    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setPreviewUrls((prev) => [...prev, ...previews]);
  };

  // Remove existing media from display (and mark as removed)
  const removeExistingMedia = (index: number) => {
    setExistingMedia((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove new media before upload
  const removeNewMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Load post data if editing
  useEffect(() => {
    if (postId) {
      axios
        .get(`${baseURL}/api/blogs/posts/${postId}`)
        .then((res) => {
          const post = res.data;
          setTitle(post.title || "");
          setCategory(post.category || "");
          setContent(post.content || "");

          const media: { url: string; type: string }[] = [];
          if (Array.isArray(post.images)) {
            media.push(...post.images.map((url: string) => ({ url, type: "image/jpeg" })));
          }
          if (Array.isArray(post.videos)) {
            media.push(...post.videos.map((url: string) => ({ url, type: "video/mp4" })));
          }
          setExistingMedia(media);
        })
        .catch((err) => console.error("❌ Failed to fetch post", err));
    }
  }, [postId]);

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);

    // Keep remaining existing media
    existingMedia.forEach((file) => {
      formData.append("existingMedia[]", JSON.stringify(file));
    });

    // Add newly uploaded media
    media.forEach((file) => {
      formData.append("media", file);
    });

    try {
      let res;
      if (postId) {
        res = await axios.put(`${baseURL}/api/blogs/posts/${postId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post(`${baseURL}/api/blogs/posts`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

 if (res.status === 200) {
  const id = postId || res.data.id; 
  setMessage(postId ? "✅ Post updated!" : "✅ Post created!");
  setTimeout(() => router.push(`/`), 1000);


      }
    } catch (err) {
      console.error(err);
      setMessage(postId ? "❌ Failed to update." : "❌ Failed to create.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-400 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white mx-auto p-6 shadow-md rounded-md space-y-4 w-full max-w-lg"
      >
        <h2 className="text-xl font-bold text-center">
          {postId ? "Edit Blog Post" : "Create Blog Post"}
        </h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="" disabled>
            Select category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Write your article..."
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
          onChange={handleMediaChange}
          className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-1 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {/* Existing Media */}
        {existingMedia.length > 0 && (
          <div>
            <p className="font-semibold mb-2">Existing Media:</p>
            <div className="flex flex-wrap gap-2">
              {existingMedia.map(({ url, type }, idx) => (
                <div key={idx} className="relative">
                  {type.startsWith("image/") ? (
                    <img src={url} className="w-24 h-24 object-cover rounded" />
                  ) : type.startsWith("video/") ? (
                    <video src={url} controls className="w-24 h-24 rounded object-cover" />
                  ) : (
                    <a href={url} target="_blank" className="text-blue-500 underline">
                      File
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => removeExistingMedia(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Media Previews */}
        {previewUrls.length > 0 && (
          <div>
            <p className="font-semibold mb-2">New Media:</p>
            <div className="flex flex-wrap gap-2">
              {previewUrls.map(({ url, type }, idx) => (
                <div key={idx} className="relative">
                  {type.startsWith("image/") ? (
                    <img src={url} className="w-24 h-24 object-cover rounded" />
                  ) : type.startsWith("video/") ? (
                    <video src={url} controls className="w-24 h-24 rounded object-cover" />
                  ) : (
                    <a href={url} target="_blank" className="text-blue-500 underline">
                      File
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => removeNewMedia(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full text-white py-2 px-4 rounded ${
            submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Submitting..." : postId ? "Update Post" : "Create Post"}
        </button>

        {message && <p className="text-center text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
};

export default BlogPostForm;
