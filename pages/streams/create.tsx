import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Textarea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { create } from "domain";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";
import Layout from "@components/layout";

interface CreateForm {
  name: string;
  price: number;
  description: string;
}

interface CreateResponse {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const router = useRouter();
  const [createStream, { data, loading }] =
    useMutation<CreateResponse>("/api/streams");
  const { register, handleSubmit } = useForm<CreateForm>();
  const onValid = (form: CreateForm) => {
    if (loading) return;
    console.log(form);
    createStream(form);
  };
  useEffect(() => {
    if (data && data.ok) {
      router.push(`/streams/${data.stream.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Streams">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-5">
        <Input
          register={register("name", { required: true })}
          label="Name"
          name="name"
          kind="text"
          type="text"
          required={true}
        />
        <Input
          register={register("price", { required: true, valueAsNumber: true })}
          label="Price"
          name="price"
          kind="price"
          placeholder="0"
          required={true}
          type={"number"}
        />
        <Textarea
          register={register("description", { required: true })}
          label="Description"
          name="description"
          required={true}
        />

        <Button text={loading ? "Loading..." : "Go live"} />
      </form>
    </Layout>
  );
};

export default Create;
