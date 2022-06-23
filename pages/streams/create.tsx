import type { NextPage } from "next";
import Button from "../../components/button";
import Input from "../../components/input";
import Textarea from "../../components/textarea";

const Create: NextPage = () => {
  return (
    <div className="py-10 px-4 space-y-5">
      <Input label="Name" name="name" kind="text" />
      <Input label="Price" name="price" kind="price" placeholder="0" />
      <Textarea label="Description" name="description" />

      <Button text="Go live" />
    </div>
  );
};

export default Create;
