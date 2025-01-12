import { relations } from "drizzle-orm";
import {
  integer,
  text,
  boolean,
  pgTable,
  varchar,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

// Define the Videos table schema
export const Videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(), // Unique identifier for each video
  userId: varchar("user_id", { length: 50 }).notNull(), // User ID associated with the video
  videoId: text("video_id").notNull(), // YouTube video ID
  title: text("title").notNull(), // Video title
  description: text("description"), // Video description
  publishedAt: timestamp("published_at").notNull(), // Publication date of the video
  thumbnailUrl: text("thumbnail_url"), // URL of the video thumbnail
  channelId: text("channel_id").notNull(), // YouTube channel ID
  channelTitle: text("channel_title").notNull(), // YouTube channel title
  viewCount: integer("view_count").default(0), // Number of views
  likeCount: integer("like_count").default(0), // Number of likes
  dislikeCount: integer("dislike_count").default(0), // Number of dislikes
  commentCount: integer("comment_count").default(0), // Number of comments
  createdAt: timestamp("created_at").defaultNow().notNull(), // Record creation timestamp
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // Record update timestamp
});

// Define the YouTubeChannels table schema
export const YouTubeChannels = pgTable("youtube_channels", {
  id: uuid("id").defaultRandom().primaryKey(), // Unique identifier for each channel
  userId: varchar("user_id", { length: 50 }).notNull(), // User ID associated with the channel
  name: text("name").notNull(), // Channel name
  channelId: text("channel_id"), // YouTube channel ID
  createdAt: timestamp("created_at").defaultNow().notNull(), // Record creation timestamp
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // Record update timestamp
});

// Define the VideoComments table schema
export const VideoComments = pgTable("video_comments", {
  id: uuid("id").defaultRandom().primaryKey(), // Unique identifier for each comment
  videoId: uuid("video_id").notNull(), // Video ID associated with the comment
  userId: varchar("user_id", { length: 50 }).notNull(), // User ID associated with the comment
  commentText: text("comment_text").notNull(), // Text of the comment
  likeCount: integer("like_count").default(0), // Number of likes on the comment
  dislikeCount: integer("dislike_count").default(0), // Number of dislikes on the comment
  publishedAt: timestamp("published_at").notNull(), // Publication date of the comment
  isUsed: boolean("is_used").default(false), // Flag to indicate if the comment has been used
  createdAt: timestamp("created_at").defaultNow().notNull(), // Record creation timestamp
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // Record update timestamp
});

// Define the Ideas table schema
export const Ideas = pgTable("ideas", {
  id: uuid("id").defaultRandom().primaryKey(), // Unique identifier for each idea
  userId: varchar("user_id", { length: 50 }).notNull(), // User ID associated with the idea
  videoId: uuid("video_id")
    .notNull()
    .references(() => Videos.id), // Reference to the associated video
  commentId: uuid("comment_id")
    .notNull()
    .references(() => VideoComments.id), // Reference to the associated comment
  score: integer("score").default(0), // Score of the idea
  videoTitle: text("video_title").notNull(), // Title of the video associated with the idea
  description: text("description").notNull(), // Description of the idea
  research: text("research").array().notNull(), // List of research URLs
  createdAt: timestamp("created_at").defaultNow().notNull(), // Record creation timestamp
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // Record update timestamp
});

// Define the CrewJobs table schema
export const CrewJobs = pgTable("crew_jobs", {
  id: uuid("id").defaultRandom().primaryKey(), // Unique identifier for each job
  userId: varchar("user_id", { length: 50 }).notNull(), // User ID associated with the job
  kickoffId: text("kickoff_id").notNull(), // ID for the kickoff event
  jobState: text("job_state").notNull().default("RUNNING"), // State of the job
  jobResult: text("job_result"), // Result of the job
  processed: boolean("processed").default(false), // Flag to indicate if the job has been processed
  createdAt: timestamp("created_at").defaultNow().notNull(), // Record creation timestamp
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // Record update timestamp
});

// Define relationships between tables
export const VideoRelations = relations(Videos, ({ many }) => ({
  comments: many(VideoComments), // A video can have many comments
  ideas: many(Ideas), // A video can have many ideas
}));

export const VideoCommentRelations = relations(VideoComments, ({ one }) => ({
  video: one(Videos, {
    fields: [VideoComments.videoId],
    references: [Videos.id],
  }), // A comment belongs to one video
}));

export const IdeaRelations = relations(Ideas, ({ one }) => ({
  video: one(Videos, {
    fields: [Ideas.videoId],
    references: [Videos.id],
  }), // An idea is associated with one video
  comment: one(VideoComments, {
    fields: [Ideas.commentId],
    references: [VideoComments.id],
  }), // An idea is associated with one comment
}));

// Types for selecting and inserting data
export type Video = typeof Videos.$inferSelect; // Type for selecting video data
export type InsertVideo = typeof Videos.$inferInsert; // Type for inserting video data
export type YouTubeChannelType = typeof YouTubeChannels.$inferSelect; // Type for selecting YouTube channel data
export type InsertYouTubeChannel = typeof YouTubeChannels.$inferInsert; // Type for inserting YouTube channel data
export type VideoComment = typeof VideoComments.$inferSelect; // Type for selecting video comment data
export type InsertVideoComment = typeof VideoComments.$inferInsert; // Type for inserting video comment data
export type Idea = typeof Ideas.$inferSelect; // Type for selecting idea data
export type InsertIdea = typeof Ideas.$inferInsert; // Type for inserting idea data
export type CrewJob = typeof CrewJobs.$inferSelect; // Type for selecting crew job data
export type InsertCrewJob = typeof CrewJobs.$inferInsert; // Type for inserting crew job data