"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "@/config/baseUrl";

export default function AdminPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Get token on client side
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
  }, []);

  // ✅ Fetch staff only if token exists
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${baseURL}/api/manage-staff/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStaff(res.data))
      .catch((err) => console.error("Failed to fetch staff", err));
  }, [token]);

  // Add staff
  const addStaff = async () => {
    if (!newEmail.trim() || !newPassword.trim()) {
      alert("⚠️ Email and password cannot be empty");
      return;
    }
    await axios.post(
      `${baseURL}/api/manage-staff/staff`,
      { email: newEmail, password: newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewEmail("");
    setNewPassword("");
    location.reload();
  };

  // Remove staff
  const removeStaff = async (id: number) => {
    await axios.delete(`${baseURL}/api/manage-staff/staff/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {!token ? (
        <p className="text-red-500">
          You must be logged in as an admin to view this page.
        </p>
      ) : (
        <>
          {/* Staff Management */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold">Manage Staff</h2>
            <div className="mt-2">
              <input
                className="border p-2 mr-2"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Staff email"
                autoComplete="off"
              />
              <input
                className="border p-2 mr-2"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Password"
                autoComplete="new-password"
              />
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={addStaff}
              >
                Add Staff
              </button>
            </div>
            <ul className="mt-4">
              {staff.map((s) => (
                <li
                  key={s.id}
                  className="flex justify-between p-2 border-b"
                >
                  {s.email} ({s.role})
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => removeStaff(s.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
