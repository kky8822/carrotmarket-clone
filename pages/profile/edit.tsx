import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import { useForm } from "react-hook-form";
import useUser from "@libs/client/useUser";
import { useEffect } from "react";
import useMutation from "@libs/client/useMutation";
import Layout from "@components/layout";

interface EditProfileForm {
  email?: string;
  phone?: string;
  name: string;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfie: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<EditProfileForm>();
  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
  }, [user, setValue]);
  const [editProfile, { loading, data, error }] =
    useMutation<EditProfileResponse>("/api/users/me");
  const onValid = ({ name, email, phone }: EditProfileForm) => {
    if (loading) return;
    if (name === "") {
      return setError("formErrors", {
        message: "Username is required.",
      });
    }
    if (email === "" && phone === "") {
      return setError("formErrors", {
        message: "Email or Phone number are required.",
      });
    }
    editProfile({
      name,
      email,
      phone,
    });
  };
  useEffect(() => {
    if (data && !data.ok) {
      setError("formErrors", {
        message: data.error,
      });
    }
  }, [data, setError]);

  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-zinc-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer px-3 py-2 rounded-md border border-gray-300 shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name", { required: true })}
          name="name"
          label="Username"
          type="text"
          required={true}
        />
        <Input
          register={register("email")}
          name="email"
          label="Email address"
          type="email"
          required={false}
        />
        <Input
          register={register("phone")}
          name="phone"
          label="Phone number"
          type="number"
          kind="phone"
          required={false}
        />
        {errors.formErrors ? (
          <span className="my-2 text-red-500 font-medium block text-center">
            {errors.formErrors.message}
          </span>
        ) : null}
        <Button text={loading ? "Loading..." : "Update profile"} />
      </form>
    </Layout>
  );
};

export default EditProfie;
