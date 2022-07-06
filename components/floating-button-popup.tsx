import { motion } from "framer-motion";
import React from "react";

interface IFloatingBtnPopup {
  onClick: () => void;
  children: React.ReactNode;
  [key: string]: any;
}

export default function FloatingBtnPopup({
  onClick,
  children,
  ...rest
}: IFloatingBtnPopup) {
  return (
    <button
      {...rest}
      onClick={onClick}
      className="fixed bottom-24 right-5 hover:bg-orange-500 active:bg-orange-500 border-0 aspect-square border-transparent transition-colors cursor-pointer shadow-xl bg-orange-400 rounded-full w-14 flex items-center justify-center text-white"
    >
      {children}
    </button>
  );
}
