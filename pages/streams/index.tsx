import type { NextPage } from "next";
import Link from "next/link";
import FloatingBtn from "@components/floating-button";
import Layout from "@components/layout";
import useSWR from "swr";
import { Stream } from "@prisma/client";

interface StreamResponse {
  ok: boolean;
  streams: Stream[];
}
const Stream: NextPage = () => {
  const { data } = useSWR<StreamResponse>("/api/streams");
  return (
    <Layout title="Streams" hasTabBar>
      <div className="py-10  divide-y-2 space-y-4">
        {data?.streams.map((stream) => (
          <Link href={`/streams/${stream.id}`} key={stream.id}>
            <a className="pt-4 px-4 block">
              <div className="w-full rounded-md shadow-sm bg-zinc-500 aspect-video" />
              <h1 className="text-2xl mt-2 font-bold text-gray-900">
                {stream.name}
              </h1>
            </a>
          </Link>
        ))}
        <FloatingBtn href="/streams/create">
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
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </FloatingBtn>
      </div>
    </Layout>
  );
};

export default Stream;
