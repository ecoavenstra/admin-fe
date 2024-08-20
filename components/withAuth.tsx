'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (Component : any) => {
  return function ProtectedComponent(props : any) {
    const router = useRouter();

    useEffect(() => {
      if (!localStorage.getItem("token")) {
        router.push("/login");
      }
    }, [router]);

    // Render the component if authenticated
    return localStorage.getItem("token") ? <Component {...props} /> : null;
  };
};

export default withAuth;
