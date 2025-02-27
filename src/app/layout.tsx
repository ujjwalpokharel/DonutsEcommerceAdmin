"use client";
import "./globals.css";
import React from "react";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";

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

const items: MenuProps["items"] = [
  { key: "/category", label: "Category" },
  { key: "/products", label: "Products" },
  { key: "/order", label: "Orders" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const menuHandler: MenuProps["onClick"] = (e) => {
    router.push(e.key);
  };

  return (
    <html lang="en">
      <body>
        {pathname === "/login" ? (
          <div>{children}</div>
        ) : (
          <Layout hasSider>
            <Sider style={siderStyle}>
              <Menu
                onClick={menuHandler}
                theme="dark"
                mode="inline"
                items={items}
                className="pt-4"
              />
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
