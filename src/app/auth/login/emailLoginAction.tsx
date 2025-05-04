"use server";

import { getAuth, signInWithEmailAndPassword  } from "firebase/auth";
import { firebaseApp } from "@/firebase/firebaseApp";
import { createSession } from "@/lib/session";


const EmailLoginAction = async (email: string, password: string) => {
  const auth = getAuth(firebaseApp);    

  try {
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    await createSession(email);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("there was an errorCode:", errorCode);
    console.log("there was an errorMessage:", errorMessage);
  }  
};

export default EmailLoginAction;
