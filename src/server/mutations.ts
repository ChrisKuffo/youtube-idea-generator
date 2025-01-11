"use server";

// Import necessary modules and functions
import { auth } from "@clerk/nextjs/server"; // Authentication module
import { YouTubeChannels, YouTubeChannelType } from "./db/schema"; // Database schema for YouTube channels
import { db } from "./db/drizzle"; // Database module
import { and, eq } from "drizzle-orm"; // ORM functions for query building

// Function to add a YouTube channel for an authenticated user
export const addChannelForUser = async (
  name: string // Name of the YouTube channel to add
): Promise<YouTubeChannelType> => {
  const { userId } = await auth(); // Get the authenticated user's ID

  if (!userId) {
    // Check if the user is authenticated
    throw new Error("User not authenticated"); // Throw an error if not authenticated
  }

  // Insert a new channel into the database for the user
  const [newChannel] = await db
    .insert(YouTubeChannels) // Specify the table to insert into
    .values({
      name, // Channel name
      userId, // User ID
    })
    .returning(); // Return the inserted channel

  return newChannel; // Return the newly added channel
};

// Function to remove a YouTube channel for an authenticated user
export const removeChannelForUser = async (
  id: string // ID of the YouTube channel to remove
): Promise<void> => {
  const { userId } = await auth(); // Get the authenticated user's ID

  if (!userId) {
    // Check if the user is authenticated
    throw new Error("User not authenticated"); // Throw an error if not authenticated
  }

  // Delete the channel from the database for the user
  await db
    .delete(YouTubeChannels) // Specify the table to delete from
    .where(
      and(
        eq(YouTubeChannels.id, id), // Match the channel ID
        eq(YouTubeChannels.userId, userId) // Match the user ID
      )
    );
};