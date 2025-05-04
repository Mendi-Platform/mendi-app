"use server";

import { z } from "zod";
import { formSchema } from "./page";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "@/firebase/firebaseApp";

const SignUpAction = async (values: z.infer<typeof formSchema>) => {
    console.log('this is ran on the server', values)

    const auth = getAuth(firebaseApp);
createUserWithEmailAndPassword(auth, values.email, values.password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log('user is logged in', user)
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log('there was an errorCode:', errorCode)
    console.log('there was an errorMessage:', errorMessage)
    // ..
  });

};


export default SignUpAction;
