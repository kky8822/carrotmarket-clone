import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";

const Chats: NextPage = () => {
  return (
    <Layout title="Chats" hasTabBar>
      <div className="py-10 divide-y-[1.5px]">
        {[1, 2, 3, 4, 5, 1, 1, 1, 1, 1, 1].map((id, key) => (
          <Link key={key} href={`/chats/${id}`}>
            <a className="flex py-3 px-4 items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-zinc-500" />
              <div className="flex flex-col">
                <span className="text-gray-700">Steve Jebs</span>
                <span className="text-sm text-gray-500">See you tommorow</span>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
