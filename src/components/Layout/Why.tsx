"use client";
import { useState } from "react";

const Why = () => {
  const [popUp, setPopup] = useState<boolean>(false);

  return (
    <div className="">
      <button
        onClick={() => {
          setPopup(true);
        }}
        className=" text-white text-xs p-1  cursor-pointer  bg-rose-600 rounded hover:bg-rose-700 transition"
      >
        why?
      </button>
      {popUp && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center 
               bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-white rounded p-6 text-center">
            <p className="text-black font-bold text-xl mb-4">
              BECAUSE WHY NOT ?
            </p>
            <button
              onClick={() => setPopup(false)}
              className="px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700 cursor-pointer transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Why;
