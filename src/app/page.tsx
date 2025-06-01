"use client";

import assets from "@/assets";
import Image from "next/image";
import "./page.css";

const Home = () => {
  return (
    <section className="home-wrapper">
      <Image src={assets.img_home_page} alt="home-page" className="image" />
      <section className="right-wrapper">
        <h2 className="home-text">Big ideas start with small notes.</h2>
        <h2 className="home-text">Write it down. Organize it. Never lose a thought.</h2>
        <h2 className="home-text">Welcome to your thinking space.</h2>
      </section>
    </section>
  );
};

export default Home;

