"use client";

import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Dashboard() {
  const { user } = useUser();
  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  // Debugging fileList structure
  console.log("File List:", JSON.stringify(fileList, null, 2));

  // Check if fileList is still undefined or empty
  const isLoading = !fileList; // Check if fileList is undefined or loading
  const isEmpty = fileList?.length === 0; // Check if no files are present

  return (
    <div>
      <h2 className="font-medium text-3xl">Workspace</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-10">
        {isLoading ? (
          // Show a loading animation if the query is still loading
          [1, 2, 3, 4, 5, 6, 7].map((_, index) => (
            <div key={index} className="bg-slate-200 rounded-md h-[150px] animate-pulse"></div>
          ))
        ) : isEmpty ? (
          // Show "No PDFs uploaded yet" message if no PDFs are uploaded
          <div className="col-span-full text-center text-lg text-gray-500">
            No PDFs uploaded yet
          </div>
        ) : (
          // Display the file list if files are available
          fileList.map((file) => (
            <Link key={file.fileId} href={`/workspace/${file.fileId}`}>
              <div className="flex p-5 shadow-md rounded-md flex-col items-center justify-center border cursor-pointer hover:scale-105 transition-all">
                <Image src="/pdf.png" alt="file" width={70} height={50} />
                <h2 className="mt-3 font-medium text-lg">{file.fileName}</h2>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
 