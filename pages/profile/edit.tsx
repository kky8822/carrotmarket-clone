import type { NextPage } from "next";
import Button from "../../components/button";
import Input from "../../components/input";

const EditProfie: NextPage = () => {
  return (
    <div className="py-10 px-4 space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-14 h-14 rounded-full bg-zinc-500" />
        <label
          htmlFor="picture"
          className="cursor-pointer px-3 py-2 rounded-md border border-gray-300 shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
        >
          Change
          <input id="picture" type="file" className="hidden" accept="image/*" />
        </label>
      </div>
      <Input label="Email address" name="email" kind="text" />
      <Input label="Phone number" name="phone" kind="phone" />
      <Button text="Update profile" />
    </div>
  );
};

export default EditProfie;
