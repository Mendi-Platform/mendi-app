import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/logo/mendi-app.svg";
import { verifySession } from "@/lib/dal";
import questionIcon from "@/app/assets/icons/question-icon.svg";
import cartIcon from "@/app/assets/icons/cart-icon.svg";

export default async function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession()
    console.log('session', session)
  return (
    <div className="min-h-screen bg-white">
      <div className="px-5 border-b border-gray-200">
        <div className="flex items-center justify-between h-16">
          <Link href="/order/garment">
            {logo && (
              <Image 
                src={logo} 
                alt="Mendi" 
                width={100} 
                height={40} 
                priority
              />
            )}
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              {questionIcon && (
                <Image 
                  src={questionIcon} 
                  alt="Help" 
                  width={24} 
                  height={24}
                  style={{ width: 24, height: 'auto' }}
                />
              )}
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              {cartIcon && (
                <Image 
                  src={cartIcon} 
                  alt="Cart" 
                  width={24} 
                  height={24}
                  style={{ width: 24, height: 'auto' }}
                />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col max-w-md lg:max-w-4xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
