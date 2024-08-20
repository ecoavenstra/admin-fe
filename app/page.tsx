'use client'
import { useEffect } from 'react';
import AppLayout from "./AppLayout";
import Dashboard from '../components/Dashboard';
import { useRouter } from "next/navigation";
import Loader from '@/components/Loader';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

//   const handleLogout = () => {
if(!localStorage.getItem("token")){
  return(
    <div className="h-screen flex items-center justify-center">
      <Loader/>
    </div>
  )
}
  return (
    <div className="">
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </div>
  );
}
