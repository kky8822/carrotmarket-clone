import { cls } from "@libs/client/utils";

interface IButton {
  large?: boolean;
  color?: string;
  bottomFix?: boolean;
  text: string;
  [key: string]: any;
}

export default function Button({
  large = false,
  color = "orange",
  bottomFix = false,
  OnClick,
  text,
  ...rest
}: IButton) {
  return (
    <button
      {...rest}
      className={cls(
        "text-white px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2  focus:outline-none",
        large ? "py-3 text-base" : "py-2 text-sm",
        color === "orange"
          ? "bg-orange-500 hover:bg-orange-600 focus:ring-orange-500"
          : "bg-gray-500 hover:bg-gray-600 focus:ring-gray-500",
        bottomFix
          ? "absolute bottom-5 w-3/4 left-1/2 -translate-x-1/2"
          : "w-full"
      )}
    >
      {text}
    </button>
  );
}
