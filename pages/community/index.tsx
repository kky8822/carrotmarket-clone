import type { NextPage } from "next";
import Link from "next/link";
import FloatingBtn from "@components/floating-button";
import Layout from "@components/layout";
import useSWR from "swr";
import { Post, User } from "@prisma/client";
import moment from "moment";
import useCoords from "@libs/client/useCoords";

interface PostWithUserCount extends Post {
  user: User;
  _count: {
    answers: number;
    wonderings: number;
  };
}

interface PostsResponse {
  ok: boolean;
  posts: PostWithUserCount[];
}

const Community: NextPage = () => {
  const { latitude, longitude } = useCoords();
  const { data } = useSWR<PostsResponse>(
    latitude && longitude
      ? `/api/posts?latitude=${latitude}&longitude=${longitude}`
      : null
  );

  return (
    <Layout title="동네생활" seoTitle="동네생활" hasTabBar>
      <div className="py-16 space-y-8">
        {data?.posts?.map((post) => (
          <Link href={`/community/${post.id}`} key={post.id}>
            <a className="block">
              <div className="flex flex-col items-start px-4">
                <span className="flex items-center rounded-full py-0.5 px-2.5 text-xs font-medium bg-gray-100 text-gray-800">
                  동네질문
                </span>
                <div className="mt-2 text-gray-700">
                  <span className="text-orange-500 font-medium">Q.</span>
                  {post.question}
                </div>
                <div className="mt-5 flex items-center justify-between w-full text-gray-500 text-xs font-medium">
                  <span>{post.user.name}</span>
                  <span>{post.createdAt + ""}</span>
                </div>
              </div>

              <div className="px-4 flex space-x-5 text-gray-700 py-2.5 w-full mt-3 border-t border-b-[1.5px]">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>궁금해요 {post._count.wonderings}</span>
                </span>
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
                  <span>답변 {post._count.answers}</span>
                </span>
              </div>
            </a>
          </Link>
        ))}
      </div>
      <FloatingBtn href="/community/write">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          ></path>
        </svg>
      </FloatingBtn>
    </Layout>
  );
};

export default Community;
