import IdeaList from "@/components/IdeaList"; // Import the IdeaList component to display a list of ideas
import { getIdeasForUser } from "@/server/queries"; // Import the function to fetch ideas for the authenticated user

// Define the IdeasPage component as an asynchronous function
export default async function IdeasPage() {
  // Fetch the ideas for the authenticated user
  const ideas = await getIdeasForUser();

  // Return the main content of the page
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Main container with responsive padding and centered content */}
      <IdeaList initialIdeas={ideas} />
      {/* Render the IdeaList component, passing the fetched ideas as initial data */}
    </main>
  );
}