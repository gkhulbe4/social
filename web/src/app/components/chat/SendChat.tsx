"use client";
import { useWebSocket } from "@/providers/WebSocketProvider";
import { SendHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

function SendChat({ userEmail }: { userEmail: string }) {
  const [message, setMessage] = useState("");
  const session = useSession();
  const { socket, setChats, chats } = useWebSocket();

  async function sendMessage() {
    socket?.send(
      JSON.stringify({
        type: "chat",
        data: {
          users: {
            from: session.data?.user?.email,
            to: userEmail,
          },
          message: message,
          createdAt: new Date().toISOString(),
        },
      })
    );
    // setChats((prev) => ({
    //   ...prev,
    //   [userEmail]: [
    //     ...(prev[userEmail] || []),
    //     {
    //       receiver: { email: userEmail },
    //       sender: { email: session?.data?.user?.email! },
    //       message,
    //       createdAt: new Date(),
    //     },
    //   ],
    // }));
    setMessage("");
  }
  // console.log(chats);

  return (
    <div className="border-t border-gray-200 p-3 bg-white rounded-2xl mt-1">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter" && message.length > 0) {
              sendMessage();
            }
          }}
          className="flex-1 min-w-0 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          disabled={message.length == 0}
          className="shrink-0 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center disabled:bg-gray-400"
          onClick={sendMessage}
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}

export default SendChat;
