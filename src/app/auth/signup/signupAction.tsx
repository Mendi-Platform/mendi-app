"use server";

import { z } from "zod";
import { formSchema } from "./page";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "@/firebase/firebaseApp";
import { createSession } from "@/lib/session";

const SignUpAction = async (values: z.infer<typeof formSchema>) => {
  const auth = getAuth(firebaseApp);  

  try {
    await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );

    await createSession(values.email ?? "");

    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("there was an errorCode:", errorCode);
    console.log("there was an errorMessage:", errorMessage);
  }  
};

export default SignUpAction;
