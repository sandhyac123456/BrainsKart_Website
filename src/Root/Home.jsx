import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <section
      className="flex flex-col justify-center items-center w-full h-[calc(100vh-60px)] relative text-center px-4"
      style={{
        backgroundImage: "url('/src/assets/s.jpeg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex flex-col items-center">
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to BrainsKart
        </h1>

        <p className="text-white w-[90%] md:w-[70%] text-base md:text-lg leading-relaxed font-semibold text-center mb-6">
          Discover the joy of seamless shopping with BrainsKart. From trendy fashion to daily essentials, explore curated collections for Men, Women, and Kids — all in one place. Enjoy smooth browsing, secure payments, and doorstep delivery. Shop smart. Shop BrainsKart!
        </p>

        <Link
          to="/register"
          className="bg-[#a8743c] text-white px-6 py-2 rounded-md text-lg font-bold hover:bg-[#8c5f2f] transition"
        >
          Shop Now
        </Link>

      </div>
    </section>
  );
}

export default Home;