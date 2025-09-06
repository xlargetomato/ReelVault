import Link from "next/link";

export default function Login() {
  return (
    <div>
      <form>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="text-black text-4xl font-bold">Login</h1>
          <div className="flex flex-col gap-4 bg-rose-700 p-10 rounded-md">
            <label>E-Mail</label>
            <input
              className="p-2 rounded-md bg-red-300 text-black placeholder-black"
              type="email"
              placeholder="E-Mail"
            />
            <label>Passowrd</label>
            <input
              className="p-2 rounded-md bg-red-300 text-black placeholder-black"
              type="password"
              placeholder="Password"
            />
            <button
              className="bg-gray-300 text-black p-2 rounded-md cursor-pointer hover:bg-rose-500"
              type="submit"
            >
              Login
            </button>
            <Link href="/Register">
              <p className=" hover:text-rose-500">Dont have account ?</p>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
