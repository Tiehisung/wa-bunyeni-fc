"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CiMenuBurger } from "react-icons/ci";
import { VscClose } from "react-icons/vsc";
import { usePathname } from "next/navigation";
 

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  closed: {
    x: "-100vw",
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const SideDrawerToRight = ({
  className = "bg-secondary _hover",
  trigger,
  children,
}: {
  className?: string;
  trigger?: ReactNode;
  children: ReactNode;
}) => {
  const pathname = usePathname() 
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  return (
    <>
      <button
        onClick={toggleDrawer}
        className={`text-3xl shadow-sm rounded p-1 slowTrans md:hidden ${className}`}
      >
        {(trigger ?? isOpen) ? <VscClose /> : <CiMenuBurger />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              zIndex: 50,
            }}
            // className="bg-modalOverlay"
            onClick={toggleDrawer}
          >
            <motion.div
              initial={{ x: "-100vw", opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { duration: 0.051 } }}
              exit={{ x: "-100vw", opacity: 0 }}
              className="_secondaryBg w-72 md:w-96 max-h-screen overflow-y-auto py-3 rounded-r-md "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer content here */}
              {children}
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
      {isOpen && <div className="bg-[black]/10 z-10 fixed inset-0" />}
    </>
  );
};

export default SideDrawerToRight;
