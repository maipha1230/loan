// "use client"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import NavigationBar from "@/components/NavigationBar";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";


export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/sign-in")
    }

    return (<div>
        <NavigationBar></NavigationBar>
        {children}
    </div>)

}