import Link from "next/link";

export default function Register() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form className="bg-rose-700 p-10 flex flex-col gap-6 w-full max-w-md">
        <h1 className="text-white text-4xl font-bold text-center">Register</h1>

        <div className="flex items-center gap-4">
          <label className="w-32 text-left">E-Mail</label>
          <input
            className="flex-1 p-2 rounded-md bg-red-300 text-black placeholder-black"
            type="email"
            placeholder="E-Mail"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 text-left">Password</label>
          <input
            className="flex-1 p-2 rounded-md bg-red-300 text-black placeholder-black"
            type="password"
            placeholder="Password"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 text-left">Password Again</label>
          <input
            className="flex-1 p-2 rounded-md bg-red-300 text-black placeholder-black"
            type="password"
            placeholder="Password Again"
          />
        </div>

        <button
          className="bg-gray-300 text-black p-2 rounded-md cursor-pointer hover:bg-rose-500"
          type="submit"
        >
          Register
        </button>

        <Link href="/login">
          <p className="text-center hover:text-rose-500">
            Already have an account?
          </p>
        </Link>
      </form>
    </div>
  );
}
