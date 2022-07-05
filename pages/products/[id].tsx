import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Product, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import ButtonGray from "@components/buttonGray";
import { useForm } from "react-hook-form";
import useUser from "@libs/client/useUser";
import products from "pages/api/products";

interface ProductWithUser extends Product {
  user: User;
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isFav: boolean;
}

interface MakeChatRoomResponse {
  ok: boolean;
  chatroomId: number;
}

const ItemDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const onFavClick = () => {
    toggleFav({});
    if (!data) return;
    mutate({ ...data, isFav: !data.isFav }, false);
  };
  const [popUp, setPopUp] = useState<boolean>(false);
  const onPopUpBtnClick = () => {
    setPopUp((prev) => !prev);
  };

  const [makeChatRoom, { data: makeChatRoomData, loading }] =
    useMutation<MakeChatRoomResponse>("/api/chats");
  const onMakeChatRoomClick = () => {
    if (loading) return;
    makeChatRoom({ productId: router.query.id });
  };
  useEffect(() => {
    if (makeChatRoomData && makeChatRoomData?.ok) {
      router.push(`/chats/${makeChatRoomData.chatroomId}`);
    }
  }, [makeChatRoomData, router]);

  return (
    <Layout title="Products" canGoBack>
      <div className="px-4 py-10 z-1 w-full">
        <div className="mb-8">
          <div className="relative pb-[480px] bg-zinc-500">
            {data?.product ? (
              <Image
                alt=""
                src={`https://imagedelivery.net/93usl5Ygdo4diWvQKul4DQ/${data?.product?.image}/product`}
                className="object-cover"
                layout="fill"
                quality={100}
              />
            ) : null}
          </div>

          <Link href={`/profile/${data?.product?.user?.id}`}>
            <a className="flex py-3 border-t border-b items-center space-x-3 cursor-pointer">
              {data?.product ? (
                <Image
                  alt=""
                  width={48}
                  height={48}
                  src={`https://imagedelivery.net/93usl5Ygdo4diWvQKul4DQ/${data?.product?.user?.avatar}/avatar`}
                  className="w-12 h-12 rounded-full bg-zinc-500"
                />
              ) : null}

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {data?.product?.user?.name}
                </span>

                <span className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </span>
              </div>
            </a>
          </Link>

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
        <div className="border-t-[1.5px] border-gray-200 py-5">
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <a>
                  <div className="h-40 mb-4 relative bg-zinc-500">
                    <Image
                      alt=""
                      src={`https://imagedelivery.net/93usl5Ygdo4diWvQKul4DQ/${product.image}/product`}
                      className="object-cover"
                      layout="fill"
                      quality={100}
                    />
                  </div>
                  <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                  <span className="text-sm font-medium text-gray-900">
                    ${product.price}
                  </span>
                </a>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex bg-white max-w-lg w-full fixed bottom-0 items-center justify-between space-x-2 border-t-[1.5px] border-gray-200 py-2">
          {user?.id === data?.product.user.id ? null : (
            <>
              <Button onClick={onPopUpBtnClick} large text="Talk to seller" />
              <button
                onClick={onFavClick}
                className={cls(
                  "p-3 rounded-md flex items-center justify-center hover:bg-gray-100 active:bg-gray-100",
                  data?.isFav
                    ? "text-red-500 hover:text-red-600 active:text-red-600"
                    : "text-gray-400 hover:text-gray-500 active:text-gray-500"
                )}
              >
                {data?.isFav ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </>
          )}
        </div>
      </div>
      {popUp ? (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 border border-gray-900 rounded-md flex justify-between items-center space-x-3">
          <Button
            onClick={onMakeChatRoomClick}
            text={loading ? "Loading..." : "Make Chatroom"}
          />
          <ButtonGray onClick={onPopUpBtnClick} text="No Thanks" />
        </div>
      ) : null}
    </Layout>
  );
};

export default ItemDetail;
