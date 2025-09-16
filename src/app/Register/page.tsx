"use client";

import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/Api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess("Account created successfully");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-rose-700 p-10 flex flex-col gap-6 w-full max-w-md"
      >
        <h1 className="text-white text-4xl font-bold text-center">Register</h1>

        <div className="flex items-center gap-4">
          <label className="w-32 text-left">E-Mail</label>
          <input
            className="flex-1 p-2 rounded-md bg-red-300 text-black placeholder-black"
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 text-left">Password</label>
          <div className="flex-1 flex items-center">
            <input
              className="flex-1 p-2 rounded-md bg-red-300 text-black placeholder-black"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="ml-2 text-sm text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 text-left">Password Again</label>
          <div className="flex-1 flex items-center">
            <input
              className="flex-1 p-2 rounded-md bg-red-300 text-black placeholder-black"
              type={showPassword ? "text" : "password"}
              placeholder="Password Again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="ml-2 text-sm text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-300 text-sm">{error}</p>}
        {success && <p className="text-green-300 text-sm">{success}</p>}

        <button
          className="bg-gray-300 text-black p-2 rounded-md cursor-pointer hover:bg-rose-500 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Register"}
        </button>

        <Link href="/Login">
          <p className="text-center hover:text-rose-500">
            Already have an account?
          </p>
        </Link>
      </form>
    </div>
  );
}
