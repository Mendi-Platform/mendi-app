import { FormData } from "@/types/formData";
import {
  getRepairTypeLabel,
  getServiceLabel,
  getGarmentLabel,
  getMaterialLabel,
} from "@/utils/enumLabels";

interface Props {
  title: string;
  description: string;
  price: number;
  isPopular?: boolean;
  isActive: boolean;
  onClick: () => void;
  formData: FormData;
}

const CategoryCard = ({
  isActive,
  title,
  description,
  price,
  onClick,
  isPopular = false,
  formData,
}: Props) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer ${
        isActive ? "bg-[#BFDAFF]" : "bg-[#F3F3F3]"
      } p-6 rounded-[18px]`}
    >
      <div>
        {isPopular && (
          <span className="bg-[#006EFF] text-white text-xs font-normal rounded-2xl px-2 py-1 float-end">
            Mest populær
          </span>
        )}
        <h3 className="font-medium text-2xl">{title}</h3>
        <p className="font-normal text-base text-[#242424] mb-6">
          {description}
        </p>
        <span
          className={`flex justify-end ${
            isActive ? "font-bold" : "font-normal"
          } text-[28px]`}
        >
          {price} kr
        </span>
      </div>
      {isActive && (
        <div className="flex flex-col gap-8 mt-4 border-t border-t-white pt-6">
          <div className="flex flex-row justify-between">
            <InfoSection
              title="Tjeneste"
              value={getServiceLabel(formData.service)}
            />
            <InfoSection
              title="Reparasjonstype"
              value={getRepairTypeLabel(formData.repairType)}
              rightAlign
            />
          </div>
          <div className="flex flex-row justify-between">
            <InfoSection
              title="Plagg"
              value={getGarmentLabel(formData.garment)}
            />
            <InfoSection
              title="Materiale"
              value={getMaterialLabel(formData.material)}
              rightAlign
            />
          </div>
        </div>
      )}
    </div>
  );
};

const InfoSection = ({
  title,
  value,
  rightAlign = false,
}: {
  title: string;
  value: string;
  rightAlign?: boolean;
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${rightAlign ? "items-end" : ""}`}>
      <span className="text-[#7F7F7F] text-xs font-normal">{title}</span>
      <span className="text-[#242424] text-sm font-normal">{value}</span>
    </div>
  );
};

export default CategoryCard;
