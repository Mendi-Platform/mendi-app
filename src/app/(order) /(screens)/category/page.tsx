"use client";

import CategoryCard from "@/components/ui/categoryCard";
import useFormDataStore from "@/store";
import { Category, Garment } from "@/types/formData";
import { useRouter } from "next/navigation";
import { CATEGORY_PRICES } from "@/constants/prices";
import { COLORS } from "@/constants/colors";

const OrderServicePage = () => {
  const store = useFormDataStore();
  const router = useRouter();

  const formData = store.formData;
  const updateFormData = store.updateFormData;
  const addToCart = store.addToCart;

  // Base prices for categories - using constants
  const BASE_PRICES = {
    [Category.Standard]: CATEGORY_PRICES.STANDARD,
    [Category.Premium]: CATEGORY_PRICES.PREMIUM,
  };

  const onChoice = (value: Category) => {
    updateFormData({
      ...formData,
      category: value,
      price: value !== Category.None ? BASE_PRICES[value] : undefined,
    });
  };

  const handleAddToCart = () => {
    addToCart();
    router.push("/order/cart");
  };

  const isOuterWear = formData.garment === Garment.OuterWear;

  const isEnabled = formData.category !== Category.None;

  return (
    <div className="w-full max-w-md lg:max-w-2xl mx-auto">
      <h1 className="font-medium text-lg mb-3">Velg etter dine behov:</h1>
      <p
        className="mb-11 text-sm italic"
        style={{ color: COLORS.textSecondary }}
      >
        Velg alternativet som passer deg best.
      </p>
      <div className="flex flex-col gap-3.5 mb-14">
        {isOuterWear ? (
          <div className="pointer-events-none cursor-default">
            <CategoryCard
              formData={formData}
              isActive={formData.category === Category.Premium}
              title="Premium"
              price={BASE_PRICES[Category.Premium]}
              isPopular
              onClick={() => {}}
            />
          </div>
        ) : (
          <>
            <CategoryCard
              formData={formData}
              onClick={() => onChoice(Category.Standard)}
              isActive={formData.category === Category.Standard}
              title="Standard"
              price={BASE_PRICES[Category.Standard]}
            />
            <CategoryCard
              formData={formData}
              onClick={() => onChoice(Category.Premium)}
              isActive={formData.category === Category.Premium}
              isPopular
              title="Premium"
              price={BASE_PRICES[Category.Premium]}
            />
          </>
        )}
      </div>
      {isOuterWear && (
        <div className="text-sm italic mb-6" style={{ color: COLORS.textSecondary }}>
          Vi krever premiumservice for jakker og yttertøy, fordi disse materialene trenger nøye håndtering og spesifikke sømmeteknikker.
        </div>
      )}
      <button
        className="block w-full text-center py-2.5 rounded-[20px] text-xl font-semibold transition-opacity"
        onClick={handleAddToCart}
        disabled={!isEnabled}
        style={{
          backgroundColor: isEnabled ? COLORS.primary : 'white',
          color: isEnabled ? 'white' : COLORS.textDisabled,
          border: isEnabled ? 'none' : '1px solid rgba(0,0,0,0.3)',
        }}
        onMouseOver={(e) => isEnabled && (e.currentTarget.style.opacity = '0.7')}
        onMouseOut={(e) => isEnabled && (e.currentTarget.style.opacity = '1')}
      >
        Legg i handlekurven
      </button>
    </div>
  );
};

export default OrderServicePage;
