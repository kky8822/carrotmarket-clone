import { cls } from "@libs/client/utils";

interface IButton {
  large?: boolean;
  text: string;
  [key: string]: any;
}

export default function ButtonGray({
  large = false,
  OnClick,
  text,
  ...rest
}: IButton) {
  return (
    <button
      {...rest}
      className={cls(
        "w-full bg-gray-500 hover:bg-gray-600 text-white px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:outline-none",
        large ? "py-3 text-base" : "py-2 text-sm"
      )}
    >
      {text}
    </button>
  );
}
