"use client";
import axios from "axios";
import { FormEvent, useState } from "react";
import useSWRMutation from "swr/mutation";
import { constants } from "@/app/_constants/constants";
import { useRouter } from "next/navigation";
const postData = async (
  url: string,
  data: { username: string; password: string }
) => {
  const response = await axios.post(url, data);
  return response.data;
};
interface LogInResponse {
  access_token: string;
}
export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { trigger: mutateLogin, isMutating } = useSWRMutation<
    LogInResponse,
    unknown
  >(
    constants.loginUrl,
    (url: string, { arg }: { arg: { username: string; password: string } }) =>
      postData(url, arg),
    {
      onSuccess: (data) => {
        if (data.access_token) {
          localStorage.setItem("accessToken", data.access_token);
          router.push("/");
        }
      },
      onError: (err) => {
        console.error("Login error:", err);
      },
    }
  );

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { username, password };
    try {
      await mutateLogin(formData as any);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <section className="flex items-center min-h-screen justify-center">
          <div>
            <h1 className="text-xl text-center font-bold mb-8">ADMIN PANEL</h1>
            <div className="mb-6">
              <input
                type="text"
                placeholder="username"
                className="border-2 h-12 w-[400px] bg-slate-100 rounded-full p-4 outline-none"
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="password"
                className="border-2 h-12 w-[400px] bg-slate-100 rounded-full p-4 outline-none"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mt-8 text-center">
              <button
                type="submit"
                className="border-2 text-white bg-blue-600 p-2 px-8 rounded-full"
                disabled={isMutating}
              >
                {isMutating ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}


