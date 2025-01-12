"use client"; // Indicates that this component is a client-side component

import { useState, useEffect } from "react"; // Import React hooks for state and side effects
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; // Import dialog components for modal functionality
import { Button } from "@/components/ui/button"; // Import a custom Button component
import { Input } from "@/components/ui/input"; // Import a custom Input component
import { Plus, X } from "lucide-react"; // Import icons for UI elements

import { YouTubeChannelType } from "@/server/db/schema"; // Import the YouTubeChannelType for type safety

import { ScrollArea } from "@/components/ui/scroll-area"; // Import a custom ScrollArea component for scrollable content
import { getChannelsForUser } from "@/server/queries"; // Import function to fetch channels for the user
import { addChannelForUser, removeChannelForUser } from "@/server/mutations"; // Import functions to add and remove channels

// Define the SettingsModal component
export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false); // State to track if the modal is open
  const [channels, setChannels] = useState<YouTubeChannelType[]>([]); // State to store the list of channels
  const [newChannel, setNewChannel] = useState(""); // State to store the new channel name input
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  // Effect to fetch channels when the modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchChannels();
    }
  }, [isOpen]);

  // Function to fetch channels for the user
  const fetchChannels = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const fetchedChannels = await getChannelsForUser(); // Fetch channels
      setChannels(fetchedChannels); // Update state with fetched channels
    } catch (error) {
      console.error("Failed to fetch channels:", error); // Log any errors
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  // Function to add a new channel
  const addChannel = async () => {
    if (newChannel) {
      setIsLoading(true); // Set loading state to true
      try {
        const addedChannel = await addChannelForUser(newChannel); // Add channel
        setChannels([...channels, addedChannel]); // Update state with new channel
        setNewChannel(""); // Clear input field
      } catch (error) {
        console.error("Failed to add channel:", error); // Log any errors
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    }
  };

  // Function to remove a channel
  const removeChannel = async (id: string) => {
    setIsLoading(true); // Set loading state to true
    try {
      await removeChannelForUser(id); // Remove channel
      setChannels(channels.filter((c) => c.id !== id)); // Update state to remove channel
    } catch (error) {
      console.error("Failed to remove channel:", error); // Log any errors
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  // Render the modal
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Dialog component to handle modal open/close state */}
      <DialogTrigger asChild>
        {/* Trigger to open the modal */}
        <p className="cursor-pointer text-primary hover:text-red-500 transition-all">
          Settings
        </p>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] rounded-2xl p-6 space-y-2">
        {/* Content of the modal */}
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-red-500 text-lg">
              Add New Channel
            </h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Channel name"
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                className="focus-visible:ring-0 text-md px-4 py-2 h-10"
              />
              <Button
                onClick={addChannel}
                disabled={isLoading}
                className="bg-red-500 hover:bg-red-600 transition-all h-10 rounded-lg font-semibold"
              >
                <Plus className="h-4 w-4" strokeWidth={3} />
                <p>Add</p>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-red-500 text-lg">
              Saved Channels
            </h3>
            {isLoading ? (
              <p className="h-[150px] flex items-center justify-center">
                Loading...
              </p>
            ) : (
              <ScrollArea className="h-[150px]">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between border rounded-lg shadow-sm px-4 py-2 bg-gray-50 mb-2"
                  >
                    <span>{channel.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChannel(channel.id)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 text-red-500 hover:bg-red-50 rounded-md" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}