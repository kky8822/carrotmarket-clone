import React from "react";

interface IFloatingBtnPopup {
  onClick: () => void;
  children: React.ReactNode;
}

export default function FloatingBtnPopup({
  onClick,
  children,
}: IFloatingBtnPopup) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-5 hover:bg-orange-500 active:bg-orange-500 border-0 aspect-square border-transparent transition-colors cursor-pointer shadow-xl bg-orange-400 rounded-full w-14 flex items-center justify-center text-white"
    >
      {children}
    </button>
  );
}
