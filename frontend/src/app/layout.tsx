import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import "./globals.css";
import SessionProvider from "@/provider/session";
import '@ant-design/v5-patch-for-react-19';
import QueryProvider from "@/provider/queryClient";
import { LoadingProvider } from "@/provider/loading";
import GlobalSpinner from "@/components/Spinner";




export const metadata: Metadata = {
  title: "Loan Management",
  description: "loan",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en">
    <body>

      <SessionProvider>
        <LoadingProvider>
          <GlobalSpinner />
          <QueryProvider>
            <AntdRegistry>{children}
            </AntdRegistry>
          </QueryProvider>
        </LoadingProvider>
      </SessionProvider>

    </body>
  </html>


}
