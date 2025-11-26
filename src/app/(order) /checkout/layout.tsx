import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  console.log("session", session);

  if (!session.isAuth) {
    redirect("/auth/signup");
  }
  return <div className="">{children}</div>;
}
