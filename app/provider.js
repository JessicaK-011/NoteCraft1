"use client";
import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

function Provider({ children }) {
  // Destructure `children` from the props
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}

export default Provider;

