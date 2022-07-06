import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useSWR from "swr";
import { Chat, Chatroom, Product, User } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import Button from "@components/button";
import ButtonGray from "@components/buttonGray";

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
  const [purchaseMode, setPurchaseMode] = useState<boolean>(true);
  const [saleMode, setSaleMode] = useState<boolean>(false);
  const purchaseClick = () => {
    setPurchaseMode(true);
    setSaleMode(false);
  };
  const saleClick = () => {
    setSaleMode(true);
    setPurchaseMode(false);
  };

  return (
    <Layout title="Chats" hasTabBar>
      <div className="pt-10 flex space-x-2 mx-2">
        <Button
          onClick={purchaseClick}
          color={purchaseMode ? "orange" : "gray"}
          text="Purchase"
        />
        <Button
          onClick={saleClick}
          color={saleMode ? "orange" : "gray"}
          text="Sale"
        />
      </div>
      <div className="pt-2 pb-10 divide-y-[1.5px]">
        {purchaseMode && (
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
        {saleMode && (
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
