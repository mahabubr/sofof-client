"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const user = Cookies.get("user");
    
    if (!user) {
      router.replace("/");
    }
  }, [router]);

  return <div className="container w-11/12 mx-auto my-20">{children}</div>;
};

export default Layout;
