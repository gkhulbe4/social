"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Mail } from "lucide-react";
import RejectRequest from "./RejectRequest";
import AcceptRequest from "./AcceptRequest";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Notifications() {
  const session = useSession();

  const { data, error, isLoading, mutate } = useSWR(
    session.data?.user?.email
      ? `http://localhost:3000/api/getAllFriendRequests?userEmail=${session.data.user.email}`
      : null,
    fetcher
  );

  if (error) return <p>Error loading</p>;

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer relative">
        <Mail className="w-6 h-6 text-gray-600 hover:text-gray-900 transition" />
        {!isLoading && data?.requestsReceived?.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {data.requestsReceived.length}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-96 p-4">
        {!isLoading && data && (
          <>
            <h3 className="text-sm font-semibold mb-3">Friend Requests</h3>
            {data.requestsReceived.length === 0 ? (
              <p className="text-xs text-gray-500">No new requests</p>
            ) : (
              <div className="space-y-2">
                {data.requestsReceived.map(
                  (
                    req: {
                      id: string;
                      requester: {
                        email: string;
                        image: string;
                        name: string;
                      };
                    },
                    i: number
                  ) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white p-2 rounded-lg border"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img
                          src={req.requester.image || "/default-avatar.png"}
                          alt={req.requester.name || "User"}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {req.requester.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {req.requester.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <AcceptRequest
                          currentUserEmail={
                            session?.data?.user?.email as string
                          }
                          requestEmail={req.requester.email}
                          requestId={req.id}
                        />
                        <RejectRequest
                          requestEmail={req.requester.email}
                          requestId={req.id}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default Notifications;
