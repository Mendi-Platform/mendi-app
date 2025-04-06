import Link from "next/link";

interface Props {
  label: string;
  link: string;
}

const Button = ({ label, link }: Props) => {
  return (
    <Link
      className="block text-center py-2.5 rounded-[20px] text-white bg-[#006EFF] hover:opacity-70 text-xl font-semibold"
      href={link}
    >
      {label}
    </Link>
  );
};

export default Button;
