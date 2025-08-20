'use client';
import React from "react";
import { baseURL } from "@/config/baseUrl";
import axios from "axios";
import { useEffect, useState } from "react";
interface Ad {
  id: number;
  title: string;
  image_data: string;
  link_url: string;
}
export default function AdsListPage() {
  const [ad, setAd] = useState<Ad | null>(null);
  useEffect(() => {
    const fetchAd = async () => {
      console.log("Fetching data");
      try {
        const res = await axios.get(`${baseURL}/api/ads`);
        console.log("data being displayed",res)
        setAd(res.data);
      } catch (err) {
        console.error("Error fetching ad:", err);
      }
    };
    fetchAd();
  }, []);

  if (!ad) return null;
  return (
    <div>
      {ad ? (
        <a href={ad.link_url} target="_blank" rel="noopener noreferrer">
          <img
            src={ad.image_data}
            alt={ad.title}
            width={300}
            height={100}
            className="rounded shadow-md"
          />
        </a>
      ) : (
        <p className="text-gray-500">No Ad Available</p>
      )}
    </div>
  );
}
