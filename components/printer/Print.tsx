'use client'

import { useRef } from "react";
import { FaPrint } from "react-icons/fa";
import { ReactNode } from "react";
import { toast } from "sonner";

interface PrintableSectionProps {
  children: ReactNode;
  sectionId: string;
}

const PrintableSection = ({ children, sectionId }: PrintableSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const print = () => {
    if (window.print) {
      window.print();
    } else {
      toast.error("Print not supported in this environment");
      console.error("Print not supported in this environment");
    }
  };

  return (
    <div>
      <div ref={sectionRef} id={sectionId}>
        {children}
      </div>

      <button
        className="secondary__btn flex gap-2 font-semibold rounded text-green-400 px-2 py-1 my-3 mx-6"
        onClick={print}
      >
        <FaPrint />
        Print
      </button>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #${sectionId}, #${sectionId} * {
            visibility: visible;
          }
          #${sectionId} {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintableSection;
