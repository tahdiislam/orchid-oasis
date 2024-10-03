/** @format */

import italiana from "@/lib/italiana";
import Autumn from "@/public/autumn_flower.png";
import Wedding from "@/public/wedding_flower.png";
import Birthday from "@/public/birthday_flower.png";
import Image from "next/image";
import Link from "next/link";

export default function Categories() {
  return (
    <section className="px-10 md:px-20 lg:px-28">
      <h1
        className={`text-4xl md:text-5xl xl:text-6xl py-10 md:py-16 italic text-center ${italiana.className}`}
      >
        Shop by Popular Ocasions
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        <Link href="/flower/category/1">
          <picture className="overflow-hidden block ">
            <Image
              src={Autumn}
              alt="Autumn"
              className="w-full hover:scale-125 duration-1000 sm:mt-20 lg:mt-36"
              placeholder="blur"
            />
          </picture>
          <h3
            className={`text-xl md:text-2xl xl:text-3xl pb-10 italic text-center py-3 ${italiana.className}`}
          >
            Autumn
          </h3>
        </Link>
        <Link href="/flower/category/2">
          <picture className="overflow-hidden block">
            <Image
              src={Wedding}
              alt="Autumn"
              className="w-full h-auto hover:scale-125 duration-1000"
              placeholder="blur"
            />
          </picture>
          <h3
            className={`text-xl md:text-2xl xl:text-3xl pb-10 italic text-center py-3 ${italiana.className}`}
          >
            Wedding
          </h3>
        </Link>
        <Link href="/flower/category/3">
          <picture className="overflow-hidden block">
            <Image
              src={Birthday}
              alt="Autumn"
              className="w-full h-auto hover:scale-125 duration-1000 sm:mt-20 lg:mt-36"
              placeholder="blur"
            />
          </picture>
          <h3
            className={`text-xl md:text-2xl xl:text-3xl pb-10 italic text-center py-3 ${italiana.className}`}
          >
            Birthday
          </h3>
        </Link>
      </div>
    </section>
  );
}
