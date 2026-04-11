'use client'

import { ReactNode, useState } from "react";
import { useActionOnEsc } from "@/hooks/Esc";
 
import { useUpdateSearchParams } from "@/hooks/params";
import { Button } from "../buttons/Button";
import { cn } from "@/lib/utils";
import { TButtonSize, TButtonVariant } from "../ui/button";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";

export const StackModal = ({
  children,
  className,
  id,
  overlayClassName,
  closeOnEsc,
  trigger,
  header = "",
  size,
  variant,
  triggerStyles,
  hideCloseButton,
  rounded = true,
}: {
  children: ReactNode;
  className?: string;
  id: string;
  overlayClassName?: string;
  closeOnEsc?: boolean;
  hideCloseButton?: boolean;
  triggerStyles?: string;
  trigger?: ReactNode;
  header?: ReactNode;
  variant?: TButtonVariant;
  size?: TButtonSize;
  rounded?: boolean;
}) => {
 
  const searchParams = useSearchParams()
  const modalId = searchParams.get("stackModal");

  const { clearParams, setParam } = useUpdateSearchParams();

  const isOpen = id === modalId;

  //Cater for the little lag in setting param
  const [loading, setLoading] = useState(false);

  useActionOnEsc({
    onEscape() {
      if (closeOnEsc) clearParams("stackModal");
    },
  });

  return (
    <>
      {trigger ? (
        <Button
          variant={variant}
          size={size}
          className={cn(`cursor-pointer`, triggerStyles)}
          onClick={() => {
            setParam("stackModal", id);
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
            }, 2000);
          }}
          waiting={!modalId && loading}
          waitingText="Please wait..."
          id={id}
        >
          {trigger}
        </Button>
      ) : (
        <input
          type="checkbox"
          name=""
          id={id}
          checked={isOpen}
          hidden
          onChange={(c) => {
            if (c.target.checked) {
              setParam("stackModal", id);
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
              }, 50);
            }
          }}
        />
      )}
      {isOpen && (
        <div
          onClick={() => clearParams("stackModal")}
          className={`z-50 fixed inset-0 bg-linear-to-b from-modalOverlay to-accent flex justify-start items-center h-screen ${overlayClassName}`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative bg-card space-y-3.5 py-1.5 mt-auto rounded-to-3xl max-h-[90vh] min-h-[90vh] mx-auto grow",
              rounded ? "rounded-t-3xl overflow-hidden" : "",
            )}
          >
            {header && !hideCloseButton && (
              <header className="flex items-center gap-3 justify-between border-b border-border">
                {header && <header className="px-5">{header}</header>}
                {!hideCloseButton && (
                  <Button
                    size="icon-sm"
                    onClick={() => clearParams("stackModal")}
                    className="ml-auto mr-1.5"
                    variant="ghost"
                  >
                    <X />
                  </Button>
                )}
              </header>
            )}

            <main
              className={cn(
                `max-h-[85vh] overflow-y-auto px-2 md:px-[2vw] pb-14 min-w-[60vw]`,
                className,
              )}
            >
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
};
