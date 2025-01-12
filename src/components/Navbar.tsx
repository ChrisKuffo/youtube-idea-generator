"use client"; // Indicates that this component is a client-side component

import Link from "next/link"; // Import the Link component for client-side navigation
import { UserButton } from "@clerk/nextjs"; // Import the UserButton component for user authentication actions
import { usePathname } from "next/navigation"; // Import usePathname hook to get the current path
import { cn } from "@/lib/utils"; // Import a utility function for conditional class names
import { useAuth } from "@clerk/nextjs"; // Import useAuth hook to check authentication status
import { Button } from "./ui/button"; // Import a custom Button component
import { SettingsModal } from "./SettingsModal"; // Import the SettingsModal component

// Define the Navbar component
export default function Navbar() {
  const pathname = usePathname(); // Get the current pathname
  const { isSignedIn } = useAuth(); // Check if the user is signed in

  return (
    <nav>
      <div className="py-8">
        {/* Add vertical padding to the navbar */}
        <div className="flex justify-between items-center">
          {/* Flex container to align items horizontally */}
          <Link href="/" className="flex items-center space-x-1">
            {/* Link to the home page with a logo */}
            <span className="text-xl font-semibold">YT</span>
            <span className="text-xl">✨</span>
          </Link>

          {isSignedIn && (
            <div className="flex items-center space-x-8 ml-auto mr-4 text-md">
              {/* Flex container for navigation links and user actions */}
              <Link
                href="/videos"
                className={cn(
                  "text-md",
                  pathname.startsWith("/videos")
                    ? "border-b-2 border-red-500 text-red-500"
                    : "text-primary hover:text-red-500 transition-all"
                )}
              >
                {/* Link to the videos page with conditional styling */}
                Videos
              </Link>
              <Link
                href="/ideas"
                className={cn(
                  "text-md",
                  pathname.startsWith("/ideas")
                    ? "border-b-2 border-red-500 text-red-500"
                    : "text-primary hover:text-red-500 transition-all"
                )}
              >
                {/* Link to the ideas page with conditional styling */}
                Ideas
              </Link>
              <SettingsModal />
              {/* Render the SettingsModal component */}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8", // Customize the size of the user avatar
                  },
                }}
              />
              {/* Render the UserButton for user authentication actions */}
            </div>
          )}
          {!isSignedIn && (
            <Link href="/videos">
              {/* Link to the videos page for unauthenticated users */}
              <Button className="font-semibold text-white bg-red-500 hover:bg-red-600">
                Get Started Now
              </Button>
              {/* Button to encourage users to get started */}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}