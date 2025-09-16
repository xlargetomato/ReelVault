import React from "react";
import Image from "next/image";
const Hero = () => {
  return (
    <div className="text-center my-20">
      <h1 className="text-black p-4 font-bold">This Is Hero Component</h1>
      <Image
        src={"/photos/hero.png"}
        width={500}
        height={500}
        alt="btats"
        className="mx-auto "
      />
    </div>
  );
};

export default Hero;
