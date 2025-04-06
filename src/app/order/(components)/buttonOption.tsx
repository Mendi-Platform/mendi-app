import Image, { StaticImageData } from "next/image";

interface Props {
  label: string;
  logo?: StaticImageData;
  active: boolean;
  onClick: () => void;
}

const ButtonOption = ({ label, logo, active, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-row items-center gap-3 rounded-[18px] px-6 h-15 cursor-pointer ${
        active ? "bg-[#BFDAFF]" : "bg-[#F3F3F3]"
      }`}
    >
      {logo && <IconWrapper icon={logo} />}
      <span className="text-base font-medium">{label}</span>
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
