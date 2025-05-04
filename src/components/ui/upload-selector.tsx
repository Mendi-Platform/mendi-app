import Image from "next/image";

interface Props {
  keyId: string;
}

const UploadSelector = ({ keyId }: Props) => {
  return (
    <div className="relative">
      <Image
        className="relative"
        src="/image-upload.png"
        alt="Last opp bilde"
        width={37}
        height={37}
        priority
      />
      <label
        className="cursor-pointer absolute top-0 h-[37px] w-[37px] "
        htmlFor={keyId}
      />              
      <input hidden type="file" id={keyId} accept="image/png, image/jpeg" />
    </div>
  );
};

export default UploadSelector;
