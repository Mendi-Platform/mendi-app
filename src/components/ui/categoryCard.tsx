import Image, { StaticImageData } from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { FormData, RepairType } from "@/types/formData";
import { Badge } from "@/components/ui/badge";
import {
  getRepairTypeLabel,
  getServiceLabel,
  getGarmentLabel,
} from "@/utils/enumLabels";
import DamageMarkerDisplay from "@/components/ui/damage-marker-display";

interface Props {
  title: string;
  isPopular?: boolean;
  isActive: boolean;
  onClick: () => void;
  formData: FormData;
  logo?: StaticImageData | string;
  onEdit?: () => void;
  onDelete?: () => void;
  variant?: "default" | "cart";
  price?: number;
}

const ActionButtons = ({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) => (
  <div className="flex justify-center gap-4 mt-6">
    {onDelete && (
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F6F6F6] hover:bg-[#E2E2E2]"
      >
        <Trash2 size={16} />
      </button>
    )}
    {onEdit && (
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onEdit(); }}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F6F6F6] hover:bg-[#E2E2E2]"
      >
        <Pencil size={16} />
      </button>
    )}
  </div>
);

const CategoryCard = ({
  isActive,
  title,
  onClick,
  isPopular = false,
  formData,
  logo,
  onEdit,
  onDelete,
  variant = "default",
  price,
}: Props) => {
  const topRow = (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        {logo && <IconWrapper icon={logo} />}
        <div>
          <div className="font-semibold text-base">
            {variant === "cart"
              ? getRepairTypeLabel(formData.repairType)
              : title}
          </div>
          <div className="font-semibold text-sm">
            {variant === "cart"
              ? getGarmentLabel(formData.garment)
              : "Item"}
          </div>
          <div className="text-sm">
            {variant === "cart"
              ? (formData.category === 2 ? "Standard" : formData.category === 1 ? "Premium" : "")
              : "Plan"}
          </div>
        </div>
      </div>
      <div className="font-bold text-base">
        {variant === "cart"
          ? (formData.price ? `${formData.price} kr` : "")
          : price ? `${price} kr` : ""}
      </div>
    </div>
  );

  // Helper function to count damage markers - simplified
  const getDamageMarkerSummary = (formData: FormData) => {
    if (!formData.repairDetails?.damageMarkers) return null;
    
    const frontCount = formData.repairDetails.damageMarkers.front?.length || 0;
    const backCount = formData.repairDetails.damageMarkers.back?.length || 0;
    
    if (frontCount === 0 && backCount === 0) return null;
    
    const totalCount = frontCount + backCount;
    return `${totalCount} skade${totalCount > 1 ? 'r' : ''} markert`;
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer ${
        isActive ? "bg-[#BFDAFF] p-6" : "bg-[#F3F3F3] px-6 py-4"
      } rounded-[18px]`}
    >
      {variant === "cart" ? (
        <>
          {topRow}
          {isActive && (
            <>
              <hr className="my-4 border border-[#E5E5E5]" />
              <div className="mt-4">
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                    <InfoSection
                      title="Plagg"
                      value={getGarmentLabel(formData.garment)}
                    />
                    
                    <InfoSection
                      title="Tjeneste"
                      value={formData.repairType ? getRepairTypeLabel(formData.repairType) : getServiceLabel(formData.service)}
                      rightAlign
                    />
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      {formData.repairType === RepairType.Hole && 
                       formData.repairDetails?.damageMarkers && 
                       (formData.repairDetails.damageMarkers.front?.length > 0 || 
                        formData.repairDetails.damageMarkers.back?.length > 0) ? (
                        <>
                          <InfoSection
                            title="Markerte skader"
                            value={getDamageMarkerSummary(formData)!}
                          />
                          <div className="mt-2 ml-0">
                            <DamageMarkerDisplay 
                              garment={formData.garment}
                              damageMarkers={formData.repairDetails.damageMarkers}
                              size="small"
                            />
                          </div>
                        </>
                      ) : (
                        formData.repairDetails?.images && formData.repairDetails.images.length > 0 && (
                          <>
                            <InfoSection
                              title="Bilder"
                              value={`${formData.repairDetails.images.length} bilde${formData.repairDetails.images.length > 1 ? 'r' : ''}`}
                            />
                            <div className="mt-2 flex gap-2">
                              {formData.repairDetails.images.map((img, idx) => (
                                <Image
                                  key={idx}
                                  src={img}
                                  alt={`Bilde ${idx + 1}`}
                                  width={48}
                                  height={48}
                                  className="rounded object-cover border border-gray-200"
                                />
                              ))}
                            </div>
                          </>
                        )
                      )}
                    </div>
                    
                    <InfoSection
                      title="Detaljer"
                      value={formData.repairDetails?.detailsText || "Ingen detaljer"}
                      rightAlign
                    />
                  </div>
                </div>
                
                {formData.repairType === RepairType.Hole && 
                 formData.repairDetails?.images && 
                 formData.repairDetails.images.length > 0 && (
                  <div className="mt-6">
                    <div className="text-xs text-[#7F7F7F] mb-2">Bilder</div>
                    <div className="flex gap-2 mb-4">
                      {formData.repairDetails.images.map((img, idx) => (
                        <Image
                          key={idx}
                          src={img}
                          alt={`Bilde ${idx + 1}`}
                          width={48}
                          height={48}
                          className="rounded object-cover border border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <ActionButtons onEdit={onEdit} onDelete={onDelete} />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start gap-3">
              {logo && <IconWrapper icon={logo} />}
              <div className="flex flex-col justify-center">
                <h3 className="font-medium text-base mb-0.5 pt-1">{title}</h3>
                {title === "Standard" && (
                  <p className="text-sm text-[#797979]">Kvalitet til en god pris.</p>
                )}
                {title === "Premium" && (
                  <p className="text-sm text-[#797979]">Få tilgang til våre mest erfarne syere.</p>
                )}
              </div>
            </div>
            {isPopular && (
              <Badge 
                variant="secondary" 
                size="wide"
                className="bg-[#006EFF] text-white"
              >
                Mest populær
              </Badge>
            )}
          </div>
          <div className="flex justify-end font-bold text-[22px] mb-2">
            {price ? `${price} kr` : ""}
          </div>
          {isActive && (
            <div className="flex flex-col gap-4 mt-4 border-t border-t-[#E5E5E5] pt-6">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <InfoSection
                    title="Plagg"
                    value={getGarmentLabel(formData.garment)}
                  />
                  
                  <InfoSection
                    title="Tjeneste"
                    value={formData.repairType ? getRepairTypeLabel(formData.repairType) : getServiceLabel(formData.service)}
                    rightAlign
                  />
                </div>
                
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    {formData.repairType === RepairType.Hole && 
                     formData.repairDetails?.damageMarkers && 
                     (formData.repairDetails.damageMarkers.front?.length > 0 || 
                      formData.repairDetails.damageMarkers.back?.length > 0) ? (
                      <>
                        <InfoSection
                          title="Markerte skader"
                          value={getDamageMarkerSummary(formData)!}
                        />
                        <div className="mt-2 ml-0">
                          <DamageMarkerDisplay 
                            garment={formData.garment}
                            damageMarkers={formData.repairDetails.damageMarkers}
                            size="small"
                          />
                        </div>
                      </>
                    ) : (
                      formData.repairDetails?.images && formData.repairDetails.images.length > 0 && (
                        <>
                          <InfoSection
                            title="Bilder"
                            value={`${formData.repairDetails.images.length} bilde${formData.repairDetails.images.length > 1 ? 'r' : ''}`}
                          />
                          <div className="mt-2 flex gap-2">
                            {formData.repairDetails.images.map((img, idx) => (
                              <Image
                                key={idx}
                                src={img}
                                alt={`Bilde ${idx + 1}`}
                                width={48}
                                height={48}
                                className="rounded object-cover border border-gray-200"
                              />
                            ))}
                          </div>
                        </>
                      )
                    )}
                  </div>
                  
                  <InfoSection
                    title="Detaljer"
                    value={formData.repairDetails?.detailsText || "Ingen detaljer"}
                    rightAlign
                  />
                </div>
              </div>
              
              {formData.repairType === RepairType.Hole && 
               formData.repairDetails?.images && 
               formData.repairDetails.images.length > 0 && (
                <div className="mt-6">
                  <div className="text-xs text-[#7F7F7F] mb-2">Bilder</div>
                  <div className="flex gap-2 mb-4">
                    {formData.repairDetails.images.map((img, idx) => (
                      <Image
                        key={idx}
                        src={img}
                        alt={`Bilde ${idx + 1}`}
                        width={48}
                        height={48}
                        className="rounded object-cover border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const IconWrapper = ({ icon }: { icon: StaticImageData | string }) => (
  <div className="bg-[#E2E2E2] border border-[#006EFF] h-12 w-12 flex justify-center items-center rounded-[11px]">
    <Image src={icon} alt="icon" width={40} height={40} />
  </div>
);

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