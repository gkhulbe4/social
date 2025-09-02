"use client";
import { getChatsFromCache } from "@/lib/getChatsFromCache";
import { useWebSocket } from "@/providers/WebSocketProvider";
import { Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

function ChatSection({
  userEmail,
  currentUserEmail,
}: {
  userEmail: string;
  currentUserEmail: string;
}) {
  const { chats, setChats } = useWebSocket();
  const [fetchingChats, setFetchingChats] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchChats() {
      setFetchingChats(true);
      const cachedChats = await getChatsFromCache(currentUserEmail, userEmail);
      // console.log(cachedChats);
      setChats((prev) => ({ ...prev, [userEmail]: cachedChats }));
      setFetchingChats(false);
    }
    fetchChats();
  }, [userEmail]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats[userEmail]]);

  if (fetchingChats)
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="animate-spin" height={50} width={50} color="gray" />
      </div>
    );

  return (
    <div className="flex flex-col h-full p-3 space-y-3">
      {chats[userEmail]?.map((chat, index: number) => {
        const isMe = chat.sender.email === currentUserEmail;
        return (
          <div
            key={index}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl text-sm max-w-[75%] sm:max-w-[60%] break-words ${
                isMe
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {chat.message}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatSection;
