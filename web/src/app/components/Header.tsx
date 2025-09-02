import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
import SignoutBtn from "./SignoutBtn";
import SigninBtn from "./SigninBtn";
import Link from "next/link";
import Notifications from "./notifications/Notifications";
import { MessageCirclePlus } from "lucide-react";

async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex justify-between items-center p-4 shadow-xl border border-gray-200 rounded-2xl bg-white">
      <Link href={"/"} className="flex justify-center items-center">
        <p className="font-serif text-xl font-semibold">S</p>
        <MessageCirclePlus size={20} />
        <p className="font-serif text-xl font-semibold">CIAL</p>
      </Link>

      <div className="flex gap-7 text-sm font-semibold">
        <Link href="/add-friend" className="hover:underline cursor-pointer">
          Add Friend
        </Link>
        <Link href="/add-post" className="hover:underline cursor-pointer">
          Add Post
        </Link>
        <Link href="/chat" className="hover:underline cursor-pointer">
          Chat
        </Link>
        <Link href="/profile" className="hover:underline cursor-pointer">
          Profile
        </Link>
      </div>

      <div className="flex gap-5">
        <Notifications />
        {session?.user ? (
          <div className="flex gap-3 justify-center items-center">
            <SignoutBtn />
          </div>
        ) : (
          <SigninBtn />
        )}
      </div>
    </div>
  );
}

export default Header;
