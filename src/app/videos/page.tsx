import VideoList from "@/components/VideoList"; // Import the VideoList component to display a list of videos
import { getVideosForUser } from "@/server/queries"; // Import the function to fetch videos for the authenticated user

// Define the VideosPage component as an asynchronous function
export default async function VideosPage() {
  // Fetch the videos for the authenticated user
  const videos = await getVideosForUser();

  // Log the fetched videos to the console for debugging purposes
  console.log("videos", videos);

  // Return the main content of the page
  return (
    <main className="p-9">
      {/* Main container with padding */}
      <VideoList initialVideos={videos} />
      {/* Render the VideoList component, passing the fetched videos as initial data */}
    </main>
  );
}