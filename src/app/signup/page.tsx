"use client";
import { constants } from "@/app/_constants/constants";
import { LockOutlined } from "@ant-design/icons";
import { Alert, Card, Form, Input, Typography } from "antd";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
const postData = async (
  url: string,
  data: { email: string; password: string }
) => {
  const response = await axios.post(url, data);
  return response.data;
};
export default function SignUp() {
  const router = useRouter();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [message, setMessage] = useState("");

  const { trigger: mutateSingUp, isMutating } = useSWRMutation<string, unknown>(
    constants.signupUrl,
    (url: string, { arg }: { arg: { email: string; password: string } }) =>
      postData(url, arg),
    {
      onSuccess: (data) => {},
    }
  );

  const handelSignUp = async (values: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const { email, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setIsAlertVisible(true);
      return;
    }
    const formData = { email, password };
    try {
      setIsAlertVisible(false)
      await mutateSingUp(formData as any);
      router.push("/login");
    } catch (e) {
      setMessage(e?.response.data.message);
      setIsAlertVisible(true);
    }
  };
  return (
    <div className="h-[100vh] bg-[#f3f3f3]  ">
      <div className="flex justify-end pr-10 underline text-blue-700 pt-5">
        <Link href={"/login"}>SignIn</Link>
      </div>
      <div className="flex items-center h-[93vh] bg-[#f3f3f3] justify-center">
        <div className="w-96">
          <Card style={{ borderRadius: "6px" }}>
            <Typography.Paragraph className="text-lg font-bold ">
              Sign Up
            </Typography.Paragraph>
            <Form name="signup" onFinish={handelSignUp}>
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
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input password!",
                  },
                  {
                    pattern:
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
                    message:
                      "8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  type="password"
                  size="large"
                  placeholder="Password"
                  name="password"
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: "Please re enter the new password!",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Confirm Password"
                />
              </Form.Item>

              <div className="mt-8 text-center">
                <button
                  type="submit"
                  className="border-2 text-white bg-blue-600 p-2 px-8 rounded-full"
                  disabled={isMutating}
                >
                  {isMutating ? "signing up..." : "Signup"}
                </button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
