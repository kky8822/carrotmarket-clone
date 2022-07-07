import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useSWR from "swr";
import { Chat, Chatroom, Product, User } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

import { cls } from "@libs/client/utils";
import { AnimatePresence, motion } from "framer-motion";

interface ProductWithUser extends Product {
  user: User;
}
interface ChatroomWithProductPurchaserChat extends Chatroom {
  product: ProductWithUser;
  purchaser: User;
  chats: Chat[];
}

interface ChatResponse {
  ok: boolean;
  chatrooms: ChatroomWithProductPurchaserChat[];
}

const Chats: NextPage = () => {
  const { data: purchaseChats } = useSWR<ChatResponse>(
    `/api/chats/purchase-chats`
  );
  const { data: saleChats } = useSWR<ChatResponse>(`/api/chats/sale-chats`);
  const [method, setMethod] = useState<"purchase" | "sale">("purchase");
  const purchaseClick = () => {
    setMethod("purchase");
  };
  const saleClick = () => {
    setMethod("sale");
  };

  const variants = {
    on: {
      textColor: "rgb(251, 146, 60)",
      borderColor: "rgba(249, 115, 22, 1)",
    },
    off: {
      textColor: "rgb(107, 114, 128)",
      borderColor: "rgba(249, 115, 22, 0)",
    },
  };

  return (
    <Layout title="Chats" hasTabBar>
      <div className="grid grid-cols-2 gap-4 w-full border-b h-12">
        <button
          className={cls(
            "relative flex items-center justify-center font-medium w-full cursor-pointer",
            method == "purchase" ? "text-orange-400" : "text-gray-500"
          )}
          onClick={purchaseClick}
        >
          <span>Purchase</span>
          {method == "purchase" ? (
            <motion.div
              layoutId="border"
              transition={{ duration: 0.15 }}
              className="absolute w-full h-12 border-b-2 border-orange-500"
            />
          ) : null}
        </button>

        <button
          className={cls(
            "relative flex items-center justify-center font-medium w-full cursor-pointer",
            method == "sale" ? "text-orange-400" : "text-gray-500"
          )}
          onClick={saleClick}
        >
          <span>Sale</span>
          {method == "sale" ? (
            <motion.div
              layoutId="border"
              transition={{ duration: 0.15 }}
              className="absolute w-full h-12 border-b-2 border-orange-500"
            />
          ) : null}
        </button>
      </div>

      <div className="pt-2 pb-10 divide-y-[1.5px]">
        {method === "purchase" && (
          <>
            {purchaseChats?.chatrooms.map((chatroom) => (
              <Link key={chatroom.id} href={`/chats/${chatroom.id}`}>
                <a className="flex py-3 px-4 items-center space-x-3 cursor-pointer">
                  <Image
                    alt=""
                    width={40}
                    height={40}
                    src={`https://imagedelivery.net/93usl5Ygdo4diWvQKul4DQ/${chatroom.product.user.avatar}/avatar`}
                    className="w-12 h-12 rounded-full bg-zinc-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-gray-700">
                      {chatroom.product.user.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {chatroom.chats[0]?.message}
                    </span>
                  </div>
                </a>
              </Link>
            ))}
          </>
        )}
        {method === "sale" && (
          <>
            {saleChats?.chatrooms.map((chatroom) => (
              <Link key={chatroom.id} href={`/chats/${chatroom.id}`}>
                <a className="flex py-3 px-4 items-center space-x-3 cursor-pointer">
                  <Image
                    alt=""
                    width={40}
                    height={40}
                    src={`https://imagedelivery.net/93usl5Ygdo4diWvQKul4DQ/${chatroom.purchaser.avatar}/avatar`}
                    className="w-12 h-12 rounded-full bg-zinc-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-gray-700">
                      {chatroom.purchaser.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {chatroom.chats[0]?.message}
                    </span>
                  </div>
                </a>
              </Link>
            ))}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Chats;
