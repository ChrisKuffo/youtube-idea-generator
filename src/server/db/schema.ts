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

export const Videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  videoId: text("video_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  publishedAt: timestamp("published_at").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  channelId: text("channel_id").notNull(),
  channelTitle: text("channel_title").notNull(),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  dislikeCount: integer("dislike_count").default(0),
  commentCount: integer("comment_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const YouTubeChannels = pgTable("youtube_channels", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  name: text("name").notNull(),
  channelId: text("channel_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const VideoComments = pgTable("video_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  videoId: uuid("video_id").notNull(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  commentText: text("comment_text").notNull(),
  likeCount: integer("like_count").default(0),
  dislikeCount: integer("dislike_count").default(0),
  publishedAt: timestamp("published_at").notNull(),
  isUsed: boolean("is_used").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relationships
export const VideoRelations = relations(Videos, ({ many }) => ({
  comments: many(VideoComments),
}));

export const VideoCommentRelations = relations(VideoComments, ({ one }) => ({
  video: one(Videos, {
    fields: [VideoComments.videoId],
    references: [Videos.id],
  }),
}));

// Types
export type Video = typeof Videos.$inferSelect;
export type InsertVideo = typeof Videos.$inferInsert;
export type YouTubeChannelType = typeof YouTubeChannels.$inferSelect;
export type InsertYouTubeChannel = typeof YouTubeChannels.$inferInsert;
export type VideoComment = typeof VideoComments.$inferSelect;
export type InsertVideoComment = typeof VideoComments.$inferInsert;