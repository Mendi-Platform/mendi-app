"use client";

import Button from "../../(components)/button";

const OrderDescriptionPage = () => {  
  return (
    <>
      <h1 className="font-medium text-lg mb-3">Beskrivelse <span className="text-[#797979] text-sm font-medium">(valgfritt)</span></h1>
      <p className="mb-11 text-sm font-normal text-[#797979]">
        Her kan du skrive mer om skaden og sin plassering.
      </p>
      <div className="mb-14">
        <textarea placeholder="For eksempel: et hull på høyre kne fra da jeg falt, ganske bredt." className="text-sm px-4 py-6 w-full h-60 border border-[#7A7A7A] rounded-[7.5px]"></textarea>  
      </div>
      
      <Button label="Fortsett" link="/order/image-upload" />
    </>
  );
};

export default OrderDescriptionPage;
