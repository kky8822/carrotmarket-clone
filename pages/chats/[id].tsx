import type { NextPage } from "next";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Chat, User } from "@prisma/client";
import ChatComp from "@components/chat";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";

interface ChatWithUser extends Chat {
  user: User;
}

interface ChatDetailResponse {
  ok: boolean;
  chats: ChatWithUser[];
}

interface ChatDetailForm {
  chat: Chat;
}

const ChatDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<ChatDetailResponse>(
    router.query.id ? `/api/chats/${router.query.id}` : null
  );
  const { register, handleSubmit, reset } = useForm<ChatDetailForm>();
  const [sendChat, { loading, data: sendChatData }] = useMutation(
    `/api/chats/${router.query.id}`
  );
  const onValid = (form: ChatDetailForm) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          chats: [
            ...prev.chats,
            {
              id: Date.now(),
              message: form.chat,
              user: {
                id: user?.id,
                avatar: user?.avatar,
              },
            },
          ],
        } as any),
      false
    );
    sendChat(form);
  };

  return (
    <Layout canGoBack>
      <div className="py-10 px-4 space-y-4">
        {data?.chats.map((chat) => (
          <ChatComp
            key={chat.id}
            avatar={chat.user.avatar ? chat.user.avatar : null}
            message={chat.message}
            reverse={chat.user.id === user?.id}
          />
        ))}
      </div>
      <div className="px-4 fixed w-full bottom-2 mx-auto max-w-md inset-x-0 ">
        <form
          onSubmit={handleSubmit(onValid)}
          className="flex relative items-center"
        >
          <input
            {...register("chat", { required: true })}
            className="pr-12 shadow-md rounded-full w-full border-gray-400 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            type="text"
          />
          <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
            <button className="flex items-center bg-orange-500 rounded-full px-3 text-sm text-white hover:bg-orange-600 focus:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-600">
              &rarr;
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;
