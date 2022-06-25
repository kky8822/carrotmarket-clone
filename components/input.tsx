import type { UseFormRegisterReturn } from "react-hook-form";

interface IInput {
  label: string;
  name: string;
  kind?: "text" | "phone" | "price";
  register: UseFormRegisterReturn;
  type: string;
  required: boolean;
}

export default function Input({
  label,
  name,
  kind = "text",
  register,
  type,
  required,
}: IInput) {
  return (
    <div>
      <label
        className="mb-1 block text-sm font-medium text-gray-700"
        htmlFor={name}
      >
        {label}
      </label>
      {kind === "text" ? (
        <div className="rounded-md relative flex  items-center shadow-sm">
          <input
            id={name}
            {...register}
            type={type}
            required={required}
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      ) : null}
      {kind === "phone" ? (
        <div className="flex rounded-md shadow-sm ">
          <span className="flex justify-center items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 select-none text-sm">
            +82
          </span>
          <input
            id={name}
            {...register}
            type={type}
            required={required}
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md rounded-l-none shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      ) : null}

      {kind === "price" ? (
        <div className="rounded-md flex items-center shadow-sm relative">
          <div className="absolute pointer-events-none left-0 pl-3 flex items-center justify-center">
            <span className="text-gray-500 text-sm">$</span>
          </div>
          <input
            id={name}
            {...register}
            type={type}
            required={required}
            className="appearance-none pl-7 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
          <div className="absolute pointer-events-none right-0 pr-3 flex items-center justify-center">
            <span className="text-gray-500">USD</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
