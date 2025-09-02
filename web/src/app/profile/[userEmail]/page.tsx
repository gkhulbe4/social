import UserProfileCard from "@/app/components/UserProfileCard";
import React from "react";

async function page({
  params,
}: {
  params: {
    userEmail: string;
  };
}) {
  const param = await params;
  const userEmail = param.userEmail + "@gmail.com";

  const res = await fetch(
    `http://localhost:3000/api/getUserDetails/?userEmail=${userEmail}`
  );
  const data = await res.json();
  return (
    <div className="h-screen w-full flex flex-col items-center justify-start gap-5">
      <UserProfileCard
        email={data.user?.email as string}
        name={data.user?.name as string}
        img={data.user?.image as string}
      />
    </div>
  );
}

export default page;
