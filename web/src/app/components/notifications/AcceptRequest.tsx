"use client";

import { useWebSocket } from "@/providers/WebSocketProvider";
import { Check } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function AcceptRequest({
  currentUserEmail,
  requestEmail,
  requestId,
}: {
  currentUserEmail: string;
  requestEmail: string;
  requestId: string;
}) {
  const { socket } = useWebSocket();
  async function acceptRequest() {
    const res = await fetch("/api/acceptRequest", {
      method: "POST",
      body: JSON.stringify({
        requestEmail: requestEmail,
        requestId: requestId,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      socket?.send(
        JSON.stringify({
          type: "SUBSCRIBE",
          subType: "friend",
          channel: `friend:${requestEmail}`,
          users: {
            user1Email: requestEmail,
            user2Email: currentUserEmail,
          },
        })
      );
    } else {
      toast.error("An error occurred");
    }
  }

  return (
    <button
      onClick={acceptRequest}
      className="p-1 rounded-full bg-green-500 hover:bg-green-600 text-white"
    >
      <Check className="w-4 h-4" />
    </button>
  );
}

export default AcceptRequest;
