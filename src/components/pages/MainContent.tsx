"use client";
import { useState } from "react";

const MainContent = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = ["Funny", "Troll", "Related", "Other"];

  const handleAddReel = async () => {
    try {
      if (!title || !link) {
        setError("Title and Link are required");
        return;
      }
      if (!isValidReelUrl(link)) {
        setError("Please enter a valid Instagram or Facebook Reel URL");
        return;
      }

      setIsLoading(true);
      setError("");

      const response = await fetch("/Api/reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          link,
          notes,
          categories: selectedCategories,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add reel");
        return;
      }

      setShowModal(false);
    } catch (err) {
      setError("Error adding reel");
    } finally {
      setIsLoading(false);
    }
  };

  function isValidReelUrl(url: string) {
    try {
      const parsed = new URL(url);

      if (
        (parsed.hostname.includes("instagram.com") &&
          (parsed.pathname.startsWith("/reel/") ||
            parsed.pathname.startsWith("/p/"))) ||
        (parsed.hostname.includes("facebook.com") &&
          (parsed.pathname.startsWith("/reel/") ||
            parsed.pathname.startsWith("/watch/") ||
            parsed.pathname.startsWith("/share/v/"))) ||
        (parsed.hostname.includes("web.facebook.com") &&
          (parsed.pathname.startsWith("/reel/") ||
            parsed.pathname.startsWith("/watch/") ||
            parsed.pathname.startsWith("/share/v/")))
      ) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // ✅ toggle helper
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="bg-rose-700 p-10 flex flex-col sm:flex-row items-center gap-6 ">
        <h1 className="text-white p-4 font-bold">Useful Buttons</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gray-300 text-black p-2 rounded-md cursor-pointer hover:bg-rose-500 hover:text-white w-max h-max min-w-[120px]"
        >
          Add Reel
        </button>

        {showModal && (
          <div
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-6 w-full max-w-md"
            >
              <h2 className="text-black p-4 font-bold">Add Reel</h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddReel();
                }}
                className="flex flex-col gap-4 items-start p-2 mb-5"
              >
                <div className="flex items-center w-full gap-2">
                  <label className="text-black w-20 font-bold text-2xl">
                    Title
                  </label>
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    placeholder="Title"
                    className="bg-gray-300 text-black p-2"
                  />
                </div>

                <div className="flex items-center w-full gap-2">
                  <label className="text-black w-20 font-bold text-2xl">
                    Link
                  </label>
                  <div className="flex flex-col flex-1 justify-center">
                    <input
                      onChange={(e) => {
                        const value = e.target.value;
                        setLink(value);
                        if (!isValidReelUrl(value)) {
                          setError(
                            "Please enter a valid Instagram or Facebook Reel URL"
                          );
                        } else {
                          setError("okay nice");
                        }
                      }}
                      type="url"
                      placeholder="Link"
                      className="bg-gray-300 text-black p-2 "
                    />
                    {error && (
                      <p
                        className={`${
                          error === "okay nice"
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm`}
                      >
                        {error}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2">
                  <label className="text-black w-20 font-bold text-2xl">
                    Category
                  </label>
                  <div className="text-black p-2 flex-col">
                    Select Category:
                    <div className="flex gap-4 mt-2 flex-wrap">
                      {categories.map((cat) => (
                        <label
                          key={cat}
                          className={`${
                            selectedCategories.includes(cat)
                              ? "bg-amber-600 text-white"
                              : ""
                          } flex items-center gap-1 cursor-pointer hover:bg-amber-600 hover:text-white p-2 rounded-md`}
                        >
                          <input
                            type="checkbox"
                            value={cat}
                            className="sr-only"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                          />
                          <span className="font-bold">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center w-full gap-2">
                  <label className="text-black w-20 font-bold text-2xl">
                    Notes
                  </label>
                  <textarea
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notes"
                    className="resize-y bg-gray-300 text-black p-2"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    type="button"
                    className="text-black font-bold p-2 cursor-pointer hover:bg-rose-500"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="text-black font-bold p-2 ml-2 cursor-pointer hover:bg-rose-500"
                  >
                    {isLoading ? "Adding..." : "Add Reel"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
