"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "@/config/baseUrl";
import { ImageOff, ExternalLink } from "lucide-react";

interface Ad {
  id: number;
  title: string;
  image_data: string;
  link_url: string;
}

export default function AdsListPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseURL}/api/ads`);
        console.log("Ads fetched:", res.data);
        setAds(Array.isArray(res.data) ? res.data : [res.data].filter(Boolean));
      } catch (err) {
        console.error("Error fetching ads:", err);
        setError("Failed to load ads");
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-200 rounded-lg h-40 sm:h-48 animate-pulse">
        <span className="text-gray-500 text-sm">Loading ad...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center bg-red-100 rounded-lg h-40 sm:h-48">
        <span className="text-red-600 text-sm">{error}</span>
      </div>
    );
  }

  if (!ads.length) {
    return (
      <div className="flex items-center justify-center bg-gray-200 rounded-lg h-40 sm:h-48">
        <ImageOff className="w-8 h-8 text-gray-400 mr-2" />
        <span className="text-gray-500 text-sm">No Ads Available</span>
      </div>
    );
  }

  // Display the first ad (extend to carousel if needed)
  const ad = ads[0];

  return (
    <div className="w-full max-w-md mx-auto">
      <a
        href={ad.link_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <img
          src={ad.image_data.startsWith("data:") ? ad.image_data : `${baseURL}/${ad.image_data}`}
          alt={ad.title}
          className="w-full h-30 sm:h-38 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/fallback-image.jpg"; 
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white text-sm sm:text-base font-semibold line-clamp-2">
            {ad.title}
          </h3>
        </div>
        <ExternalLink className="absolute top-2 right-2 w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
    </div>
  );
}