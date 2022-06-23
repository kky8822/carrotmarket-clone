import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../../components/layout";

const Chats: NextPage = () => {
  return (
    <Layout title="Chats" hasTabBar>
      <div className="py-10 divide-y-[1.5px]">
        {[1, 2, 3, 4, 5, 1, 1, 1, 1, 1, 1].map((id, key) => (
          <Link href={`/chats/${id}`}>
            <div
              key={key}
              className="flex py-3 px-4 items-center space-x-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-500" />
              <div className="flex flex-col">
                <span className="text-gray-700">Steve Jebs</span>
                <span className="text-sm text-gray-500">See you tommorow</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
