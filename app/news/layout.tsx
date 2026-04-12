import Breadcrumbs from "@/components/Breadcrumbs";
import { FC, ReactNode } from "react";

const NewsLayout  = ({ children }:{children:ReactNode}) => {
  return (
    <>
      <div>
        <main className="relative grow">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </>
  );
};

export default NewsLayout;
