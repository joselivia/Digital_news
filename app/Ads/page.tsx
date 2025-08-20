"use client";
import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "@/config/baseUrl";

export default function AdsPage() {
  const [form, setForm] = useState({
    title: "",
    link_url: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("link_url", form.link_url);
    formData.append("image", file);

    try {
      await axios.post(`${baseURL}/api/ads`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Ad created successfully!");
      setForm({ title: "", link_url: "" });
      setFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Ad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Ad Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Link URL"
          value={form.link_url}
          onChange={(e) => setForm({ ...form, link_url: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Save Ad
        </button>
      </form>
      {success && <p className="text-green-600 mt-4">{success}</p>}
    </div>
  );
}
