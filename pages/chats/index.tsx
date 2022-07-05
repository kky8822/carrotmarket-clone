import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useSWR from "swr";
import { Chat, Chatroom, User } from "@prisma/client";
import Image from "next/image";

interface ChatroomWithSellerChat extends Chatroom {
  seller: User;
  chats: Chat[];
}

interface ChatResponse {
  ok: boolean;
  chatrooms: ChatroomWithSellerChat[];
}

const Chats: NextPage = () => {
  const chatrooms = useSWR<ChatResponse>(`/api/chats`);

  return (
    <Layout title="Chats" hasTabBar>
      <div className="py-10 divide-y-[1.5px]">
        {chatrooms.data?.chatrooms.map((chatroom) => (
          <Link key={chatroom.id} href={`/chats/${chatroom.id}`}>
            <a className="flex py-3 px-4 items-center space-x-3 cursor-pointer">
              <Image
                alt=""
                width={40}
                height={40}
                src={`https://imagedelivery.net/93usl5Ygdo4diWvQKul4DQ/${chatroom.seller.avatar}/avatar`}
                className="w-12 h-12 rounded-full bg-zinc-500"
              />
              <div className="flex flex-col">
                <span className="text-gray-700">{chatroom.seller.name}</span>
                <span className="text-sm text-gray-500">
                  {chatroom.chats[0]?.message}
                </span>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
