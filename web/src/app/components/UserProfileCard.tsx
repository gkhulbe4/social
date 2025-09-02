import React from "react";
import AllFriends from "./AllFriends";
import { getAllFriends } from "@/lib/getAllFriends";

async function UserProfileCard({
  name,
  email,
  img,
}: {
  name: string;
  email: string;
  img: string;
}) {
  const friends = await getAllFriends(email as string);
  // console.log(friends);

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center gap-6 mt-6">
      <img
        src={img}
        alt="user img"
        className="w-20 h-20 rounded-full object-cover border"
      />

      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-xl font-semibold text-gray-900">
          {name ?? "Anonymous User"}
        </h2>
        <p className="text-sm text-gray-600">{email}</p>

        <p className="mt-3 text-sm text-gray-700">
          Welcome back! 🎉 You’re logged into our platform. Stay tuned for
          updates from the admin and new features.
        </p>

        <div className="mt-4 text-xs text-gray-600 flex justify-center sm:justify-start gap-2">
          {friends?.length !== 0 ? (
            <AllFriends allFriendsInfo={friends!} />
          ) : (
            <>0 Friends</>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfileCard;
