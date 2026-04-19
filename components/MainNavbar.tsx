"use client";

import { useState } from "react";
import {
  Menu,
  Search,
  Home,
  Users,
  User,
  CalendarDays,
  Megaphone,
  ShieldCheck,
  Clapperboard,
  Images,
  Mail,
  Info,
  Trophy,
  Heart,
  Star,
} from "lucide-react";
import { Drawer } from "@/components/headlessUI/Drawer";
import { AVATAR } from "@/components/ui/avatar";
import { logos } from "@/assets/images";
import { scrollToSection } from "@/lib/dom";
import { Button } from "@/components/buttons/Button";
import { fireEscape } from "@/hooks/Esc";
import UserLogButtons from "./UserLogger";

import { ThemeModeToggle } from "./ThemeToggle";
import { GlobalSearch } from "./searcher/Global";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogoutBtn } from "./auth/Auth";

interface ILink {
  label: string;
  href?: string;
  id?: string;
  icon: React.ReactNode;
}

export default function MainNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname == "/";
  const router = useRouter();

  const mainpage = pathname.split("/")[1] || "Home";

  const navLinks: ILink[] = [
    { label: "Home", href: "/", icon: <Home size={18} /> },
    {
      label: "Squad",
      //  id: "squad",
      href: "/squad",
      icon: <Users size={18} />,
    },
    {
      label: "Players",
      // id: "players",
      href: "/players",
      icon: <User size={18} />,
    },
    {
      label: "Fixtures",
      // id: "fixtures",
      href: "/matches",
      icon: <CalendarDays size={18} />,
    },
    { label: "News", href: "/news", icon: <Megaphone size={18} /> },
    { label: "Teams", href: "/teams", icon: <ShieldCheck size={18} /> },
    {
      label: "Highlights",
      href: "/highlights",
      icon: <Clapperboard size={18} />,
    },
    { label: "Gallery", href: "/gallery", icon: <Images size={18} /> },
    { label: "Contact", href: "/contact", icon: <Mail size={18} /> },
    {
      label: "About",
      //  id: "about",
      href: "/about",
      icon: <Info size={18} />,
    },
  ];

  if (pathname.startsWith("/admin")) return;
  return (
    <>
      <nav className="bg-accent backdrop-blur-xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start items-center h-16 text-">
            {/* Left Section - Menu Button (Mobile) */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-md hover:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className=" pl-6 mr-auto uppercase text-sm font-semibold">
              {mainpage}
            </div>

            {/* Left Section - Desktop Spacer */}
            <div className="hidden lg:block w-10" />

            {/* Logo - Centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4">
              <AVATAR
                src={logos.logoTrans as string}
                size={"md"}
                className="scale-110 bg-accent/90 backdrop-blur-3xl drop-shadow-accent drop-shadow-md"
              />
            </div>

            {/* Right Section - User & Search */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <Button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-md transition-colors"
                variant={"ghost"}
              >
                <Search className="h-5 w-5" />
              </Button>

              <UserLogButtons />
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links (Optional) */}
        <div className="hidden lg:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center space-x-8 h-10">
              {navLinks.map((link) => {
                if (link.id && isLanding)
                  return (
                    <div
                      key={link.label}
                      onClick={() => scrollToSection(link.id)}
                      className="inline-flex items-center px-1 pt-1 text-sm font-light hover:text-primary border-transparent border-b-2 hover:border-primary transition-colors cursor-pointer "
                    >
                      {link.label}
                    </div>
                  );
                if (link.href)
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="inline-flex items-center px-1 pt-1 text-sm font-light hover:text-primary border-transparent border-b-2 hover:border-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <Drawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        position="bottom"
        size="sm"
        title={
          <div className=" flex items-center gap-4 font-bold">
            <AVATAR
              src={logos.logoTrans as string}
              size={"md"}
              className="scale-110 bg-white/90 backdrop-blur-3xl drop-shadow-accent drop-shadow-md"
            />
            {`/ ${mainpage.toUpperCase()}`}
          </div>
        }
        className=" max-h-[75vh]"
      >
        <nav className="flex flex-col p-4 divide-y divide-border">
          {navLinks.map((item) => {
            if (item.href == pathname) return;
            return (
              <Button
                key={item.label}
                onClick={() => {
                  if (item?.id && isLanding) {
                    scrollToSection(item?.id as string);
                  } else {
                    router.push(item?.href as string);
                  }
                  fireEscape();
                }}
                className="flex items-center gap-2 px-3 my-2 transition-colors font-medium justify-start py-3 rounded-none"
                variant={"link"}
              >
                <div className="p-3 bg-accent rounded-md ">{item.icon}</div>{" "}
                {item.label}
              </Button>
            );
          })}

          <div className="flex items-center gap-4 py-2 pl-4 pt-5">
            <ThemeModeToggle />

            <LogoutBtn text="Logout" className="grow" />
          </div>
        </nav>
      </Drawer>

      {/* Search Drawer */}
      <Drawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        position="right"
        size="md"
        title="Search"
      >
        <div className="p-4">
          <GlobalSearch />
        </div>
      </Drawer>
    </>
  );
}
//  {/* <PrimarySearch placeholder="Search players, articles, and more..." />

//           <div className="mt-6">
//             <h3 className="text-sm font-medium text-gray-500">
//               Recent Searches
//             </h3>
//             <div className="mt-2 space-y-2">
//               {["player", "match", "article"].map((search) => (
//                 <Button
//                   key={search}
//                   className="block w-full text-left px-2 py-1 text-sm rounded"
//                 >
//                   {search}
//                 </Button>
//               ))}
//             </div>
//           </div> */}
