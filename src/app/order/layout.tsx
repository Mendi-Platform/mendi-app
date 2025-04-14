import Image from "next/image";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-5 border-b border-gray-200">
        <Image src="/mendi-logo.png" alt="Mendi" width={100} height={100} />
      </div>
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col max-w-md mx-auto">{children}</div>
      </div>
    </div>
  );
}
