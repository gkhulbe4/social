import ChatHeader from "@/app/components/chat/ChatHeader";
import ChatSection from "@/app/components/chat/ChatSection";
import SendChat from "@/app/components/chat/SendChat";
import { getServerSession } from "next-auth";
import React from "react";

async function page({
  params,
}: {
  params: {
    userEmail: string;
  };
}) {
  const param = await params;
  const session = await getServerSession();
  const userEmail = param.userEmail + "@gmail.com";
  const res = await fetch(
    `http://localhost:3000/api/getUserDetails/?userEmail=${userEmail}`
  );
  const data = await res.json();

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        userEmail={userEmail}
        userImage={data.user.image}
        userName={data.user.name}
      />

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <ChatSection
          userEmail={userEmail}
          currentUserEmail={session?.user?.email!}
        />
      </div>

      <SendChat userEmail={userEmail} />
    </div>
  );
}

export default page;
