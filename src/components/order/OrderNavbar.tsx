"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { usePathname } from "next/navigation";
import type { SanitySiteSettings } from "@/sanity/lib/types";

interface OrderNavbarProps {
  siteSettings: SanitySiteSettings | null;
}

const OrderNavbar = ({ siteSettings }: OrderNavbarProps) => {
  const { cart } = useCart();
  const pathname = usePathname();

  // Don't show cart icon on cart or checkout pages
  const hideCartIcon = pathname === "/order/cart" || pathname === "/order/checkout" || pathname === "/order/confirmation";

  const cartItemCount = cart.length + 1; // +1 for static item

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/order/garment" className="hover:opacity-80 transition-opacity">
            {siteSettings?.logo && (
              <Image
                src={siteSettings.logo}
                alt="Mendi"
                width={100}
                height={40}
                priority
                className="h-10 w-auto"
              />
            )}
          </Link>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Help button */}
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Help"
            >
              {siteSettings?.questionIcon && (
                <Image
                  src={siteSettings.questionIcon}
                  alt="Help"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              )}
            </button>

            {/* Cart button with badge */}
            {!hideCartIcon && (
              <Link
                href="/order/cart"
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={`Cart (${cartItemCount} items)`}
              >
                {siteSettings?.cartIcon && (
                  <>
                    <Image
                      src={siteSettings.cartIcon}
                      alt="Cart"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    {/* Cart badge */}
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default OrderNavbar;
