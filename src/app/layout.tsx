import type { Metadata } from "next"; // Import the Metadata type from Next.js for defining page metadata
import { ClerkProvider } from "@clerk/nextjs"; // Import ClerkProvider for authentication context
import Navbar from "@/components/Navbar"; // Import the Navbar component
import { Toaster } from "@/components/ui/toaster"; // Import the Toaster component for notifications
import { Lato } from "next/font/google"; // Import the Lato font from Google Fonts
import "./globals.css"; // Import global CSS styles

// Configure the Lato font with specific subsets and weights
const lato = Lato({
  subsets: ["latin"], // Use the Latin subset of the font
  weight: ["400", "700"], // Use font weights 400 and 700
  variable: "--font-roboto", // Define a CSS variable for the font
});

// Define metadata for the application
export const metadata: Metadata = {
  title: "Youtube Idea Generator", // Set the title of the application
  description: "Generate fresh ideas for your YouTube content", // Set the description of the application
};

// Define the RootLayout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Define the type for children prop
}>) {
  return (
    <ClerkProvider> {/* Wrap the application in ClerkProvider for authentication */}
      <html lang="en"> {/* Set the language of the document to English */}
        <body className={`${lato.className} bg-gray-50`}> {/* Apply the Lato font and a background color */}
          <div className="max-w-6xl mx-auto min-h-screen"> {/* Center the content and set a max width */}
            <Navbar /> {/* Render the Navbar component */}
            {children} {/* Render the children passed to the layout */}
            <Toaster /> {/* Render the Toaster component for notifications */}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
