import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

type User = {
  name: string | null;
  email: string;
  image: string | null;
};

function AllFriends({ allFriendsInfo }: { allFriendsInfo: User[] }) {
  return (
    <Dialog>
      <DialogTrigger>
        {allFriendsInfo.length != 0 ? (
          <div className="flex items-center gap-1 text-gray-600 text-sm font-medium cursor-pointer transition-colors">
            <User className="w-4 h-4" />
            <span>{allFriendsInfo.length} Friends</span>
          </div>
        ) : (
          <>O Friends</>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            All Friends
          </DialogTitle>
          <DialogDescription asChild>
            <div className="mt-4 flex flex-col gap-4">
              {allFriendsInfo.length === 0 ? (
                <p className="text-sm text-gray-500">No friends found.</p>
              ) : (
                allFriendsInfo.map((friend, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={friend.image || ""}
                        alt={friend.name || friend.email}
                      />
                      <AvatarFallback>
                        {friend.name?.[0] || friend.email[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {friend.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {friend.email}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AllFriends;
