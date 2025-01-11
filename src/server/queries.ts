"use server";

import { auth } from "@clerk/nextjs/server";
import { Video, Videos, YouTubeChannelType, YouTubeChannels, } from "./db/schema";
import { db } from "./db/drizzle";
import { eq } from "drizzle-orm";

export const getVideosForUser = async (): Promise<Video[]> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return db.select().from(Videos).where(eq(Videos.userId, userId));
};

export const getChannelsForUser = async (): Promise<YouTubeChannelType[]> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return db
    .select()
    .from(YouTubeChannels)
    .where(eq(YouTubeChannels.userId, userId));
};
