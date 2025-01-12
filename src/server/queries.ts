"use server";

import { auth } from "@clerk/nextjs/server";
import {
  Idea,
  Ideas,
  Video,
  VideoComments,
  Videos,
  YouTubeChannels,
  YouTubeChannelType,
} from "./db/schema";
import { db } from "./db/drizzle";
import { eq, and, desc } from "drizzle-orm";

// Function to get all videos for the authenticated user
export const getVideosForUser = async (): Promise<Video[]> => {
  // Authenticate the user and retrieve the user ID
  const { userId } = await auth();

  // If no user ID is found, throw an error indicating the user is not authenticated
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Query the database to select all videos associated with the authenticated user
  return db.select().from(Videos).where(eq(Videos.userId, userId));
};

// Function to get all YouTube channels for the authenticated user
export const getChannelsForUser = async (): Promise<YouTubeChannelType[]> => {
  // Authenticate the user and retrieve the user ID
  const { userId } = await auth();

  // If no user ID is found, throw an error indicating the user is not authenticated
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Query the database to select all YouTube channels associated with the authenticated user
  return db
    .select()
    .from(YouTubeChannels)
    .where(eq(YouTubeChannels.userId, userId));
};

// Function to get a specific video and its comments for the authenticated user
export const getVideoWithComments = async (
  videoId: string
): Promise<{
  video: Video;
  comments: (typeof VideoComments.$inferSelect)[];
} | null> => {
  // Authenticate the user and retrieve the user ID
  const { userId } = await auth();

  // If no user ID is found, throw an error indicating the user is not authenticated
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Query the database to select the video with the specified ID for the authenticated user
  const videos = await db
    .select()
    .from(Videos)
    .where(and(eq(Videos.id, videoId), eq(Videos.userId, userId)));

  // If no video is found, return null
  if (videos.length === 0) {
    return null;
  }

  // Get the first video from the result
  const video = videos[0];

  // Query the database to select all comments for the specified video
  const comments = await db
    .select()
    .from(VideoComments)
    .where(eq(VideoComments.videoId, videoId))
    .orderBy(VideoComments.publishedAt);

  // Return the video and its comments
  return { video, comments };
};

// Function to get all ideas for the authenticated user
export const getIdeasForUser = async (): Promise<Idea[]> => {
  // Authenticate the user and retrieve the user ID
  const { userId } = await auth();

  // If no user ID is found, throw an error indicating the user is not authenticated
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Query the database to select all ideas associated with the authenticated user, ordered by creation date
  return db
    .select()
    .from(Ideas)
    .where(eq(Ideas.userId, userId))
    .orderBy(desc(Ideas.createdAt));
};