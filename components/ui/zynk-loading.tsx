"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function ZynkLoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/logo.png" 
          alt="Zynk Logo"
          width={60}
          height={60}
        />
        <h1 className="text-2xl font-semibold tracking-tight">Zynk</h1>
      </div>

      {/* Social Icons */}
      <div className="flex items-center gap-4 opacity-90">
        <Image src="/X_logo.svg" alt="tiktok" width={26} height={26} />
      </div>

      {/* Loader */}
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-gray-500" size={30} />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
