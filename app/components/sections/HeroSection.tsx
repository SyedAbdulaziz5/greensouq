"use client";
import landingPageImage from "@/public/landingPageImg.webp";
import landingPageImageMobile from "@/public/landingPageMobileImg.webp";

import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[50vh] sm:h-[65vh] md:h-[82vh] overflow-hidden mt-4 sm:mt-6">


      <div className="hidden md:block absolute inset-0 m-0 p-0">
        <Image
          src={landingPageImage}
          alt="GreenSouq - Your Plant Paradise"
          fill
          className="object-cover object-center m-0 p-0"
          priority
          sizes="100vw"
          quality={100}
        />
      </div>

      <div className="md:hidden absolute inset-0 m-0 p-0">
        <Image
          src={landingPageImageMobile}
          alt="GreenSouq - Your Plant Paradise"
          fill
          className="object-cover object-center m-0 p-0"
          priority
          sizes="100vw"
          quality={100}
        />
      </div>

     
    </section>
  );
}
