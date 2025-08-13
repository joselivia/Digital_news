"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { baseURL } from "@/config/baseUrl"; 
import {
  Calendar,
  Image as ImageIcon, 
  Video, 
  Loader2, 
  Info,   X,
  FileText, 
} from "lucide-react"; 
interface BlogPost {
  id: number;
  title: string;
  content: string;
  created_at: string;
  images: string[];
  videos: string[];
}

const linkify = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split("\n").map((line, i) => (
    <p key={i} className="mb-3 text-gray-800 leading-relaxed">
      {line.split(urlRegex).map((part, index) =>
        urlRegex.test(part) ? (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
          >
            {part}
          </a>
        ) : (
          part
        )
      )}
    </p>
  ));
};

const BlogDetailsPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No blog post ID provided.");
      return;
    }

    setLoading(true);
    setError(null);
    axios
      .get<BlogPost>(`${baseURL}/api/posts/${id}`)
      .then((res) => {
        setPost({
          ...res.data,
          images: res.data.images || [],
          videos: res.data.videos || [],
    
        });
      })
      .catch((err) => {
        console.error("❌ Error loading post:", err);
        setError("Failed to load blog post. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
          <Loader2 className="animate-spin w-12 h-12 text-blue-500 mb-4" />
          <p className="text-lg text-gray-700 font-medium">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg text-red-600">
          <X className="w-12 h-12 mb-4" />
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-lg text-gray-600">
          <Info className="w-12 h-12 mb-4" />
          <p className="text-lg font-medium">Blog post not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className=" mx-auto bg-white shadow-xl rounded-2xl p-2 sm:p-8 border border-gray-200">
        <div className="mb-8 pb-4 border-b border-gray-200 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
            {post.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            Published on: {new Date(post.created_at).toLocaleString("en-KE", { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>

        {post.images.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-blue-600" /> Images
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {post.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.startsWith('data:') ? img : `${baseURL}/${img}`}
                  alt={`Post image ${idx}`}
                  className="w-full h-56 object-cover rounded-lg shadow-md border border-gray-200 transform hover:scale-[1.03] transition-transform duration-200 ease-in-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400/E2E8F0/A0AEC0?text=Image+Load+Error";
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {post.videos.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Video className="w-5 h-5 mr-2 text-red-600" /> Videos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {post.videos.map((vid, idx) => (
                <video
                  key={idx}
                  src={vid.startsWith('data:') ? vid : `${baseURL}/${vid}`} 
                  className="w-full h-100 object-fit rounded-lg shadow-md border border-gray-200"
                  controls
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
          </div>
        )}

       <div className="prose prose-lg max-w-none text-gray-900 leading-relaxed">
          {linkify(post.content)}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;