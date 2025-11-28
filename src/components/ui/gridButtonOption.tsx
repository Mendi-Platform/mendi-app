import Image, { StaticImageData } from "next/image";

interface Props {
  label: string;
  logo?: StaticImageData | string;
  active: boolean;
  onClick: () => void;
  subText?: string;
  price?: number;
  priceText?: string;
}

const GridButtonOption = ({ label, logo, active, onClick, subText, price, priceText }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-2xl p-6 cursor-pointer transition-all ${
        active
          ? "bg-[#BFDAFF] border-2 border-[#006EFF]"
          : "bg-[#F3F3F3] border-2 border-transparent hover:border-[#006EFF]/30"
      }`}
    >
      {logo && <IconWrapper icon={logo} />}
      <div className="flex flex-col items-center text-center mt-4">
        <span className="text-base font-medium">{label}</span>
        {subText && (
          <span className="text-sm text-[#797979] mt-1">{subText}</span>
        )}
        {(price !== undefined || priceText) && (
          <span className="text-base font-medium mt-2">
            {priceText || `${price} kr`}
          </span>
        )}
      </div>
    </div>
  );
};

const IconWrapper = ({ icon }: { icon: StaticImageData | string }) => {
  const isUrl = typeof icon === 'string';

  return (
    <div className="bg-[#E2E2E2] border border-[#006EFF] h-16 w-16 flex justify-center items-center rounded-xl">
      <Image
        src={icon}
        alt="Icon"
        width={isUrl ? 40 : undefined}
        height={isUrl ? 40 : undefined}
        className="object-contain"
      />
    </div>
  );
};

export default GridButtonOption;
