"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    user && CheckUser();
  }, [user]);

  const CheckUser = async () => {
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress,
      imageUrl: user?.imageUrl,
      name: user?.fullName,
    });

    console.log(result);
  };

  return (
    <div className="bg-gradient-to-r from-blue-200 via-white to-blue-200 min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full p-6 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={140}
            height={140}
            className="mr-3"
          />
        </div>
        <nav>
          <UserButton /> {/* Added UserButton here */}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-6xl font-extrabold leading-tight text-gray-800">
          Simplify <span className="text-red-500">PDF Note-Taking</span> <br />
          with <span className="text-blue-500">AI-Powered Tools</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          Transform your note-taking experience with our AI-driven PDF app.
          Extract insights, summaries, and annotations effortlessly from your
          documents in just a few clicks.
        </p>
        <div className="mt-10 flex flex-col md:flex-row gap-6">
          <Button
            size="lg"
            onClick={() => router.push("/dashboard")} // Redirect to dashboard
          >
            Start Now
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/learn-more">Learn More</Link>
          </Button>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-16 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 px-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800">
              The Lowest Price
            </h3>
            <p className="text-gray-600 mt-2">
              Affordable plans for everyone.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800">
              The Fastest on the Market
            </h3>
            <p className="text-gray-600 mt-2">
              Lightning-fast AI-powered insights.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800">The Most Loved</h3>
            <p className="text-gray-600 mt-2">
              Trusted by thousands of users worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-6xl mx-auto text-center">
          <p>© {new Date().getFullYear()} Logoipsum. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
