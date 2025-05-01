import Image from "next/image";
import logo from "@/app/assets/logo/mendi-app.svg";

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-5 border-b border-gray-200">
        <Image 
          src={logo} 
          alt="Mendi" 
          width={100} 
          height={40} 
          priority
        />
      </div>
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col max-w-md mx-auto">{children}</div>
      </div>
    </div>
  );
}
