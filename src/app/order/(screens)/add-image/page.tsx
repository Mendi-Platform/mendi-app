"use client";

import Button from "../../(components)/button";
import useFormDataStore from "@/store";
import Image from "next/image";
import { useState, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/app/order/(components)/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/app/order/(components)/dialog";
import React from "react";
import { AddButton } from "@/app/order/(components)/add-button";

const AddImagePage = () => {
  const store = useFormDataStore();
  const formData = store.formData;
  const updateFormData = store.updateFormData;
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update carousel position when selected image changes
  React.useEffect(() => {
    if (api && selectedImageIndex !== undefined) {
      api.scrollTo(selectedImageIndex);
    }
  }, [api, selectedImageIndex]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert FileList to array and get URLs
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    
    // Limit to 5 images total
    const updatedImages = [...selectedImages, ...newImages].slice(0, 5);
    setSelectedImages(updatedImages);

    // Store in form data
    updateFormData({
      ...formData,
      repairDetails: {
        ...formData.repairDetails,
        images: updatedImages,
      },
    });

    // Reset the file input to allow new uploads
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    updateFormData({
      ...formData,
      repairDetails: {
        ...formData.repairDetails,
        images: updatedImages,
      },
    });
  };

  const handleAddMoreClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-11">
        <h1 className="font-medium text-lg">
          Vil du legge til bilder?
        </h1>
        <span className="text-sm font-normal text-[#797979]">
          (valgfritt)
        </span>
      </div>
      <p className="mb-6 text-sm font-normal text-[#797979]">
        Du kan legge til opptil 5 bilder av skaden for å hjelpe syeren med å forstå oppdraget.
      </p>

      <div className="mb-14">
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
          id="imageUpload"
          ref={fileInputRef}
          disabled={selectedImages.length >= 5}
        />

        {/* Show upload area only if no images are uploaded yet */}
        {selectedImages.length === 0 && (
          <div className="bg-[#FAFAFA] border border-dashed border-[#7A7A7A] rounded-lg p-6 mb-4 flex flex-col items-center justify-center">
            <label
              htmlFor="imageUpload"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="w-16 h-16 mb-2">
                <Image
                  src="/image-placeholder.svg"
                  alt="Upload image"
                  width={64}
                  height={64}
                />
              </div>
              <span className="text-sm text-[#797979]">
                Klikk for å laste opp bilder
              </span>
            </label>
          </div>
        )}

        {/* Preview area */}
        {selectedImages.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={image}
                    alt={`Uploaded image ${index + 1}`}
                    width={150}
                    height={150}
                    className="rounded-lg object-cover w-full h-[150px] cursor-pointer"
                    onClick={() => {
                      setSelectedImageIndex(index);
                      setIsCarouselOpen(true);
                    }}
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {selectedImages.length < 5 && (
              <AddButton
                label="Legg til flere bilder"
                onClick={handleAddMoreClick}
                className="w-full justify-center"
              />
            )}
          </>
        )}
      </div>

      {/* Image Carousel Modal */}
      <Dialog open={isCarouselOpen} onOpenChange={setIsCarouselOpen}>
        <DialogContent className="sm:max-w-[800px] p-0">
          <DialogTitle className="sr-only">Bildevisning</DialogTitle>
          <DialogDescription className="sr-only">
            Viser bilder i en karusell. Bruk piltastene eller navigasjonsknappene for å bla mellom bildene.
          </DialogDescription>
          <div className="relative">
            <Carousel 
              className="w-full max-w-[800px] p-6"
              setApi={setApi}
              opts={{
                startIndex: selectedImageIndex,
              }}
            >
              <CarouselContent>
                {selectedImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="flex items-center justify-center">
                      <Image
                        src={image}
                        alt={`Uploaded image ${index + 1}`}
                        width={700}
                        height={500}
                        className="rounded-lg object-contain max-h-[70vh]"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-[calc(50%-20px)] -translate-y-1/2 sm:-left-12 h-10 w-10 rounded-full" />
              <CarouselNext className="absolute right-2 top-[calc(50%-20px)] -translate-y-1/2 sm:-right-12 h-10 w-10 rounded-full" />
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        label="Fortsett"
        link="/order/service-level"
        prefetch
        disabled={false}
      />
    </>
  );
};

export default AddImagePage; 