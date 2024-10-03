/** @format */
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BlurImage from "@/public/blur.jpg";
import italiana from "@/lib/italiana";
import Base64Image from "@/public/ImageBase64";

export default function FlowersLimit() {
  const [flowers, setFlowers] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLoadFlowers = () => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL_PROD}/flower/list/?limit=7`)
      .then((res) => {
        setFlowers((prev) => res?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!flowers) handleLoadFlowers(1);
  });
  return (
    <div className="w-full p-4">
      <h1 className={`text-3xl font-bold p-4 ${italiana.className}`}>
        Top Selling Flowers
      </h1>
      <Link href="/"></Link>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-8/12 sm:w-6/12 md:w-10/12 lg:w-[95%] mx-auto"
      >
        <CarouselContent>
          {loading
            ? Array(4)
                .fill(0)
                .map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 cursor-move select-none"
                  >
                    <div className="max-w-[350px] space-y-4 rounded-lg bg-white p-6 shadow-lg md:w-[350px] dark:bg-[#18181B] mx-auto">
                      <picture className="rounded-lg overflow-hidden block">
                        <div
                          width={200}
                          height={200}
                          className="h-[275px] w-[350px] rounded-lg object-cover hover:scale-110 ease-linear animate-pulse bg-lime-50"
                        />
                      </picture>
                      <div className="grid gap-2">
                        <h1 className="text-lg font-semibold bg-lime-50 animate-pulse">
                          <span className="opacity-0">
                            Lorem ipsum dolor sit amet consectetur adip
                          </span>
                        </h1>
                        <p className="text-sm bg-lime-50 animate-pulse">
                          <span className="opacity-0">
                            Lorem ipsum dolor sit amet consectetur adip Lorem
                            ipsum dolor sit amet consectetur
                          </span>
                        </p>
                        <div className="text-2xl font-semibold bg-lime-50 animate-pulse">
                          <span className="opacity-0">৳ 500</span>
                        </div>
                      </div>
                      <div className="flex gap-4 bg-lime-50 animate-pulse w-auto">
                        <button className="text-base border-2 border-lime-800 py-2 px-4 rounded-md hover:bg-lime-800 hover:text-white transition ease-in-out duration-500 mt-4 w-4/6 opacity-0">
                          View Details
                        </button>
                      </div>
                    </div>
                  </CarouselItem>
                ))
            : flowers?.results?.map((flower) => (
                <CarouselItem
                  key={flower?.id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 cursor-move select-none"
                >
                  <div
                    id={`slide${flower?.id}`}
                    className="max-w-[350px] space-y-4 rounded-lg bg-white p-6 shadow-lg md:w-[340px] dark:bg-[#18181B]"
                  >
                    <picture className="rounded-lg overflow-hidden block">
                      <Image
                        width={200}
                        height={200}
                        className="h-[275px] w-[350px] rounded-lg object-cover hover:scale-110 ease-linear duration-200"
                        src={flower?.image_url || BlurImage}
                        alt={flower?.title}
                        placeholder="blur"
                        blurDataURL={Base64Image}
                      />
                    </picture>
                    <div className="grid gap-2">
                      <h1 className="text-lg font-semibold">
                        {flower?.title?.length <= 30
                          ? flower?.title
                          : flower?.title?.slice(0, 30) + "..."}
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-white/60">
                        {flower?.description?.slice(0, 65)}...
                      </p>
                      <div className="text-2xl font-semibold">
                        ৳{flower?.price}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Link className="w-4/6" href={`/flower/${flower?.id}`}>
                        <button className="text-base border-2 border-lime-800 py-2 px-4 rounded-md hover:bg-lime-800 hover:text-white transition ease-in-out duration-500 mt-4">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
