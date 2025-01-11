"use server";

// Import necessary modules and functions
import { auth } from "@clerk/nextjs/server"; // Authentication module
import { db } from "@/server/db/drizzle"; // Database module
import { eq, and } from "drizzle-orm"; // ORM functions for query building
import {
  YouTubeChannels,
  Videos,
  VideoComments,
  Video,
  VideoComment,
} from "@/server/db/schema"; // Database schema
import { google, youtube_v3 } from "googleapis"; // Google APIs

// Initialize YouTube API client
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY, // API key from environment variables
});

// Function to get a channel ID from a channel name
async function getChannelId(channelName: string): Promise<string | null> {
  try {
    const response = await youtube.search.list({
      part: ["snippet"], // Request snippet part of the response
      type: ["channel"], // Search for channels
      q: channelName, // Query with the channel name
      maxResults: 1, // Limit results to 1
    });

    // Return the channel ID if found, otherwise null
    return response.data.items?.[0]?.id?.channelId || null;
  } catch (error) {
    console.error("Error fetching channel ID:", error);
    return null;
  }
}

// Function to fetch all video IDs for a given channel
async function fetchAllVideosForChannel(channelId: string): Promise<string[]> {
  let allVideoIds: string[] = []; // Array to store video IDs
  let nextPageToken: string | undefined = undefined; // Token for pagination

  do {
    try {
      const response = await youtube.search.list({
        part: ["id"], // Request only the ID part
        channelId: channelId, // Filter by channel ID
        type: ["video"], // Search for videos
        order: "date", // Order by date
        maxResults: 50, // Maximum results per page
        pageToken: nextPageToken, // Token for next page
      });

      const data: youtube_v3.Schema$SearchListResponse = response.data;
      const videoIds =
        (data.items
          ?.map((item) => item.id?.videoId)
          .filter(Boolean) as string[]) || []; // Extract video IDs
      allVideoIds = allVideoIds.concat(videoIds); // Add to the list

      nextPageToken =
        data.nextPageToken !== null ? data.nextPageToken : undefined; // Update token
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      break;
    }
  } while (nextPageToken); // Continue if there's a next page

  return allVideoIds;
}

// Function to fetch details for a list of video IDs
async function fetchVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
  try {
    const response = await youtube.videos.list({
      part: ["snippet", "statistics"], // Request snippet and statistics
      id: videoIds, // List of video IDs
    });

    // Map response to YouTubeVideo objects
    return (
      response.data.items?.map((item) => ({
        id: { videoId: item.id! },
        snippet: item.snippet!,
        statistics: item.statistics!,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching video details:", error);
    return [];
  }
}

// Function to fetch comments for a specific video
async function fetchVideoComments(videoId: string): Promise<YouTubeComment[]> {
  let allComments: YouTubeComment[] = []; // Array to store comments
  let nextPageToken: string | undefined = undefined; // Token for pagination

  do {
    try {
      const response = await youtube.commentThreads.list({
        part: ["snippet"], // Request snippet part
        videoId: videoId, // Filter by video ID
        maxResults: 100, // Maximum results per page
        pageToken: nextPageToken, // Token for next page
      });

      const data: youtube_v3.Schema$CommentThreadListResponse = response.data;
      const comments =
        data.items?.map((item) => ({
          id: item.id!,
          snippet: item.snippet!.topLevelComment!.snippet!,
        })) || []; // Extract comments
      allComments = allComments.concat(comments); // Add to the list

      // Stop fetching if we have reached 100 comments
      if (allComments.length >= 100) {
        allComments = allComments.slice(0, 100);
        break;
      }

      nextPageToken =
        data.nextPageToken !== null ? data.nextPageToken : undefined; // Update token
    } catch (error) {
      console.error(`Error fetching comments for video ${videoId}:`, error);
      break;
    }
  } while (nextPageToken); // Continue if there's a next page

  return allComments;
}

// Interface for YouTube video details
interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: youtube_v3.Schema$VideoSnippet;
  statistics: youtube_v3.Schema$VideoStatistics;
}

// Interface for YouTube comment details
interface YouTubeComment {
  id: string;
  snippet: youtube_v3.Schema$CommentSnippet;
}

// Function to get the best available thumbnail URL
function getBestThumbnail(
  thumbnails: youtube_v3.Schema$ThumbnailDetails
): string {
  if (thumbnails.maxres) return thumbnails.maxres.url!;
  if (thumbnails.standard) return thumbnails.standard.url!;
  if (thumbnails.high) return thumbnails.high.url!;
  if (thumbnails.medium) return thumbnails.medium.url!;
  return thumbnails.default!.url!;
}

// Function to scrape videos for authenticated user
export async function scrapeVideos() {
  const { userId } = await auth(); // Get authenticated user ID

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Fetch channels for the user
  const channels = await db
    .select()
    .from(YouTubeChannels)
    .where(eq(YouTubeChannels.userId, userId));

  if (channels.length === 0) {
    throw new Error("No channels found for the user");
  }

  const newVideos: Video[] = []; // Array to store new videos
  const newComments: VideoComment[] = []; // Array to store new comments

  for (const channel of channels) {
    if (!channel.channelId) {
      const channelId = await getChannelId(channel.name);

      if (!channelId) {
        console.error(`Could not find channel ID for ${channel.name}`);
        continue;
      }

      // Update channel ID in the database
      await db
        .update(YouTubeChannels)
        .set({ channelId, updatedAt: new Date() })
        .where(
          and(
            eq(YouTubeChannels.id, channel.id),
            eq(YouTubeChannels.userId, userId)
          )
        );

      channel.channelId = channelId;
    }

    // Fetch video IDs and details
    const videoIds = await fetchAllVideosForChannel(channel.channelId);
    const videoDetails = await fetchVideoDetails(videoIds);

    for (const video of videoDetails) {
      // Check if video already exists in the database
      const existingVideo = await db
        .select()
        .from(Videos)
        .where(
          and(eq(Videos.videoId, video.id.videoId), eq(Videos.userId, userId))
        )
        .limit(1);

      let videoId: string;

      if (existingVideo.length === 0) {
        // Insert new video into the database
        const newVideo = {
          videoId: video.id.videoId,
          title: video.snippet.title!,
          description: video.snippet.description!,
          publishedAt: new Date(video.snippet.publishedAt!),
          thumbnailUrl: getBestThumbnail(video.snippet.thumbnails!),
          channelId: channel.channelId,
          channelTitle: video.snippet.channelTitle!,
          userId,
          viewCount: parseInt(video.statistics.viewCount || "0", 10),
          likeCount: parseInt(video.statistics.likeCount || "0", 10),
          dislikeCount: parseInt(video.statistics.dislikeCount || "0", 10),
          commentCount: parseInt(video.statistics.commentCount || "0", 10),
        };

        const [insertedVideo] = await db
          .insert(Videos)
          .values(newVideo)
          .returning();
        newVideos.push(insertedVideo);
        videoId = insertedVideo.id;
      } else {
        videoId = existingVideo[0].id;
      }

      // Fetch and save comments
      const comments = await fetchVideoComments(video.id.videoId);
      for (const comment of comments) {
        const newComment = {
          videoId,
          userId,
          commentText: comment.snippet.textDisplay!,
          likeCount: parseInt(`${comment.snippet.likeCount || "0"}`, 10),
          dislikeCount: 0, // YouTube API doesn't provide dislike count for comments
          publishedAt: new Date(comment.snippet.publishedAt!),
        };

        const [insertedComment] = await db
          .insert(VideoComments)
          .values(newComment)
          .returning();
        newComments.push(insertedComment);
      }
    }
  }

  return newVideos; // Return the list of new videos
}

// Function to update video statistics for authenticated user
export async function updateVideoStatistics() {
  const { userId } = await auth(); // Get authenticated user ID

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Fetch videos for the user
  const videos = await db
    .select()
    .from(Videos)
    .where(eq(Videos.userId, userId));

  for (const video of videos) {
    const [updatedVideo] = await fetchVideoDetails([video.videoId]);
    if (updatedVideo) {
      // Update video statistics in the database
      await db
        .update(Videos)
        .set({
          viewCount: parseInt(updatedVideo.statistics.viewCount || "0", 10),
          likeCount: parseInt(updatedVideo.statistics.likeCount || "0", 10),
          dislikeCount: parseInt(
            updatedVideo.statistics.dislikeCount || "0",
            10
          ),
          commentCount: parseInt(
            updatedVideo.statistics.commentCount || "0",
            10
          ),
          updatedAt: new Date(),
        })
        .where(eq(Videos.videoId, video.videoId));
    }
  }
}