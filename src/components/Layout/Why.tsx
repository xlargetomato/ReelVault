"use client";
import { useState } from "react";

const Why = () => {
  const [popUp, setPopup] = useState<boolean>(false);

  return (
    <div className="">
      <button
        onClick={() => {
          setPopup(true);
          console.log(popUp);
        }}
        className=" text-white text-xs p-1  cursor-pointer bg-rose-600 rounded hover:bg-rose-700 transition"
      >
        why?
      </button>
      {popUp && (
        <div className="fixed z-30 bg-black flex flex-col p-4 items-center justify-center">
          <p className="text-black p-2 font-bold text-left text-xl ">
            BECAUSE WHY NOT ?
          </p>
          <p
            onClick={() => setPopup(false)}
            className="text-red-500 hover:cursor-pointer bg-white p-2 rounded my-2 hover:bg-rose-900"
          >
            Close
          </p>
        </div>
      )}
    </div>
  );
};

export default Why;
