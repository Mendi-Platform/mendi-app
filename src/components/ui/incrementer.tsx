import { useState } from "react";

const Incrementer = () => {
  const [value, setValue] = useState<number>(1);
  return (
    <div className="flex flex-row justify-between items-center w-[105px]">
      <Button onClick={() => setValue((prev: number) => prev - 1)} />
      <span className="text-base font-medium">{value}</span>
      <Button onClick={() => setValue((prev: number) => prev + 1)} isIncrementer />
    </div>
  );
};

const Button = ({
  onClick,
  isIncrementer = false,
}: {
  isIncrementer?: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer text-[#7A7A7A] font-medium text-xl border h-[30px] w-[30px] flex justify-center items-center rounded-full ${
        isIncrementer
          ? "bg-[#006EFF] text-white border-[#006EFF]"
          : "text-[#7A7A7A] border-[#7A7A7A]"
      }`}
    >
      {isIncrementer ? "+" : "–"}
    </button>
  );
};

export default Incrementer;
