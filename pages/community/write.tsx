import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import Textarea from "@components/textarea";
import useMutation from "@libs/client/useMutation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Post } from "@prisma/client";
import Router, { useRouter } from "next/router";
import useCoords from "@libs/client/useCoords";

interface WriteForm {
  question: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post;
}

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords();

  const router = useRouter();
  const { register, handleSubmit } = useForm<WriteForm>();
  const [post, { loading, data, error }] =
    useMutation<WriteResponse>("/api/posts");
  const onValid = (data: WriteForm) => {
    if (loading) return;
    post({ ...data, latitude, longitude });
  };
  useEffect(() => {
    if (data && data.ok) {
      router.push(`/community/${data.post.id}`);
    }
  }, [router, data]);
  return (
    <Layout canGoBack title="Write question">
      <form onSubmit={handleSubmit(onValid)} className="px-4 py-10">
        <Textarea
          register={register("question", { required: true, minLength: 5 })}
          required={true}
          placeholder="Ask a question!"
        />
        <Button text={loading ? "Loading..." : "Submit"} />
      </form>
    </Layout>
  );
};

export default Write;
