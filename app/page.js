"use client"
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { UserButton ,useUser} from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const {user}=useUser();
  const createUser=useMutation(api.user.createUser);

  useEffect(()=>{
    user&&CheckUser();
  },[user])

  const CheckUser = async () => {
    // Log the user object for debugging
    // console.log("User object from Clerk:", user);
  
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress, // User's email
      imageUrl: user?.imageUrl, // User's profile image
      name: user?.fullName, // Map fullName to "name"
    });
  
    console.log(result);
  };
  return (
    <div>
      <h1>HEllo world!</h1>
      <Button>Save</Button>
      <UserButton></UserButton>
    </div>
  );
}
