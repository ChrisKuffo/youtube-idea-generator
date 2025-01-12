"use client"; // Indicates that this component is a client-side component

import { Video, VideoComments } from "@/server/db/schema"; // Import types for video and comments
import { formatDistanceToNow } from "date-fns"; // Import function to format dates
import { ThumbsUp, MessageSquare, Eye, Clock } from "lucide-react"; // Import icons for UI elements
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Import Avatar components for user icons
import Image from "next/image"; // Import Image component for optimized images
import { formatCount } from "@/lib/utils"; // Import utility function to format large numbers
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea component for scrollable content

// Define the Props interface for the component's props
interface Props {
  video: Video; // Video data
  comments: (typeof VideoComments.$inferSelect)[]; // Array of comments
}

// Define the VideoDetail component
export default function VideoDetail({ video, comments }: Props) {
  return (
    <div className="space-y-6">
      {/* Container for video details */}
      <div className="flex items-center justify-between space-x-4 p-5 rounded-2xl bg-white border w-full shadow-sm">
        <div className="space-y-5 w-1/2 p-5">
          {/* Video title and channel information */}
          <h1 className="text-3xl font-bold line-clamp-2 text-red-500">
            {video.title}
          </h1>
          <div className="text-sm font-semibold text-muted-foreground">
            {video.channelTitle}
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground font-semibold">
            {/* Video statistics */}
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" strokeWidth={3} />
              <span>{formatCount(video.viewCount ?? 0)} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4" strokeWidth={3} />
              <span>{formatCount(video.likeCount ?? 0)} likes</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" strokeWidth={3} />
              <span>{formatCount(video.commentCount ?? 0)} comments</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" strokeWidth={3} />
              <span>
                {formatDistanceToNow(new Date(video.publishedAt))} ago
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden">
          {/* Video thumbnail */}
          <Image
            src={video.thumbnailUrl ?? ""}
            alt={video.title}
            width={480} // maintaining the 16:9 thumbnail aspect ratio
            height={270}
            className="object-cover"
          />
        </div>
      </div>

      {/* Video description */}
      <div className="space-y-4 p-8 rounded-2xl bg-white border w-full shadow-sm">
        <h2 className="text-xl font-semibold text-red-500">Description</h2>
        <ScrollArea className="h-[500px]">
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">
            {video.description}
          </p>
        </ScrollArea>
      </div>

      {/* Video comments */}
      <div className="space-y-8 p-8 rounded-2xl bg-white border w-full shadow-sm">
        <h2 className="text-xl font-semibold text-red-500">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        ) : (
          <div className="space-y-8">
            {comments
              .sort(
                (a, b) =>
                  new Date(b.publishedAt).getTime() -
                  new Date(a.publishedAt).getTime()
              )
              .map((comment) => (
                <div key={comment.id}>
                  <div>
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {comment.commentText.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <div className="font-medium text-red-500">
                            Anonymous
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.publishedAt))}{" "}
                            ago
                          </div>
                        </div>
                        <p className="text-sm">{comment.commentText}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{comment.likeCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}