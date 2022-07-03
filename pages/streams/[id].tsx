import type { NextPage } from "next";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Stream, User } from "@prisma/client";
import Message from "@components/message";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import me from "pages/api/users/me";
import useUser from "@libs/client/useUser";
import { useEffect } from "react";
import streams from "pages/api/streams";

interface StreamWithUserAndMessages extends Stream {
  user: User;
  messages: {
    id: number;
    message: string;
    user: {
      avatar?: string;
      id: number;
    };
  }[];
}
interface StreamDetailResponse {
  ok: boolean;
  stream: StreamWithUserAndMessages;
}

interface MessageForm {
  message: string;
}

const StreamDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<StreamDetailResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    {
      refreshInterval: 1000,
    }
  );
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const [sendMessage, { data: messageData, loading }] = useMutation(
    `/api/streams/${router.query.id}/messages`
  );
  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            messages: [
              ...prev.stream.messages,
              {
                id: Date.now(),
                message: form.message,
                user: { id: user?.id, avatar: user?.avatar },
              },
            ],
          },
        } as any),
      false
    );
    sendMessage(form);
  };

  return (
    <Layout canGoBack>
      <div className="py-10 px-4">
        <div className="w-full rounded-md shadow-sm bg-zinc-500 aspect-video" />
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream?.name}
          </h1>
          <span className="text-2xl block mt-3 text-gray-900">
            ${data?.stream?.price}
          </span>
          <p className="my-6 text-gray-700 text-sm">
            {data?.stream?.description}
          </p>
        </div>
        <div className="mt-10 pb-16 h-[50vh] overflow-y-scroll space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          {data?.stream.messages.map((message) => (
            <Message
              key={message.id}
              message={message.message}
              reverse={message.user.id === user?.id}
            />
          ))}
        </div>
        <form
          onSubmit={handleSubmit(onValid)}
          className="px-4 fixed w-full bottom-2 mx-auto max-w-md inset-x-0 "
        >
          <div className="flex relative items-center">
            <input
              {...register("message", { required: true })}
              className="pr-12 shadow-md rounded-full w-full border-gray-400 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              type="text"
            />
            <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
              <button className="flex items-center justify-center bg-orange-500 rounded-full w-10 text-center px-3 text-sm text-white hover:bg-orange-600 focus:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-600">
                {loading ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                ) : (
                  <span>&rarr;</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default StreamDetail;
