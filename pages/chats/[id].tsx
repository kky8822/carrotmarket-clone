import type { NextPage } from "next";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Chat, Product, User } from "@prisma/client";
import ChatComp from "@components/chat";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import FloatingBtn from "@components/floating-button";
import FloatingBtnPopup from "@components/floating-button-popup";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ChatWithUser extends Chat {
  user: User;
}

interface ChatDetailResponse {
  ok: boolean;
  chats: ChatWithUser[];
  product: Product;
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

  const [productPopup, setProductPopup] = useState<boolean>(false);
  const onClick = () => {
    setProductPopup((prev) => !prev);
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
      <FloatingBtnPopup onClick={onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </FloatingBtnPopup>
      {productPopup ? (
        <div className="p-5 space-y-4 fixed bottom-[140px] right-[70px] w-96 h-96 bg-white border border-gray-200 rounded-t-xl rounded-bl-xl shadow-md">
          <div className="w-[344px] aspect-video mx-auto relative bg-zinc-500">
            <Image
              alt=""
              src={`https://imagedelivery.net/93usl5Ygdo4diWvQKul4DQ/${data?.product.image}/product`}
              className="object-cover"
              layout="fill"
              quality={100}
            />
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {data?.product?.name}
            </h1>
            <span className="text-3xl mt-3 text-gray-900 block">
              {data ? "$" + data.product.price : "Loading"}
            </span>
            <p className="text-base my-6 text-gray-700">
              {data?.product?.description}
            </p>
          </div>
        </div>
      ) : null}
    </Layout>
  );
};

export default ChatDetail;
