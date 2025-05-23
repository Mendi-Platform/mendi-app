"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,    
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation";
import Stepper from "@/components/ui/stepper";
import { useState, useEffect } from "react";
import ButtonOption from "@/components/ui/buttonOption";
import ActionButtons from "../../../../components/ui/action-buttons";

const addressFormSchema = z.object({
  streetAddress: z.string().min(1, { message: "Gateadresse er påkrevd." }),
  addressAdditional: z.string().optional(),
  zipCode: z.string().min(4, { message: "Postnummer må være minst 4 siffer." }),
  city: z.string().min(1, { message: "Poststed er påkrevd." }),
  addressType: z.enum(["home", "work", "other"]),
  saveAddress: z.boolean(),
});

type AddressFormData = z.infer<typeof addressFormSchema>;

interface SavedAddress {
  id: string;
  streetAddress: string;
  addressAdditional?: string;
  zipCode: string;
  city: string;
  addressType: "home" | "work" | "other";
  createdAt: number;
}

const AddressFormPage = () => {
    const router = useRouter();
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [showForm, setShowForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    
    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            streetAddress: "",
            addressAdditional: "",
            zipCode: "",
            city: "",
            addressType: "home",
            saveAddress: false,
        },
    });

    // Load saved addresses AND selected address from localStorage on component mount
    useEffect(() => {
        // Load saved addresses
        const addresses = localStorage.getItem('savedAddresses');
        if (addresses) {
            const parsedAddresses: SavedAddress[] = JSON.parse(addresses);
            const sortedAddresses = parsedAddresses.sort((a, b) => b.createdAt - a.createdAt);
            setSavedAddresses(sortedAddresses);
            
            // Check if there's a previously selected address
            const selectedAddress = localStorage.getItem('selectedDeliveryAddress');
            if (selectedAddress) {
                const parsed = JSON.parse(selectedAddress);
                setSelectedAddressId(parsed.id);
            } else if (sortedAddresses.length > 0) {
                // Auto-select the most recent address if none was previously selected
                setSelectedAddressId(sortedAddresses[0].id);
            } else {
                setShowForm(true);
            }
        } else {
            setShowForm(true);
        }
    }, []);

    // Save selected address to localStorage whenever it changes
    useEffect(() => {
        if (selectedAddressId && savedAddresses.length > 0) {
            const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);
            if (selectedAddress) {
                localStorage.setItem('selectedDeliveryAddress', JSON.stringify(selectedAddress));
            }
        }
    }, [selectedAddressId, savedAddresses]);

    // Watch required fields to determine if form is valid
    const streetAddress = form.watch("streetAddress");
    const zipCode = form.watch("zipCode");
    const city = form.watch("city");
    const addressType = form.watch("addressType");
    
    const isFormValid = streetAddress && zipCode && zipCode.length >= 4 && city && addressType;
     
    function onSubmit(values: AddressFormData) {
        console.log("Address form submitted:", values);
        
        if (editingAddressId) {
            // Update existing address
            const updatedAddresses = savedAddresses.map(addr => 
                addr.id === editingAddressId 
                    ? { ...addr, ...values, id: editingAddressId }
                    : addr
            );
            setSavedAddresses(updatedAddresses);
            localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
            
            // Update selected address if we edited the currently selected one
            if (editingAddressId === selectedAddressId) {
                const updatedAddress = updatedAddresses.find(addr => addr.id === editingAddressId);
                if (updatedAddress) {
                    localStorage.setItem('selectedDeliveryAddress', JSON.stringify(updatedAddress));
                }
            }
            
            setEditingAddressId(null);
            setShowForm(false);
        } else {
            // Save new address if checkbox is checked
            if (values.saveAddress) {
                const newAddress: SavedAddress = {
                    id: Date.now().toString(),
                    streetAddress: values.streetAddress,
                    addressAdditional: values.addressAdditional,
                    zipCode: values.zipCode,
                    city: values.city,
                    addressType: values.addressType,
                    createdAt: Date.now(),
                };
                
                const updatedAddresses = [newAddress, ...savedAddresses];
                setSavedAddresses(updatedAddresses);
                localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
                
                // Auto-select the new address
                setSelectedAddressId(newAddress.id);
                localStorage.setItem('selectedDeliveryAddress', JSON.stringify(newAddress));
            } else {
                // For unsaved addresses, still save as temporary selected address
                const tempAddress: SavedAddress = {
                    id: 'temp-' + Date.now().toString(),
                    streetAddress: values.streetAddress,
                    addressAdditional: values.addressAdditional,
                    zipCode: values.zipCode,
                    city: values.city,
                    addressType: values.addressType,
                    createdAt: Date.now(),
                };
                localStorage.setItem('selectedDeliveryAddress', JSON.stringify(tempAddress));
            }
        }
        
        // Redirect til delivery choice side
        router.push("/order/delivery-choice");
    }

    const handleAddressSelect = (addressId: string) => {
        setSelectedAddressId(addressId);
    };

    const handleContinueWithSelectedAddress = () => {
        if (selectedAddressId) {
            const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);
            if (selectedAddress) {
                localStorage.setItem('selectedDeliveryAddress', JSON.stringify(selectedAddress));
            }
            router.push("/order/delivery-choice");
        }
    };

    const handleAddNewAddress = () => {
        setShowForm(true);
        setEditingAddressId(null);
        form.reset({
            streetAddress: "",
            addressAdditional: "",
            zipCode: "",
            city: "",
            addressType: "home",
            saveAddress: false,
        });
    };

    const handleEditAddress = (addressId: string) => {
        const addressToEdit = savedAddresses.find(addr => addr.id === addressId);
        if (addressToEdit) {
            setEditingAddressId(addressId);
            form.reset({
                streetAddress: addressToEdit.streetAddress,
                addressAdditional: addressToEdit.addressAdditional || "",
                zipCode: addressToEdit.zipCode,
                city: addressToEdit.city,
                addressType: addressToEdit.addressType,
                saveAddress: true,
            });
            setShowForm(true);
        }
    };

    const handleDeleteAddress = (addressId: string) => {
        const updatedAddresses = savedAddresses.filter(addr => addr.id !== addressId);
        setSavedAddresses(updatedAddresses);
        localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
        
        // If we deleted the selected address, select the first remaining one
        if (selectedAddressId === addressId && updatedAddresses.length > 0) {
            setSelectedAddressId(updatedAddresses[0].id);
        } else if (updatedAddresses.length === 0) {
            setShowForm(true);
        }
    };

    const getAddressTypeLabel = (type: "home" | "work" | "other") => {
        switch (type) {
            case "home": return "Hjemme";
            case "work": return "Jobb";
            case "other": return "Annet";
            default: return "Hjemme";
        }
    };

    const getAddressTypeIcon = (type: "home" | "work" | "other") => {
        switch (type) {
            case "home": return "🏠";
            case "work": return "🏢";
            case "other": return "📍";
            default: return "🏠";
        }
    };

    const steps = ["Handlekurv", "Adresse", "Betaling"];
    const currentStep = 2; // Vi er på adresse-steget

    // Check if we can add more addresses (max 5)
    const canAddMoreAddresses = savedAddresses.length < 5;

    // Show address list if we have saved addresses and not showing form
    if (savedAddresses.length > 0 && !showForm) {
        return (
            <>
                {/* Stepper */}
                <div className="mb-8">
                    <Stepper steps={steps} currentStep={currentStep} />
                </div>

                <h1 className="font-medium text-lg mb-3">Leveringsadresse</h1>
                <p className="mb-11 text-sm font-normal text-[#797979]">
                    Legg til andre tjenester i bestillingen eller fortsett til levering.
                </p>

                {/* Address List */}
                <div className="space-y-4 mb-6">
                    {savedAddresses.map((address) => (
                        <div
                            key={address.id}
                            className={`p-4 rounded-[18px] cursor-pointer border transition-all ${
                                selectedAddressId === address.id
                                    ? 'bg-[#BFDAFF] border-[#006EFF]'
                                    : 'bg-[#F3F3F3] border-transparent'
                            }`}
                        >
                            <div 
                                onClick={() => handleAddressSelect(address.id)}
                                className="space-y-1"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{getAddressTypeIcon(address.addressType)}</span>
                                    <span className="text-sm font-medium text-[#797979]">
                                        {getAddressTypeLabel(address.addressType)}
                                    </span>
                                </div>
                                <div className="flex gap-2 text-sm text-[#797979]">
                                    <span>First name</span>
                                    <span>Last name</span>
                                </div>
                                <div className="text-base font-medium">
                                    {address.streetAddress}
                                </div>
                                {address.addressAdditional && (
                                    <div className="text-sm text-[#797979]">
                                        {address.addressAdditional}
                                    </div>
                                )}
                                <div className="text-sm text-[#797979]">
                                    {address.zipCode} {address.city}
                                </div>
                            </div>
                            
                            {/* Action Buttons - Only show when this address is selected */}
                            {selectedAddressId === address.id && (
                                <ActionButtons
                                    onEdit={() => handleEditAddress(address.id)}
                                    onDelete={() => handleDeleteAddress(address.id)}
                                    className="mt-4"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Add New Address Button - Only show if under limit */}
                {canAddMoreAddresses && (
                    <button
                        onClick={handleAddNewAddress}
                        className="flex items-center gap-3 w-full p-4 mb-14 rounded-[18px] bg-[#F3F3F3]"
                    >
                        <div className="w-6 h-6 bg-[#006EFF] rounded-full flex items-center justify-center">
                            <span className="text-white text-lg font-medium">+</span>
                        </div>
                        <span className="text-base font-medium">Legg til ny adresse</span>
                    </button>
                )}

                {/* Message when max addresses reached */}
                {!canAddMoreAddresses && (
                    <div className="text-center text-sm text-[#797979] mb-14">
                        Du kan ha maksimalt 5 lagrede adresser
                    </div>
                )}

                {/* Continue Button */}
                <button
                    onClick={handleContinueWithSelectedAddress}
                    disabled={!selectedAddressId}
                    className={`block w-full text-center py-2.5 rounded-[20px] text-xl font-semibold ${
                        !selectedAddressId
                            ? "bg-white text-[#A7A7A7] border border-black/30 cursor-auto"
                            : "bg-[#006EFF] text-white hover:opacity-70"
                    }`}
                >
                    Videre
                </button>
            </>
        );
    }

    // Show form (either no saved addresses or user clicked "add new")
    return (
        <>
            {/* Stepper */}
            <div className="mb-8">
                <Stepper steps={steps} currentStep={currentStep} />
            </div>

            <h1 className="font-medium text-lg mb-3">
                {editingAddressId ? "Rediger adresse" : "Leveringsadresse"}
            </h1>
            <p className="mb-11 text-sm font-normal text-[#797979]">
                {editingAddressId 
                    ? "Oppdater adressen din."
                    : "Legg inn adressen hvor du vil at plagget skal leveres."
                }
            </p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Address Type Selection - Moved to top */}
                    <FormField
                        control={form.control}
                        name="addressType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Adressetype</FormLabel>
                                <div className="flex gap-3">
                                    <ButtonOption
                                        label="🏠 Hjemme"
                                        active={field.value === "home"}
                                        onClick={() => field.onChange("home")}
                                    />
                                    <ButtonOption
                                        label="🏢 Jobb"
                                        active={field.value === "work"}
                                        onClick={() => field.onChange("work")}
                                    />
                                    <ButtonOption
                                        label="📍 Annet"
                                        active={field.value === "other"}
                                        onClick={() => field.onChange("other")}
                                    />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="streetAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gate og husnummer</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Eksempel: Storgata 1" />
                                </FormControl>              
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="addressAdditional"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Adressetillegg <span className="text-[#A7A7A7]">(valgfritt)</span>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="H0201" />
                                </FormControl>              
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Postnummer</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="0123" />
                                </FormControl>              
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sted</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Oslo" />
                                </FormControl>              
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    {!editingAddressId && (
                        <FormField
                            control={form.control}
                            name="saveAddress"
                            render={({ field }) => (
                                <FormItem className={`flex flex-row items-start space-x-3 space-y-0 ${!isFormValid ? 'opacity-50' : ''}`}>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={!isFormValid}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="text-sm font-normal">
                                            Lagre denne adressen for fremtidige bestillinger
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}
                    
                    <Button 
                        type="submit" 
                        disabled={!isFormValid}
                        className="w-full bg-[#006EFF] text-white py-3 rounded-[20px] text-xl font-semibold hover:opacity-70 disabled:bg-white disabled:text-[#A7A7A7] disabled:border disabled:border-black/30"
                    >
                        {editingAddressId ? "Oppdater adresse" : "Videre"}
                    </Button>
                </form>
            </Form>          
        </>
    );
};

export default AddressFormPage; 