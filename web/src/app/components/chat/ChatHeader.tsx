import { EllipsisVertical, Phone, Video } from "lucide-react";
import React from "react";

function ChatHeader({
  userImage,
  userEmail,
  userName,
}: {
  userImage: string;
  userEmail: string;
  userName: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white rounded-2xl">
      <div className="flex items-center gap-3">
        <img
          src={userImage}
          alt={userName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold text-gray-800">{userName}</h2>
          <p className="text-sm text-gray-500">{userEmail}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Phone />
        <Video />
        <EllipsisVertical />
      </div>
    </div>
  );
}

export default ChatHeader;
