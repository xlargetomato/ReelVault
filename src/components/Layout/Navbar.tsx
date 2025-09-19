"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
}

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/Api/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await fetch("/Api/logout", { method: "POST" });
    window.open("/", "_self");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 text-center items-center gap-3 flex flex-col sm:flex-row justify-between">
      <Link
        href={"/"}
        className="font-bold text-xl hover:underline hover:text-gray-600"
      >
        Home
      </Link>
      <div className="flex gap-8">
        <Link
          href="/Main"
          className="font-bold text-xl hover:underline hover:text-gray-600"
        >
          Your Reels
        </Link>
        <Link
          href="/Main"
          className="font-bold text-xl hover:underline hover:text-gray-600"
        >
          Reels
        </Link>
      </div>
      <Link href="/Login">
        {user ? (
          <div>
            <span className="ml-4">Yo, {user.email}</span>
            <button
              onClick={handleLogout}
              className="text-white p-2 cursor-pointer bg-amber-600 rounded ml-4 hover:bg-amber-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button className="text-white p-2 cursor-pointer bg-amber-600 rounded ml-4 hover:bg-amber-700 transition">
            Login
          </button>
        )}
      </Link>
    </nav>
  );
};

export default Navbar;
