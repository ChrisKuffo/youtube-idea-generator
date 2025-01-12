"use client"; // Indicates that this component is a client-side component

import Image from "next/image"; // Import Image component for optimized images
import Link from "next/link"; // Import Link component for client-side navigation
import { useState, useEffect } from "react"; // Import React hooks for state and side effects
import { formatDistanceToNow } from "date-fns"; // Import function to format dates
import { Video } from "@/server/db/schema"; // Import Video type for type safety
import { Button } from "@/components/ui/button"; // Import a custom Button component
import { scrapeVideos } from "@/server/youtube-actions"; // Import function to scrape videos
import { useToast } from "@/hooks/use-toast"; // Import custom hook for toast notifications
import { formatCount } from "@/lib/utils"; // Import utility function to format large numbers
import { Loader2, TvMinimal } from "lucide-react"; // Import icons for UI elements

// Define the VideoList component
export default function VideoList({
  initialVideos,
}: {
  initialVideos: Video[];
}) {
  const [isScraping, setIsScraping] = useState(false); // State to track if scraping is in progress
  const [videos, setVideos] = useState(initialVideos); // State to store the list of videos
  const { toast } = useToast(); // Destructure toast function from useToast hook

  // Function to handle video scraping
  const handleScrape = async () => {
    setIsScraping(true); // Set scraping state to true
    try {
      const newVideos = await scrapeVideos(); // Scrape new videos
      setVideos((prevVideos) => [...newVideos, ...prevVideos]); // Update state with new videos
      toast({
        title: "Scrape Successful",
        description: `Scraped ${newVideos.length} new videos`,
      }); // Show success toast
    } catch (error) {
      console.error("Error scraping videos:", error); // Log any errors
      let errorMessage = "An unknown error occurred";

      if (error instanceof Error) {
        if (error.message.includes("No channels found for the user")) {
          errorMessage =
            "Please add YouTube channels first by clicking settings in the top right.";
        } else {
          errorMessage = error.message;
        }
      }

      console.log("errorMessage", errorMessage);
      toast({
        title: "Scrape Failed",
        description: errorMessage,
        variant: "destructive",
      }); // Show error toast
    } finally {
      setIsScraping(false); // Set scraping state to false
    }
  };

  // Effect to update videos when initialVideos prop changes
  useEffect(() => {
    setVideos(initialVideos);
  }, [initialVideos]);

  // Render when there are no videos
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 space-y-5">
        <div className="bg-red-50 rounded-xl p-3">
          <TvMinimal className="h-11 w-11 text-red-500" strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900">No videos yet</h3>
        <p className="text-gray-500 text-center max-w-md">
          Please add YouTube channels and then scrape for videos. Video comments
          will be analyzed for content ideas.
        </p>
        <Button
          onClick={handleScrape}
          disabled={isScraping}
          className="bg-red-500 hover:bg-red-600 transition-all rounded-lg text-md font-semibold px-6 py-5"
        >
          {isScraping ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scraping...
            </>
          ) : (
            <>Scrape Videos</>
          )}
        </Button>
      </div>
    );
  }

  // Render the list of videos
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Videos</h1>
        <Button
          onClick={handleScrape}
          disabled={isScraping}
          className="bg-red-500 hover:bg-red-600 transition-all rounded-lg text-md font-semibold px-6 py-3"
        >
          {isScraping ? "Scraping..." : "Scrape"}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/video/${video.id}`}
            className="group block"
          >
            <div className="rounded-2xl overflow-hidden border bg-white shadow-sm p-4 space-y-3 hover:scale-[1.05] transition-all duration-300">
              <div className="aspect-video relative">
                {video.thumbnailUrl ? (
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No thumbnail</span>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <h2 className="font-semibold line-clamp-2 group-hover:text-primary">
                  {video.title}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {video.channelTitle}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>
                    {video.viewCount ? formatCount(video.viewCount) : "0"} views
                  </span>
                  <span className="mx-1">•</span>
                  <span>
                    {formatDistanceToNow(new Date(video.publishedAt))} ago
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}