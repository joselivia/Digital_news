"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { baseURL } from "@/config/baseUrl";
import { useMediaStore } from "@/config/mediastore";
import {
  Loader2,
  Info,
  FileText,
  ImageOff,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

interface BlogPost {
  id: number;
  title: string;
  category: string;
  content: string;
  created_at: string;
}
interface MediaContent {
  images: string[];
  videos: string[];
}

const truncate = (text: string, limit: number) => {
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

const BlogListPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [error, setError] = useState("");
  
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "home"; 
  const { mediaMap, setMedia } = useMediaStore() || {
    mediaMap: {},
    setMedia: () => {},
  };

  const featuredPost = useMemo(() => posts[0], [posts]);
  const latestPosts = useMemo(() => posts.slice(1, 5), [posts]);
  const mainNewsGrid = useMemo(() => posts.slice(5), [posts]);

useEffect(() => {
  const fetchPostsAndMedia = async () => {
    setPostsLoading(true);
    setMediaLoading(true);
    setError("");

    try {
      const res = await axios.get(`${baseURL}/api/posts`, {
        params: { 
          limit: 15, 
          offset: 0, 
          category 
        }
      });

      const fetchedPosts = res.data?.posts || [];

      const sortedPosts = fetchedPosts
        .filter((p: BlogPost) => p.content && typeof p.content === "string")
        .sort(
          (a: BlogPost, b: BlogPost) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      setPosts(sortedPosts);
      setPostsLoading(false);

      const mediaPromises = sortedPosts.map(async (post: BlogPost) => {
        if (!mediaMap[post.id]) {
          try {
            const mediaRes = await axios.get(`${baseURL}/api/posts/${post.id}`);
            const { images = [], videos = [] } = mediaRes.data as MediaContent;
            return { postId: post.id, media: { images, videos } };
          } catch (err) {
            console.error(`❌ Failed to load media for post ${post.id}`, err);
            return { postId: post.id, media: { images: [], videos: [] } };
          }
        }
        return null;
      });

      const mediaResults = await Promise.all(mediaPromises);
      mediaResults.forEach((result) => {
        if (result) {
          setMedia?.(result.postId, result.media);
        }
      });
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
      setError("Failed to fetch blog posts. Please try again.");
      setPostsLoading(false);
    } finally {
      setMediaLoading(false);
    }
  };

  fetchPostsAndMedia();
}, [category]);
  const renderMedia = (post: BlogPost, media: MediaContent | undefined, className: string) => {
    if (!media || mediaLoading) {
      return (
        <div className="flex items-center justify-center bg-gray-100 animate-pulse w-full h-full">
          <Loader2 className="animate-spin w-8 h-8 text-gray-300" />
        </div>
      );
    }

    const hasImage = media?.images?.length > 0;
    const hasVideo = media?.videos?.length > 0;
    const mediaSrc = hasImage ? media.images[0] : hasVideo ? media.videos[0] : "";

    if (hasImage) {
      return (
        <img
          src={mediaSrc.startsWith("data:") ? mediaSrc : `${baseURL}/${mediaSrc}`}
          alt="Post preview"
          className={className}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "https://placehold.co/400x240/E2E8F0/A0AEC0?text=Image+Unavailable";
          }}
        />
      );
    }
    if (hasVideo) {
      return (
        <video className={className} controls preload="metadata">
          <source src={mediaSrc.startsWith("data:") ? mediaSrc : `${baseURL}/${mediaSrc}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    return (
      <div className="flex items-center justify-center bg-gray-100 w-full h-full">
        <ImageOff className="w-12 h-12 text-gray-400" />
      </div>
    );
  };

  const renderSocialShare = (post: BlogPost) => {
    const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/BlogPostForm/${post.id}`;
    const shareText = `Check out this news story: ${post.title}`;

    return (
      <div className="flex space-x-2 mt-4 text-gray-500">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className="hover:text-blue-600"
        >
          <Facebook className="w-5 h-5" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(
            shareUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className="hover:text-blue-400"
        >
          <Twitter className="w-5 h-5" />
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on Instagram"
          className="hover:text-pink-500"
        >
          <Instagram className="w-5 h-5" />
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen sm:px-6 lg:px-8">
      <div className="mx-auto">
             {postsLoading ? (
          <div className="flex flex-col items-center text-gray-500 py-16">
            <Loader2 className="animate-spin w-10 h-10 mb-4" />
            <p className="text-lg">Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center text-red-500 py-16">
            <Info className="w-10 h-10 mb-4" />
            <p className="text-lg">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center text-gray-500 py-16">
            <FileText className="w-10 h-10 mb-4" />
            <p className="text-lg">No blog posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredPost && (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col h-full">
                  <div className="bg-gray-100 p-4">
                    <h2 className="font-extrabold text-3xl text-gray-900 mb-3 leading-tight">
                      {featuredPost.title}
                    </h2>
                  </div>
                  <div className="relative h-96">
                    {renderMedia(featuredPost, mediaMap[featuredPost.id], "w-full h-full object-cover")}
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <p className="text-gray-500 text-sm mb-4">
                        {new Date(featuredPost.created_at).toLocaleDateString("en-KE", { dateStyle: "medium" })}
                      </p>
                      <p className="text-gray-700 text-base mb-6 line-clamp-4">
                        {(featuredPost.content)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/BlogPostForm/${featuredPost.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold"
                      >
                        Read Full Story <ExternalLink className="w-4 h-4 ml-2" />
                      </Link>
                      {renderSocialShare(featuredPost)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">More Recent Stories</h3>
              {latestPosts.length > 0 ? (
                latestPosts.map((post) => (
                  <Link
                    href={`/BlogPostForm/${post.id}`}
                    key={post.id}
                    className="flex bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  >
                    <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32">
                      {renderMedia(post, mediaMap[post.id], "w-full h-full object-cover")}
                    </div>
                    <div className="p-4 flex-grow">
                      <h4 className="font-semibold text-gray-800 text-base mb-1 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString("en-KE", { dateStyle: "short" })}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500">No other stories to show.</p>
              )}
            </div>
          </div>
        )}
      </div>
      {mainNewsGrid.length > 0 && (
        <div className="max-w-7xl mx-auto mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainNewsGrid.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  {renderMedia(post, mediaMap[post.id], "w-full h-full object-cover")}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {new Date(post.created_at).toLocaleDateString("en-KE", { dateStyle: "medium" })}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3 flex-grow">
                    {truncate(post.content, 120)}
                  </p>
                  <Link
                    href={`/BlogPostForm/${post.id}`}
                    className="mt-4 inline-flex items-center text-blue-600 hover:underline text-sm font-medium"
                  >
                    Read more <ExternalLink className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogListPage;