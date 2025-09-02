import { getServerSession } from "next-auth";
import React from "react";
import NotifyAll from "../components/NotifyAll";
import UserProfileCard from "../components/UserProfileCard";

async function page() {
  const session = await getServerSession();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-start gap-5">
      <UserProfileCard
        email={session?.user?.email as string}
        name={session?.user?.name as string}
        img={session?.user?.image as string}
      />
      {session?.user?.email == process.env.ADMIN_EMAIL && <NotifyAll />}
    </div>
  );
}

export default page;
