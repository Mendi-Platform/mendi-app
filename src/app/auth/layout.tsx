import { verifySession } from "@/lib/dal";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession()
  console.log('session', session)


  return (
    <div className="min-h-screen bg-white">
      <div className="px-5">
        MENDI
      </div>
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col max-w-md mx-auto">{children}</div>
      </div>
    </div>
  );
}
