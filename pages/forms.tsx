import { FieldErrors, useForm } from "react-hook-form";

interface IForm {
  username: string;
  email: string;
  password: string;
}

export default function Forms() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({ mode: "onChange" });
  const onValid = (data: IForm) => {};
  const onInvalid = (errors: FieldErrors) => {};

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <input
        {...register("username", {
          required: "Username is required",
          minLength: { value: 5, message: "username should be longer than 5" },
        })}
        type="text"
        placeholder="Username"
      />
      <input
        {...register("email", {
          required: "Email is required",
          validate: {
            notGmail: (value) =>
              !value.includes("@gmail.com") || "gmail is not allowed",
          },
        })}
        type="email"
        placeholder="Email"
      />
      {errors.email?.message}
      <input
        {...register("password", {
          required: "Password is required",
        })}
        type="password"
        placeholder="Password"
      />
      <input type="submit" value="create" />
    </form>
  );
}
