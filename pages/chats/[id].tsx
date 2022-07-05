import type { NextPage } from "next";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Chat, User } from "@prisma/client";
import ChatComp from "@components/chat";

interface ChatWithUser extends Chat {
  user: User;
}

interface ChatDetailResponse {
  ok: boolean;
  chats: ChatWithUser[];
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const chats = useSWR<ChatDetailResponse>(
    router.query.id ? `/api/chats/${router.query.id}` : null
  );

  return (
    <Layout canGoBack>
      <div className="py-10 px-4 space-y-4">
        {chats?.data?.chats.map((chat) => (
          <ChatComp key={chat.id} message="" />
        ))}
      </div>
      <div className="px-4 fixed w-full bottom-2 mx-auto max-w-md inset-x-0 ">
        <div className="flex relative items-center">
          <input
            className="pr-12 shadow-md rounded-full w-full border-gray-400 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            type="text"
          />
          <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
            <button className="flex items-center bg-orange-500 rounded-full px-3 text-sm text-white hover:bg-orange-600 focus:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-600">
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatDetail;
