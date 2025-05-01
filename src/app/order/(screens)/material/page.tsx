"use client";

import { Material } from "@/types/formData";
import Button from "../../(components)/button";
import ButtonOption from "../../(components)/buttonOption";
import useFormDataStore from "@/store";

const materialList = [
  {
    label: "Normale tekstiler",
    value: Material.Normal,
    emphasizedDescription: "Normale tekstiler:",
    description: "bomull, jeans, polyester, ullblanding",
  },
  {
    label: "Falskt skinn",
    value: Material.FauxLeather,
    emphasizedDescription: "Falskt skinn:",
    description: "PU-, vegansk-, og imitert skinn",
  },
  {
    label: "Silke eller delikate tekstiler",
    value: Material.Silk,
    emphasizedDescription: "Silke eller delikate tekstiler:",
    description: "Silke, chiffon, sateng, merino, kashmere",
  },
  {
    label: "Tjukke tekstiler",
    value: Material.Thick,
    emphasizedDescription: "Yttertøy eller tjukke tekstiler:",
    description: "Ullkåpe, dunjakke, denimjakke, fleece",
  },
];

const MaterialPage = () => {
  const store = useFormDataStore();
  const formData = store.formData;
  const updateFormData = store.updateFormData;

  const onChoice = (value: Material) => {
    updateFormData({
      ...formData,
      material: value,
    });
  };
  return (
    <>
      <h1 className="font-medium text-lg mb-11">
        Hva beskriver plagget ditt best?
      </h1>
      <div className="flex flex-col gap-3.5 mb-14">
        {materialList.map((material) => (
          <ButtonOption
            key={material.value}
            label={material.label}
            active={formData.material === material.value}
            onClick={() => onChoice(material.value)}
          />
        ))}
      </div>
      {formData.material !== Material.None && (
        <p className="text-sm mb-14">
          <span className="font-semibold">
            {
              materialList.find(
                (material) => material.value === formData.material
              )?.emphasizedDescription
            }
          </span>{" "}
          {
            materialList.find(
              (material) => material.value === formData.material
            )?.description
          }
        </p>
      )}
      <Button
        label="Fortsett"
        link="/order/description"
        prefetch
        disabled={formData.material === Material.None}
      />
    </>
  );
};

export default MaterialPage;
