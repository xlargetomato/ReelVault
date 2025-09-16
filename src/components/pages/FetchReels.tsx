"use client";
import { useEffect, useState } from "react";

const FetchReels = () => {
  const [reels, setReels] = useState<any[]>([]);
  const [isFacebook, setIsFacebook] = useState<boolean>(false);

  const fetchReels = async () => {
    try {
      const response = await fetch("/Api/reels", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(data.error || "Failed to fetch reels");
        return;
      }
      if (data.length > 0 && data[0].link.includes("facebook.com")) {
        setIsFacebook(true);
      }
      setReels(data);
    } catch (error) {
      return error;
    }
  };

  function getEmbedUrl(link: string) {
    try {
      const url = new URL(link);

      if (url.hostname.includes("instagram.com")) {
        if (
          url.pathname.startsWith("/reel/") ||
          url.pathname.startsWith("/p/")
        ) {
          return `https://www.instagram.com${url.pathname}embed/`;
        }
      }

      if (url.hostname.includes("facebook.com")) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
          link
        )}&show_text=false`;
      }

      return null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    fetchReels();
  }, []);

  return (
    <div className="bg-white p-6 w-full mx-auto my-4">
      <h1 className="text-black p-4 font-bold text-center text-4xl ">Reels</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full overflow-x-auto">
        {reels.map((reel: any) => (
          <div className="bg-white shadow p-2 min-w-[310px]" key={reel.id}>
            <h2 className="font-bold text-black">{reel.title}</h2>
            <p className="text-gray-600">{reel.notes}</p>
            <iframe
              src={getEmbedUrl(reel.link) || ""}
              width="100%"
              height="400"
              frameBorder="0"
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FetchReels;
