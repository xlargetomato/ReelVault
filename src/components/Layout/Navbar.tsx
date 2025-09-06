import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 text-center">
      this is navbar
      <Link href="/Login">
        <button className="text-white p-2 cursor-pointer bg-amber-600 rounded ml-4 hover:bg-amber-700 transition">
          Login
        </button>
      </Link>
    </nav>
  );
};

export default Navbar;
