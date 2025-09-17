"use client";
import { useEffect, useState } from "react";

type ReelType = {
  id: number;
  title: string;
  link: string;
  notes: string;
  categories: string[];
  createdAt: string;
  fbThumbnail?: string;
  instaThumbnail?: string;
};

const FetchReels = () => {
  const [reels, setReels] = useState<ReelType[]>([]);
  const [allReels, setAllReels] = useState<ReelType[]>([]);
  const [popUp, setPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isFacebookLink = (link: string) =>
    link.includes("facebook.com") || link.includes("fb.watch");

  const isInstagramLink = (link: string) => link.includes("instagram.com");

  const getFacebookThumbnail = async (link: string) => {
    try {
      const res = await fetch(
        `/Api/fb-thumbnail?url=${encodeURIComponent(link)}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("FB Thumbnail fetch error:", data.error);
        return null;
      }

      return data.thumbnail as string | null;
    } catch (err) {
      console.error("FB Thumbnail fetch error:", err);
      return null;
    }
  };

  const getInstagramThumbnail = async (link: string) => {
    try {
      const res = await fetch(
        `/Api/insta-thumbnail?url=${encodeURIComponent(link)}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Instagram thumbnail fetch error:", data.error);
        return null;
      }

      return data.thumbnail as string | null;
    } catch (err) {
      console.error("Instagram thumbnail fetch error:", err);
      return null;
    }
  };

  const fetchReels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/Api/reels", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data: ReelType[] = await response.json();
      if (!response.ok) {
        throw new Error((data as any).error || "Failed to fetch reels");
      }

      const reelsWithThumbs = await Promise.all(
        data.map(async (reel) => {
          let updatedReel = { ...reel };

          if (isFacebookLink(reel.link)) {
            // Try up to 3 times to get the Facebook thumbnail
            for (let i = 0; i < 3; i++) {
              const thumb = await getFacebookThumbnail(reel.link);
              if (thumb) {
                updatedReel.fbThumbnail = thumb;
                break;
              }
              if (i < 2)
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          } else if (isInstagramLink(reel.link)) {
            // Try up to 3 times to get the Instagram thumbnail
            for (let i = 0; i < 3; i++) {
              const thumb = await getInstagramThumbnail(reel.link);
              if (thumb) {
                updatedReel.instaThumbnail = thumb;
                break;
              }
              if (i < 2)
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }

          return updatedReel;
        })
      );

      setAllReels(reelsWithThumbs);
      setReels(reelsWithThumbs);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch reels"
      );
    } finally {
      setLoading(false);
    }
  };

  const getColor = (cat: string) => {
    switch (cat) {
      case "Funny":
        return "bg-green-700";
      case "Troll":
        return "bg-red-700";
      case "Related":
        return "bg-yellow-700";
      default:
        return "bg-black";
    }
  };

  const handleSearch = (query: string) => {
    const q = query.toLowerCase();
    if (q.trim() === "") {
      setReels(allReels);
    } else {
      setReels(
        allReels.filter(
          (reel) =>
            reel.title.toLowerCase().includes(q) ||
            reel.notes?.toLowerCase().includes(q) ||
            reel.link.toLowerCase().includes(q) ||
            reel.categories.some((cat: string) =>
              cat.toLowerCase().includes(q)
            ) ||
            new Date(reel.createdAt).toLocaleDateString().includes(q)
        )
      );
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  return (
    <div className="bg-gray-200 p-6 w-full mx-auto my-4">
      <h1 className="text-black p-4 font-bold text-center text-4xl ">Reels</h1>

      <div className="mb-4 flex gap-3 justify-center items-center">
        <label htmlFor="search" className="text-black p-1 ">
          Search
        </label>
        <input
          id="search"
          type="text"
          className="p-2 border border-black text-black rounded"
          placeholder="Search reels"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button
          onClick={() => setPopup(true)}
          className="p-2 border border-black text-black rounded hover:bg-rose-500 hover:text-white hover:cursor-help"
        >
          Info
        </button>
        {popUp && (
          <div className="fixed z-10 bg-black bg-opacity-70 flex flex-col p-4 items-center justify-center">
            <p className="text-white p-2 font-bold text-left text-xl ">
              - You can search on categories <br />
              - Notes you added <br />
              - Date you added the reel <br />
              - Title of the reel <br />- Link of the reel
            </p>
            <p
              onClick={() => setPopup(false)}
              className="text-rose-500 hover:cursor-pointer bg-white p-2 rounded my-2 hover:bg-rose-900"
            >
              Close
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-center p-4 mb-4">Error: {error}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className=" animate-bounce text-2xl border-t-2 border-b-2 text-gray-800 border-gray-700">
            {" "}
            wait itis loading...
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 items-center w-full overflow-x-auto">
          {reels.map((reel) => (
            <div
              className="bg-gray-200  shadow-2xl border-4 border-gray-300 border-b-gray-900 p-2 min-w-[310px]"
              key={reel.id}
            >
              <h2 className="font-bold text-black">{reel.title}</h2>

              <div className="mb-2 text-sm text-gray-500">
                {Array.isArray(reel.categories) &&
                  reel.categories.map((cat) => (
                    <span
                      key={cat}
                      className={`px-2 text-white mr-1 rounded ${getColor(
                        cat
                      )}`}
                    >
                      {cat}
                    </span>
                  ))}
              </div>

              <p className="text-gray-600">
                {new Date(reel.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600">{reel.notes}</p>

              <div className="relative w-full h-[400px] bg-gray-200 flex items-center justify-center overflow-hidden">
                {isFacebookLink(reel.link) ? (
                  reel.fbThumbnail ? (
                    <img
                      src={reel.fbThumbnail}
                      alt="Facebook thumbnail"
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/photos/hero.png";
                      }}
                      onClick={() => window.open(reel.link, "_blank")}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-500 mb-2">
                        No Facebook thumbnail available
                      </p>
                      <img
                        src="/photos/hero.png"
                        alt="Fallback"
                        className="w-32 h-32 opacity-50"
                      />
                    </div>
                  )
                ) : isInstagramLink(reel.link) ? (
                  reel.instaThumbnail && reel.instaThumbnail !== "null" ? (
                    <img
                      src={reel.instaThumbnail}
                      alt="Instagram thumbnail"
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/photos/hero.png";
                      }}
                      onClick={() => window.open(reel.link, "_blank")}
                    />
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(reel.link, "_blank")}
                    >
                      <div className="bg-white rounded-full p-4 mb-2">
                        <svg
                          className="w-16 h-16 text-pink-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </div>
                      <p className="text-white font-semibold">Instagram Post</p>
                      <p className="text-white text-sm opacity-75">
                        Click to view
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-500 mb-2">Unsupported platform</p>
                    <img
                      src="/photos/hero.png"
                      alt="Fallback"
                      className="w-32 h-32 opacity-50"
                    />
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="bg-black bg-opacity-50 rounded-full p-4 pointer-events-auto cursor-pointer hover:bg-opacity-70 transition-all"
                    onClick={() => window.open(reel.link, "_blank")}
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <a
                href={reel.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-600 hover:text-blue-800"
              >
                Open Video
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FetchReels;
