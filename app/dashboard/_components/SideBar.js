"use client";
import React from "react";
import Image from "next/image";
import { Layout, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import UploadPdfDialog from "./UploadPdfDialog";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname } from "next/navigation";
import Link from "next/link";

function SideBar() {
  const { user } = useUser();
  const path = usePathname();

  const GetUserInfo = useQuery(api.user.GetUserInfo, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  // Ensure fileList and GetUserInfo are loaded before rendering.
  if (!fileList || !GetUserInfo) {
    return <div>Loading...</div>;  // Show a loading message while data is being fetched.
  }

  return (
    <div className="shadow-md h-screen p-7">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={175}
        height={40}
        priority={true}
        style={{ width: "auto", height: "auto" }}
      />

      <div className="mt-10">
        <UploadPdfDialog isMaxFile={fileList?.length >= 5}>
          <Button className="w-full">+ Upload PDF</Button>
        </UploadPdfDialog>

        {/* Workspace Link */}
        <Link href="/dashboard">
          <div
            className={`flex gap-2 items-center p-2 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer ${
              path === "/dashboard" ? "bg-slate-200" : ""
            }`}
          >
            <Layout />
            <h2>Workspace</h2>
          </div>
        </Link>

        {/* Upgrade Link */}
        <Link href="/dashboard/upgrade">
          <div
            className={`flex gap-2 items-center p-2 mt-1 hover:bg-slate-100 rounded-lg cursor-pointer ${
              path === "/dashboard/upgrade" ? "bg-slate-200" : ""
            }`}
          >
            <Shield />
            <h2>Upgrade</h2>
          </div>
        </Link>
      </div>

      {/* Progress and File Upload Limit */}
      {!GetUserInfo?.upgrade && (
        <div className="absolute bottom-24 w-[90%]">
          <Progress value={(fileList?.length / 5) * 100} />
          <p className="text-sm mt-1">
            {fileList?.length} out of 5 PDFs uploaded
          </p>
          <p className="text-sm text-gray-400 mt-2">Upgrade to upload more PDFs</p>
        </div>
      )}
    </div>
  );
}

export default SideBar;
