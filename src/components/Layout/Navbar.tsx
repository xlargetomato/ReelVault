"use client";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    <nav className="bg-gray-800 text-white p-4 text-center items-center flex flex-row justify-between">
      <Link href={"/"} className="font-bold text-xl">
        this is navbar by the way
      </Link>
      <Link
        href="/Main"
        className="font-bold text-xl hover:underline hover:text-gray-600"
      >
        Main Page
      </Link>
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
