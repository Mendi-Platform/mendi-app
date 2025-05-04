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
import SignUpAction from "./signupAction";
import { Checkbox } from "@/components/ui/checkbox";

export const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
})


const SignUpPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
        },
      })
     
      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        SignUpAction(values);
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-postadresse</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passord</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fornavn</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etternavn</FormLabel>
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

export default SignUpPage;
