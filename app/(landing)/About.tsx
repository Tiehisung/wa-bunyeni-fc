"use client";

import { AnimateOnView } from "@/components/Animate/AnimateOnView";
import { GlassmorphicGradient } from "@/components/Glasmorphic/Gradient";
import React from "react";

const About: React.FC = () => {
  const stats = [
    { value: "5+", label: "Trophies" },
    { value: "25+", label: "Juvennile Players" },
    { value: "1k+", label: "Passionate Fans" },
    { value: `${new Date().getFullYear() - 2024}+`, label: "Years of Legacy" },
  ];

  const images = [
    {
      src: "https://res.cloudinary.com/djzfztrig/image/upload/v1774595311/assets-storage/k2ettykinlreegktkcth.jpg",
      alt: "Football action",
    },

    {
      src: "https://res.cloudinary.com/djzfztrig/image/upload/v1774595622/assets-storage/wt34apgcmz6rq04popyo.jpg",
      alt: "Fans cheering",
    },

    {
      src: "https://res.cloudinary.com/djzfztrig/image/upload/v1774595643/assets-storage/obhaffhmsy4ssjmbw2e2.jpg",
      alt: "Stadium",
    },
    {
      src: "https://res.cloudinary.com/djzfztrig/image/upload/v1774595545/assets-storage/r3rjmb1fao5q5xz4by4u.jpg",
      alt: "Team celebration",
    },
  ];
  return (
    <GlassmorphicGradient className="py-24" gradient="accent">
      <div id="about" className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold tracking-wide uppercase text-sm">
            Our Story
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 ">
            More Than a Club
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className=" text-lg leading-relaxed mb-6">
              Bunyeni FC was born from the dream of bringing world-class
              football to our community. With a rich heritage and a vision for
              excellence, we stand for determination, teamwork, and the
              beautiful game.
            </p>
            <p className="text-muted-foreground mb-8">
              From our academy to the first team, we nurture talent and create
              legends. Our philosophy combines attacking football with
              unwavering defensive discipline — a style that has won hearts
              across the region.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-primary">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center md:text-left">
                  <div className="text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <AnimateOnView key={index} index={index * 1.2} once={false}>
                {
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={`rounded-2xl w-full h-48 object-cover shadow-md ${index % 2 == 1 ? "mt-8" : ""}`}
                  />
                }
              </AnimateOnView>
            ))}
          </div>
        </div>
      </div>
    </GlassmorphicGradient>
  );
};

export default About;
