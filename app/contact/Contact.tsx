'use client'

import { MotionWrapper } from "@/components/Animate/MotionWrapper";
import { Button } from "@/components/buttons/Button";
import { GlassmorphicGradient } from "@/components/Glasmorphic/Gradient";
import { Input, TextArea } from "@/components/input/Inputs";
import { SocialMediaHandles } from "@/components/SocialShare";
import React, { useState } from "react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for reaching out! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const data = [
    {
      label: "Park Address",
      value: "Bunyeni Sports Complex, Main Road, Konjiehi, Wa Metro District",
    },
    { label: "Email Us", value: "bunyenifc@gmail.com" },
    {
      label: "Call Us",
      value: "+233 55970 8485 | Office Hours: Mon-Fri 9AM-6PM",
    },
  ];

  return (
   <GlassmorphicGradient className="py-24 " gradient="accent" >
      <div id="contact" className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold tracking-wide uppercase text-sm">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4 ">
            Join the Family
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-6">
            {data.map((cd, index) => (
              <MotionWrapper index={index} key={cd.label} hoverEffect>
                <div className="flex gap-4 p-4 bg-primary/30 rounded-xl">
                  <div className="w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center shrink-0">
                    <i className="fas fa-map-marker-alt text-primary text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg ">{cd.label}</h3>
                    <p className="text-muted-foreground">{cd.value}</p>
                  </div>
                </div>
              </MotionWrapper>
            ))}

            <SocialMediaHandles />
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 border p-4 pt-8 border-t-4 border-t-primary rounded-2xl"
          >
            <Input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-5 py-3  "
              required
              name={"name"}
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-5 py-3  "
              required
              name={"email"}
            />
            <TextArea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-5 py-3 resize-none "
              required
              name={"message"}
            />
            <Button
              type="submit"
              className="h-12 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg w-full"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </GlassmorphicGradient>
  );
};

export default Contact;
