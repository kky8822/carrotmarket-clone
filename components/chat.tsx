import { cls } from "@libs/client/utils";
import Image from "next/image";

interface IChat {
  message: string;
  avatar: string | null;
  reverse?: boolean;
}

export default function ChatComp({ message, avatar, reverse = false }: IChat) {
  return (
    <div
      className={cls(
        "flex items-start space-x-2",
        reverse ? "flex-row-reverse space-x-reverse" : ""
      )}
    >
      {avatar ? (
        <Image
          alt=""
          width={40}
          height={40}
          src={`https://imagedelivery.net/93usl5Ygdo4diWvQKul4DQ/${avatar}/avatar`}
          className="w-10 h-10 rounded-full bg-zinc-500"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-zinc-500" />
      )}
      <div className="w-1/2 text-sm text-gray-700 p-2 border border-gray-300 rounded-md">
        <p>{message}</p>
      </div>
    </div>
  );
}
