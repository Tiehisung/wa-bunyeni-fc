"use client";

import { LogoutBtn } from "@/components/auth/Auth";
import { ThemeModeToggle } from "@/components/ThemeToggle";
import { AVATAR } from "@/components/ui/avatar";
import { TEAM } from "@/data/team";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Footer: React.FC = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return;
  return (
    <footer className="py-8 bg-accent ">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AVATAR src={TEAM.logo} size={"sm"} />
              <span className="font-bold">
                Bunyeni <span className="text-primary">FC</span>
              </span>
            </div>
            <p className="text-sm ">
              Building champions, uniting communities since 2024.
            </p>

            <div className="flex items-center gap-3 ">
              <LogoutBtn />
              <ThemeModeToggle />
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  About Club
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-primary transition">
                  News
                </Link>
              </li>
              <li>
                <Link
                  href="/highlights"
                  className="hover:text-primary transition"
                >
                  Highlights
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-primary transition">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  Fans
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="hover:text-primary transition"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
              Official Partners
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="">Zenis Water, Konjiehi</li>
              <li className="">Miami Camp, Konjiehi</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>
            © 2025 Bunyeni Football Club. All rights reserved. Built with
            passion for the beautiful game.
          </p>
          <p className="mt-2">
            <Link href="#" className="hover:text-primary transition">
              Privacy Policy
            </Link>{" "}
            •
            <Link href="#" className="hover:text-primary transition ml-2">
              Terms of Use
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
