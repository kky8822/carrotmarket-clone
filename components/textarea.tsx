interface ITextarea {
  label?: string;
  name?: string;
  [key: string]: any;
}

export default function Textarea({ label, name, ...rest }: ITextarea) {
  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className="text-sm mb-1 block font-medium text-gray-700"
        >
          {label}
        </label>
      ) : null}

      <textarea
        id={name}
        className="mt-1 shadow-sm w-full rounded-md border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        rows={4}
        {...rest}
      />
    </div>
  );
}
