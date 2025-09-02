import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userEmail = searchParams.get("userEmail");

  if (!userEmail) {
    return NextResponse.json({ message: "Missing Info" }, { status: 404 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail as string,
      },
      select: {
        email: true,
        image: true,
        name: true,
      },
    });
    return NextResponse.json(
      { message: "User found successfully", user: user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error in fetching user details", error },
      { status: 500 }
    );
  }
}
