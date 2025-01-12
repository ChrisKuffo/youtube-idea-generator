import VideoDetail from "@/components/VideoDetail"; // Import the VideoDetail component to display video details and comments
import { getVideoWithComments } from "@/server/queries"; // Import the function to fetch a video and its comments
import { notFound } from "next/navigation"; // Import the notFound function to handle 404 errors

// Define the Props interface for the component's props
interface Props {
  params: Promise<{
    id: string; // The video ID passed as a parameter
  }>;
}

// Define the VideoPage component as an asynchronous function
export default async function VideoPage({ params }: Props) {
  // Resolve the params promise to get the video ID
  const resolvedParams = await params;
  // Fetch the video and its comments using the video ID
  const result = await getVideoWithComments(resolvedParams.id);

  // If no result is found, trigger a 404 error
  if (!result) {
    notFound();
  }

  // Destructure the video and comments from the result
  const { video, comments } = result;

  // Return the main content of the page
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Main container with responsive padding and centered content */}
      <VideoDetail video={video} comments={comments} />
      {/* Render the VideoDetail component, passing the video and comments as props */}
    </main>
  );
}