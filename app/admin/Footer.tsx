"use client";

import Link from "next/link";

const links = [
  { label: "Home", path: "/" },
  { label: "Logout", path: "/api/auth/signout?callbackUrl=/" },
  { label: "Logs", path: "/admin/logs" },
  { label: "News", path: "/admin/news" },
  { label: "Matches", path: "/admin/matches" },
  { label: "Squad", path: "/admin/squad" },
  { label: "Gallery", path: "/admin/gallery" },
  { label: "Highlights", path: "/admin/highlights" },
  { label: "Settings", path: "/admin/settings" },
];

const AdminFooter = () => {
  return (
    <footer className="w-full bg-accent border-t border-border">
      <div className="container mx-auto px-4 py-8">
        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 auto-rows-fr">
          {links.map((link, i) => (
            <Link
              key={i}
              href={link.path}
              className={`
                flex items-center justify-center
                px-4 py-3 rounded-lg
                bg-background/50 hover:bg-background
                border border-border/50 hover:border-border
                text-foreground/80 hover:text-foreground
                font-medium text-sm
                transition-all duration-200
                hover:shadow-md hover:-translate-y-0.5
                active:translate-y-0 active:shadow-sm
                focus:outline-none focus:ring-2 focus:ring-primary/50
              `}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
