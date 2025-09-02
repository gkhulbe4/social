import { redis } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const session = await getServerSession();
    if (!session || !message) {
      return NextResponse.json({ message: "Missing info" }, { status: 400 });
    }

    if (session.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ message: "Not Authorized" }, { status: 400 });
    }

    await redis.publish("ADMIN-MESSAGE", message);
    return NextResponse.json(
      { message: "Notified all successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: "An error occurred", error },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  //   const { message } = await req.json();
  //   await redis.publish("ADMIN-MESSAGE", message);
  return NextResponse.json({ success: true });
}
