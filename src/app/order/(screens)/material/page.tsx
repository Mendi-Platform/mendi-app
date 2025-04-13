"use client";

import { FormContext, Material } from "@/provider/FormProvider";
import Button from "../../(components)/button";
import ButtonOption from "../../(components)/buttonOption";
import { useContext } from "react";

const materialList = [
  {
    label: "Normale tekstiler",
    value: Material.Normal,
    emphasizedDescription: "Normale tekstiler:",
    description: "bomull, jeans, polyester, ullblanding",
  },
  {
    label: "Falskt skinn",
    value: Material.FalsktSkinn,
    emphasizedDescription: "Falskt skinn:",
    description: "PU-, vegansk-, og imitert skinn",
  },
  {
    label: "Silke eller delikate tekstiler",
    value: Material.Silke,
    emphasizedDescription: "Silke eller delikate tekstiler:",
    description: "Silke, chiffon, sateng, merino, kashmere",
  },
  {
    label: "Tjukke tekstiler",
    value: Material.Tjukke,
    emphasizedDescription: "Yttertøy eller tjukke tekstiler:",
    description: "Ullkåpe, dunjakke, denimjakke, fleece",
  },
];

const OrderItemPage = () => {
  const formContext = useContext(FormContext);

  const choice = formContext.formData.material;

  const onChoice = (value: Material) => {
    formContext.updateFormData({
      ...formContext.formData,
      material: value,
    });
  };
  return (
    <>
      <h1 className="font-medium text-lg mb-3">
        Hva beskriver plagget ditt best?
      </h1>
      <p className="mb-11 text-sm font-normal text-[#797979]">
        Velg ett alternativ. Noen materialer krever premium service.
      </p>
      <div className="flex flex-col gap-3.5 mb-14">
        {materialList.map((material) => (
          <ButtonOption
            key={material.value}
            label={material.label}
            active={choice === material.value}
            onClick={() => onChoice(material.value)}
          />
        ))}
      </div>
      {choice !== undefined && (
        <p className="text-sm mb-14">
          <span className="font-semibold">
            {
              materialList.find((material) => material.value === choice)
                ?.emphasizedDescription
            }
          </span>{" "}
          {
            materialList.find((material) => material.value === choice)
              ?.description
          }
        </p>
      )}
      <Button label="Fortsett" link="/order/description" />
    </>
  );
};

export default OrderItemPage;
