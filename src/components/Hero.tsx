import React from "react";
import Image from "next/image";
const Hero = () => {
  return (
    <div className="text-center my-20 text-3xl">
      <h1 className="text-black p-4 font-bold">
        Welcome want to save your reels ?
      </h1>
      <h2 className="text-black p-4 font-bold">Just Login or Register</h2>
      <h3 className="text-black p-4 font-bold">And Save your reels</h3>
      <h4 className="text-black p-4 font-bold">And Organize them</h4>
      <h4 className="text-black p-4 font-bold">And Search them</h4>
      <h4 className="text-black p-4 font-bold">And See other people reels</h4>
      <Image
        src={"/photos/reel.png"}
        width={500}
        height={500}
        alt="btats"
        className="mx-auto "
      />
    </div>
  );
};

export default Hero;
