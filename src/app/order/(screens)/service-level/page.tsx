"use client";

import { useRouter } from "next/navigation";
import useFormDataStore from "@/store";
import { Badge } from "@/app/order/(components)/badge";
import { Category } from "@/types/formData";

interface ServiceOption {
  title: string;
  description: string;
  price: string;
  isPopular?: boolean;
  category: Category;
}

export default function ServiceLevelPage() {
  const router = useRouter();
  const { formData, updateFormData } = useFormDataStore();

  const services: ServiceOption[] = [
    {
      title: "Standard",
      description: "Kvalitet til en god pris.",
      price: "Price kr",
      category: Category.Standard,
    },
    {
      title: "Premium",
      description: "Få tilgang til våre mest erfarne syere.",
      price: "Price kr",
      category: Category.Premium,
      isPopular: true
    }
  ];

  const handleServiceSelect = (category: Category) => {
    updateFormData({
      ...formData,
      category
    });
    router.push("/order/temp-cart");
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="font-medium text-lg mb-3">
        Velg etter dine behov:
      </h1>
      <p className="text-sm text-[#797979] mb-6">
        Velg alternativet som passer deg best.
      </p>

      <div className="space-y-4 flex-grow">
        {services.map((service) => (
          <div
            key={service.title}
            onClick={() => handleServiceSelect(service.category)}
            className="relative p-6 rounded-lg cursor-pointer transition-all bg-[#F6F6F6]"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="font-medium text-lg mb-1">{service.title}</h2>
                <p className="text-sm text-[#797979]">{service.description}</p>
              </div>
              {service.isPopular && (
                <Badge className="bg-[#0066FF] text-white font-normal px-3 py-1 whitespace-nowrap">Mest populær</Badge>
              )}
            </div>
            <div className="mt-4">
              <p className="text-right font-medium">{service.price}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => handleServiceSelect(Category.Standard)}
        className="mt-6 w-full border border-[#E5E5E5] text-[#797979] py-3 rounded-lg font-medium bg-white"
      >
        Legg i handlekurven
      </button>
    </div>
  );
} 