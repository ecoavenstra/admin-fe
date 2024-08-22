'use client';
import { useEffect, useState } from 'react';
import AppLayout from "./AppLayout";
import Dashboard from '../components/Dashboard';
import { useRouter } from "next/navigation";
import Loader from '@/components/Loader';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </div>
    
  );
}
