"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/category");
  }, []);
  return <div className="text-center  ">home</div>;
}
