import { getAllFriends } from "@/lib/getAllFriends";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const friends = await getAllFriends(session?.user?.email as string);

  if (!session) {
    return <div>Please log in to see your chats.</div>;
  }

  return (
    <div className="h-[600px] flex border rounded-2xl overflow-hidden">
      <aside className="w-1/3 max-w-sm border-r border-gray-200 bg-white flex flex-col">
        <h2 className="p-4 text-xl font-semibold border-b">Inbox</h2>
        {/* Scrollable friends list */}
        <ul className="flex-1 overflow-y-auto">
          {friends?.map((friend) => (
            <li key={friend.email.split("@")[0]}>
              <Link
                href={`/chat/${friend.email.split("@")[0]}`}
                className="flex items-center gap-3 p-4 hover:bg-gray-100 transition border-b border-gray-200"
              >
                <img
                  src={friend.image!}
                  alt={friend.name!}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium">{friend.name}</p>
                  <p className="text-sm text-gray-500">{friend.email}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 bg-gray-50 flex flex-col">{children}</main>
    </div>
  );
}
