"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/Api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      window.location.assign("/Main");

      // router.push("/Main");
      // router.refresh();
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="text-black text-4xl font-bold">Login</h1>
          <div className="flex flex-col gap-4 bg-rose-700 p-10 rounded-md">
            <label>E-Mail</label>
            <input
              className="p-2 rounded-md bg-red-300 text-black placeholder-black"
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
              className="p-2 rounded-md bg-red-300 text-black placeholder-black"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className={`bg-gray-300 text-black p-2 rounded-md cursor-pointer hover:bg-rose-500 ${
                loading ? "opacity-50 animate-bounce cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
            <Link href="/Register">
              <p className="hover:text-rose-500">Don't have an account?</p>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
