import Link from "next/link";

interface Props {
  label: string;
  link: string;
  disabled?: boolean;
  prefetch?: boolean;
}

const Button = ({ label, link, disabled, prefetch = false }: Props) => {
  return (
    <Link
      prefetch={prefetch}
      onNavigate={(e) => {
        if (disabled) {
          e.preventDefault();
        }
      }}
      className={`block text-center py-2.5 rounded-[20px]  ${
        disabled
          ? "bg-white text-[#A7A7A7] border border-black/30 cursor-auto"
          : "bg-[#006EFF] text-white"
      } hover:opacity-70 text-xl font-semibold`}
      href={link}
    >
      {label}
    </Link>
  );
};

export default Button;
