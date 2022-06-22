import type { NextPage } from "next";
import Layout from "../../components/layout";

const Stream: NextPage = () => {
  return (
    <Layout title="Streams" hasTabBar>
      <div className="py-10  divide-y-2 space-y-4">
        {[1, 2, 3, 4, 5].map((_, i) => (
          <div className="pt-4  px-4" key={i}>
            <div className="w-full rounded-md shadow-sm bg-zinc-500 aspect-video" />
            <h1 className="text-2xl mt-2 font-bold text-gray-900">
              Galaxy S50
            </h1>
          </div>
        ))}
        <button className="fixed bottom-24 right-5 bg-orange-400 hover:bg-orange-500  active:bg-orange-600 transition-color shadow-xl rounded-full p-4 text-white cursor-pointer html border-transparent">
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
        </button>
      </div>
    </Layout>
  );
};

export default Stream;
