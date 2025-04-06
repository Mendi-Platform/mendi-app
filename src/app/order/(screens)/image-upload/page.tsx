"use client";

import Button from "../../(components)/button";
import UploadSelector from "./upload-selector";

const OrderImageUploadPage = () => {
  return (
    <>
      <h1 className="font-medium text-lg mb-3">
        Legg til bilder{" "}
        <span className="text-[#797979] text-sm font-medium">(valgfritt)</span>
      </h1>
      <p className="mb-11 text-sm font-normal text-[#797979]">
        Ta opptil 5 bilder av skaden slik at syeren kan se hva som må gjøres.
      </p>
      <div className="flex flex-row gap-3 mb-14">
        <UploadSelector keyId="1" />
        <UploadSelector keyId="2" />
        <UploadSelector keyId="3" />
        <UploadSelector keyId="4" />
        <UploadSelector keyId="5" />
      </div>

      <Button label="Fortsett" link="/order/category" />
    </>
  );
};

export default OrderImageUploadPage;
