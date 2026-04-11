// components/Navbar.tsx
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useEffect, useState } from "react";
import { PrimaryDropdown } from "./Dropdown";
import { Button } from "./buttons/Button";
import { Menu } from "lucide-react";
import { AVATAR } from "./ui/avatar";
import { logos } from "@/assets/images";
import { useAuth } from "@/store/hooks/useAuth";
import { Link } from "react-router-dom";
import UserLogButtons from "./UserLogger";
import { scrollToSection } from "@/lib/dom";

interface NavbarProps {
  isScrolled?: boolean;
  scrollToSection?: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const { user } = useAuth();
  console.log(user)
  const navItems = ["Squad", "Fixtures", "About", "Contact"];
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

   

  const isMobile = useIsMobile("md");
  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md py-3 shadow-md border-b border-gray-200"
          : "bg-white py-5 border-b border-gray-100"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => scrollToSection("home")}
        >
          <AVATAR src={logos.logoTrans} size={"md"} className="scale-125" />
          <span className="font-bold text-xl tracking-tight text-gray-800">
            Bunyeni<span className="text-emerald-600">FC</span>
          </span>
        </div>

        {!user && (
          <Link
            to={"/login"}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Join Us
          </Link>
        )}
        {isMobile ? (
          <PrimaryDropdown size={"icon-lg"} trigger={<Menu />}>
            <div className="grid py-3">
              {navItems.map((item) => (
                <Button
                  variant={"ghost"}
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  {item}
                </Button>
              ))}{" "}
              <UserLogButtons />
            </div>
          </PrimaryDropdown>
        ) : (
          <div className=" flex gap-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
              >
                {item}
              </button>
            ))}
            <UserLogButtons />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
