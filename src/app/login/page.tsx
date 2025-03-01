"use client";
import axios from "axios";
import { FormEvent, useState } from "react";
import useSWRMutation from "swr/mutation";
import { constants } from "@/app/_constants/constants";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, Card, Form, Input, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
const postData = async (
  url: string,
  data: { email: string; password: string }
) => {
  const response = await axios.post(url, data);
  return response.data;
};
interface LogInResponse {
  access_token: string;
}
export default function Login() {
  const router = useRouter();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [message, setMessage] = useState("");
  const { trigger: mutateLogin, isMutating } = useSWRMutation<
    LogInResponse,
    unknown
  >(
    constants.loginUrl,
    (url: string, { arg }: { arg: { email: string; password: string } }) =>
      postData(url, arg),
    {
      onSuccess: (data) => {
        if (data.access_token) {
          localStorage.setItem("accessToken", data.access_token);
          router.push("/");
        }
      },
      onError: (err) => {
        setMessage(err?.response.data.message);
        setIsAlertVisible(true);
      },
    }
  );

  const handleLogin = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    console.log("values", values);
    const formData = { email, password };
    try {
      setIsAlertVisible(false);
      await mutateLogin(formData as any);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="h-[100vh] bg-[#f3f3f3]  ">
      <div className="flex justify-end pr-10 underline text-blue-700 pt-5">
        <Link href={"/signup"}>SignUp</Link>
      </div>
      <div className="flex items-center h-[93vh] justify-center">
        <div className="w-96">
          <Card style={{ borderRadius: "6px" }}>
            <Typography.Paragraph className="text-lg font-bold ">
              Admin Panel
            </Typography.Paragraph>
            <Form name="signIn" onFinish={handleLogin}>
              {isAlertVisible && (
                <Alert
                  description={message}
                  type="error"
                  showIcon
                  style={{ marginBottom: 20 }}
                />
              )}
              <Form.Item name="email">
                <Input size="large" placeholder="Email" name="email" />
              </Form.Item>
              <Form.Item name="password">
                <Input.Password
                  prefix={<LockOutlined />}
                  type="password"
                  size="large"
                  placeholder="Password"
                  name="password"
                />
              </Form.Item>
              <div className="mt-8 text-center">
                <button
                  type="submit"
                  className="border-2 text-white bg-blue-600 p-2 px-8 rounded-full"
                  disabled={isMutating}
                >
                  {isMutating ? "Logging in..." : "Login"}
                </button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
