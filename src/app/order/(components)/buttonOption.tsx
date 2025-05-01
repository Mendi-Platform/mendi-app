import Image, { StaticImageData } from "next/image";

interface Props {
  label: string;
  logo?: StaticImageData;
  active: boolean;
  onClick: () => void;
  subText?: string;
  price?: number;
}

const ButtonOption = ({ label, logo, active, onClick, subText, price }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-row items-center justify-between rounded-[18px] px-6 py-4 cursor-pointer ${
        active ? "bg-[#BFDAFF]" : "bg-[#F3F3F3]"
      }`}
    >
      <div className="flex items-center gap-3">
        {logo && <IconWrapper icon={logo} />}
        <div className="flex flex-col">
          <span className="text-base font-medium">{label}</span>
          {subText && (
            <span className="text-sm text-[#797979]">{subText}</span>
          )}
        </div>
      </div>
      {price !== undefined && (
        <span className="text-base font-medium">{price} kr</span>
      )}
    </div>
  );
};

const IconWrapper = ({ icon }: { icon: StaticImageData }) => {
  return (
    <div className="bg-[#E2E2E2] border border-[#006EFF] h-12 w-12 flex justify-center items-center rounded-[11px]">
      <Image src={icon} alt="Picture of the author" />
    </div>
  );
};

export default ButtonOption;
