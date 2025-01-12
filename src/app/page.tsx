import Link from "next/link"; // Import the Link component from Next.js for client-side navigation
import { Button } from "@/components/ui/button"; // Import a custom Button component
import { CheckCircle } from "lucide-react"; // Import the CheckCircle icon from the lucide-react library

// Define the WelcomePage component
export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      {/* Center the content vertically and horizontally with padding */}
      <div className="text-center space-y-6 max-w-3xl">
        {/* Center text with spacing between elements and a maximum width */}
        <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 leading-tight">
          {/* Large, bold heading with a gradient text effect */}
          Transform Your YouTube
          <br /> Content Strategy
        </h1>

        <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
          {/* Subheading with a smaller font size and gray color */}
          Generate fresh, engaging ideas for your YouTube channel in seconds.
          Never run out of content again!
        </p>

        <div className="flex flex-row items-center justify-center gap-4 pt-4">
          {/* Flex container for the button and additional text */}
          <Link href="/videos">
            {/* Link to the /videos page */}
            <Button
              size="lg"
              className="font-semibold text-lg px-8 py-6 bg-gradient-to-t from-red-600 to-red-400 hover:opacity-90 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.03]"
            >
              {/* Large button with gradient background and hover effects */}
              Get Started Free →
            </Button>
          </Link>
          <p className="text-sm text-gray-500">No credit card required</p>
          {/* Small text indicating no credit card is needed */}
        </div>

        <div className="pt-8 flex items-center justify-center gap-8">
          {/* Flex container for feature highlights */}
          <div className="flex items-center gap-2">
            {/* Feature item with icon and text */}
            <CheckCircle className="text-red-500 h-5 w-5" />
            <span className="text-gray-600">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-red-500 h-5 w-5" />
            <span className="text-gray-600">Instant Results</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-red-500 h-5 w-5" />
            <span className="text-gray-600">Free to Try</span>
          </div>
        </div>
      </div>
    </div>
  );
}