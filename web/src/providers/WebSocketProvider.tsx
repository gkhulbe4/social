"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { sendChatToQueue } from "@/lib/sendChatToQueue";
import { useParams } from "next/navigation";

type UserChatMap = {
  [userEmail: string]: Message[];
};

type Message = {
  receiver: {
    email: string;
  };
  sender: {
    email: string;
  };
  message: string;
  createdAt: Date;
};

type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  chats: UserChatMap;
  setChats: React.Dispatch<React.SetStateAction<UserChatMap>>;
};

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  chats: {},
  setChats: () => {},
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chats, setChats] = useState<UserChatMap>({});

  useEffect(() => {
    if (!session) return;

    const ws = new WebSocket(
      `ws://localhost:8080/?userEmail=${session.user?.email}`
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    ws.onmessage = async (data) => {
      const message = JSON.parse(data.data as string);
      console.log(message);
      if (message.type === "ADMIN-MESSAGE") {
        toast.info(`Attention: ${message.message}`);
      } else if (message.type.startsWith("notification")) {
        toast.info(message.message);
      } else if (message.type.startsWith("friend")) {
        toast.info(message.message);
      } else if (message.type == "chat") {
        toast.info(message.notification);

        const newMsg: Message = {
          receiver: { email: message.to },
          sender: { email: message.from },
          message: message.message,
          createdAt: message.createdAt,
        };
        console.log("i am here");
        setChats((prev) => ({
          ...prev,
          [message.from]: [...(prev[message.from] || []), newMsg],
        }));

        await sendChatToQueue(
          message.from,
          message.to,
          message.message,
          message.createdAt
        );
      }
    };

    setSocket(ws);

    // return () => {
    //   ws.close();
    // };
  }, [session?.user?.email]);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, chats, setChats }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}
