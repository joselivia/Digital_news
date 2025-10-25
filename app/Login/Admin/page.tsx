'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "@/config/baseUrl";
import { LogOut, Users, FileText } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    // Fetch staff
    axios
      .get(`${baseURL}/api/manage-staff/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStaff(res.data))
      .catch((err) => {
        console.error("Failed to fetch staff", err);
        setError("Failed to load staff data");
      })
      .finally(() => setLoading(false));

    // Fetch recent posts
    axios
      .get(`${baseURL}/api/blogs/posts`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 5 },
      })
      .then((res) => setPosts(res.data.posts || []))
      .catch((err) => console.error("Failed to fetch posts", err));
  }, [token]);

  const addStaff = async () => {
    if (!newEmail.trim() || !newPassword.trim()) {
      setError("Email and password cannot be empty");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${baseURL}/api/manage-staff/staff`,
        { email: newEmail, password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Staff added successfully!");
      setNewEmail("");
      setNewPassword("");
      // Refresh staff list
      const res = await axios.get(`${baseURL}/api/manage-staff/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(res.data);
    } catch (err) {
      setError("Failed to add staff. Please try again.");
      console.error("Add staff error:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeStaff = async (id: number) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`${baseURL}/api/manage-staff/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(staff.filter((s) => s.id !== id));
      setSuccess("Staff removed successfully!");
    } catch (err) {
      setError("Failed to remove staff. Please try again.");
      console.error("Remove staff error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/Login";
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Admin Dashboard
          </h1>
          {token && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>

        {!token ? (
          <div className="flex justify-center items-center h-[80vh]">
            <p className="text-red-500 text-lg font-semibold bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              You must be logged in as an admin to view this page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Dashboard Overview */}
            <section className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users size={24} className="text-orange-500" />
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Total Staff</p>
                  <p className="text-3xl font-bold text-orange-500">{staff.length}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Posts</p>
                  <p className="text-3xl font-bold text-orange-500">{posts.length}</p>
                </div>
              </div>
            </section>

            {/* Manage Staff */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users size={24} className="text-orange-500" />
                Manage Staff
              </h2>
              {error && (
                <p className="text-red-500 bg-red-50 dark:bg-red-900/50 p-3 rounded-md mb-4">{error}</p>
              )}
              {success && (
                <p className="text-green-500 bg-green-50 dark:bg-green-900/50 p-3 rounded-md mb-4">{success}</p>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Staff Email</label>
                  <input
                    className="w-full mt-1 border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-orange-500 focus:border-orange-500"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter staff email"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <input
                    className="w-full mt-1 border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-orange-500 focus:border-orange-500"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="new-password"
                  />
                </div>
                <button
                  className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-colors duration-300 disabled:bg-orange-300 disabled:cursor-not-allowed"
                  onClick={addStaff}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Staff"}
                </button>
              </div>
              <ul className="mt-6 space-y-3">
                {staff.map((s) => (
                  <li
                    key={s.id}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">{s.email}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">({s.role})</span>
                    </div>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition-colors duration-300 disabled:bg-red-300 disabled:cursor-not-allowed"
                      onClick={() => removeStaff(s.id)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Recent Posts */}
            <section className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText size={24} className="text-orange-500" />
                Recent Posts
              </h2>
              {posts.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No recent posts available.</p>
              ) : (
                <ul className="space-y-4">
                  {posts.map((post) => (
                    <li
                      key={post.id}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                    >
                      <div>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{post.title}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                          {new Date(post.created_at).toLocaleDateString("en-KE", { dateStyle: "medium" })}
                        </span>
                      </div>
                      <Link
                        href={`/BlogPostForm?id=${post.id}`}
                        className="text-orange-500 hover:text-orange-600 font-medium"
                      >
                        Edit
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}