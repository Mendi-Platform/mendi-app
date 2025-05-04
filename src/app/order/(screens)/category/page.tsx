"use client";

import CategoryCard from "@/components/ui/categoryCard";
import useFormDataStore from "@/store";
import { Category, Garment } from "@/types/formData";
import { useRouter } from "next/navigation";

const OrderServicePage = () => {
  const store = useFormDataStore();
  const router = useRouter();

  const formData = store.formData;
  const updateFormData = store.updateFormData;
  const addToCart = store.addToCart;

  // Base prices for categories
  const BASE_PRICES = {
    [Category.Standard]: 399,
    [Category.Premium]: 499,
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

  return (
    <>
      <h1 className="font-medium text-lg mb-3">Velg etter dine behov:</h1>
      <p
        className="mb-11"
        style={{
          color: '#797979',
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
          fontStyle: 'italic',
          fontWeight: 400,
          lineHeight: 'normal',
        }}
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
        <div className="text-sm text-[#797979] italic mb-6">
          Vi krever premiumservice for jakker og yttertøy, fordi disse materialene trenger nøye håndtering og spesifikke sømmeteknikker.
        </div>
      )}
      <button
        className="block w-full text-center py-2.5 rounded-[20px] bg-[#006EFF] text-white hover:opacity-70 text-xl font-semibold disabled:bg-white disabled:text-[#A7A7A7] disabled:border disabled:border-black/30"
        onClick={handleAddToCart}
        disabled={formData.category === Category.None}
      >
        Legg i handlekurven
      </button>
    </>
  );
};

export default OrderServicePage;
