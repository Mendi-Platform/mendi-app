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
import { deliveryFormSchema } from "@/lib/validations/delivery"

const DeliveryPage = () => {
    const form = useForm<z.infer<typeof deliveryFormSchema>>({
        resolver: zodResolver(deliveryFormSchema),
        defaultValues: {
            streetAddress: "",
            addressAdditional: "",
            zipCode: "",
            city: "",
        },
    })
     
    function onSubmit(values: z.infer<typeof deliveryFormSchema>) {
        console.log(values)
    }

    return (
        <>
            <h1 className="font-medium text-lg mb-3">Registrer deg</h1>
            <p className="mb-11 text-sm font-normal text-[#797979]">
                På et sting! 
            </p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="streetAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gate og husnummer</FormLabel>
                                <FormControl>
                                    <Input {...field} required />
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
                                <FormLabel>Adressetillegg (valgfritt)</FormLabel>
                                <FormControl>
                                    <Input {...field} />
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
                                    <Input {...field} />
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
                                    <Input {...field} />
                                </FormControl>              
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Checkbox/>
                    <Button type="submit">Submit</Button>
                </form>
            </Form>          
        </>
    );
};

export default DeliveryPage;
