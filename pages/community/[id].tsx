import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import Textarea from "@components/textarea";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Answer, Post, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface AnswerWithUser extends Answer {
  user: User;
}

interface PostWithUser extends Post {
  user: User;
  _count: {
    wonderings: number;
    answers: number;
  };
  answers: AnswerWithUser[];
}

interface CommunityPostResponse {
  ok: boolean;
  post: PostWithUser;
  isWondering: boolean;
}

interface AnswerForm {
  answer: string;
}

interface AnswerResposne {
  ok: boolean;
  response: Answer;
}

const CommunityPostDetail: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<AnswerForm>();
  const { data, mutate } = useSWR<CommunityPostResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );
  const [wonder, { loading }] = useMutation(
    `/api/posts/${router.query.id}/wonder`
  );
  const [sendAnswer, { data: answerData, loading: answerLoading }] =
    useMutation<AnswerResposne>(`/api/posts/${router.query.id}/answer`);
  const onWonderClick = () => {
    if (!data) return;
    if (loading) return;
    mutate(
      {
        ...data,
        post: {
          ...data.post,
          _count: {
            ...data.post._count,
            wonderings: data.isWondering
              ? data.post._count.wonderings - 1
              : data.post._count.wonderings + 1,
          },
        },
        isWondering: !data.isWondering,
      },
      false
    );
    wonder({});
  };
  const onValid = (form: AnswerForm) => {
    if (answerLoading) return;
    sendAnswer(form);
  };
  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
      mutate();
    }
  }, [answerData, reset, mutate]);

  return (
    <Layout canGoBack>
      <div className="py-10">
        <span className="inline-flex ml-4 my-2.5 items-center rounded-full py-0.5 px-2.5 text-xs font-medium bg-gray-100 text-gray-800">
          동네질문
        </span>
        <div className="flex mb-3 py-3 px-4 border-b items-center space-x-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-zinc-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {data?.post?.user?.name}
            </span>
            <Link href={`/profile/${data?.post?.user?.id}`}>
              <a className="text-xs font-medium text-gray-500">
                View profile &rarr;
              </a>
            </Link>
          </div>
        </div>

        <div className="px-4">
          <div className="mt-2 text-gray-700">
            <span className="text-orange-500 font-medium">Q.</span>
            {data?.post?.question}
          </div>
        </div>

        <div className="px-4 mt-3 flex space-x-5 text-gray-700 py-2.5 w-full border-t border-b-[1.5px]">
          <button
            onClick={onWonderClick}
            className={cls(
              "flex space-x-2 items-center text-sm",
              data?.isWondering ? "text-green-500" : ""
            )}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>궁금해요 {data?.post?._count?.wonderings}</span>
          </button>
          <span className="flex space-x-2 items-center text-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            <span>답변 {data?.post?._count?.answers}</span>
          </span>
        </div>

        <div className="px-4 my-5 space-y-5">
          {data?.post?.answers?.map((answer) => (
            <div key={answer?.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 aspect-square rounded-full bg-zinc-500" />
              <div>
                <span className="text-sm block font-medium text-gray-700">
                  {answer?.user?.name}
                </span>
                <span className="text-xs block font-medium text-gray-500">
                  {"" + answer?.createdAt}
                </span>
                <p className="text-gray-700 mt-2">{answer?.answer}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="px-4" onSubmit={handleSubmit(onValid)}>
          <Textarea
            name="description"
            placeholder="Answer this question!"
            required={true}
            register={register("answer", { required: true, minLength: 5 })}
          />
          <Button text={answerLoading ? "Loading..." : "Reply"} />
        </form>
      </div>
    </Layout>
  );
};

export default CommunityPostDetail;
