"use client";
import "./globals.css";
import React, { useEffect } from "react";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const { Content, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarColor: "unset",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const LogOut = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  const items = [
    {
      label: (
        <Link href={"/category"} className="text-lg">
          Category
        </Link>
      ),
      key: "Category",
    },
    {
      label: (
        <Link href={"/products"} className="text-lg">
          Products
        </Link>
      ),
      key: "products",
    },
    {
      label: (
        <Link href={"/order"} className="text-lg">
          Orders
        </Link>
      ),
      key: "Orders",
    },
    // {
    //   label: (
    //     <div className="flex justify-center text-white pr-10 underline items-end pt-5">
    //       <p onClick={LogOut}>Log Out</p>
    //     </div>
    //   ),
    //   key: "logout",
    // },
  ];
  const router = useRouter();
  const pathname = usePathname();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  useEffect(() => {
    if (!token) {
      if (typeof window !== "undefined") {
        router.push(`/login`);
      }
    }
  }, [token]);

  return (
    <html lang="en">
      <body>
        {pathname === "/login" || pathname === "/signup" ? (
          <div>{children}</div>
        ) : (
          <Layout hasSider>
            <Sider style={siderStyle}>
              <Menu
                theme="dark"
                mode="inline"
                items={items}
                className="pt-4 "
              />
              <div className=" absolute bottom-0 text-lg text-white pb-10 pl-10 underline  ">
                <p className="cursor-pointer" onClick={LogOut}>
                  Log Out
                </p>
              </div>
            </Sider>
            <Layout style={{ marginInlineStart: 200 }}>
              <Content
                style={{ margin: "24px 16px 0" }}
                className="min-h-screen"
              >
                {children}
              </Content>
            </Layout>
          </Layout>
        )}
      </body>
    </html>
  );
}
