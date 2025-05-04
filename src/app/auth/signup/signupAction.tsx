"use server";

import { z } from "zod";
import { signupSchema } from "@/lib/validations/auth";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "@/firebase/firebaseApp";
import { createSession } from "@/lib/session";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const SignUpAction = async (values: z.infer<typeof signupSchema>) => {
  const auth = getAuth(firebaseApp);  
  const db = getFirestore(firebaseApp);

  try {
    const user = await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );

    await createSession(values.email ?? "");

    try {
      await addDoc(collection(db, "user"), {
        name: values.name,
        phone: values.phone,
        email: values.email,
        userId: user.user.uid,
      });      
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("there was an errorCode:", errorCode);
    console.log("there was an errorMessage:", errorMessage);
  }  
};

export default SignUpAction;
