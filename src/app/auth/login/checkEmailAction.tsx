"use server";

import { firebaseApp } from "@/firebase/firebaseApp";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";


const CheckEmailAction = async (email: string) => {
  const db = getFirestore(firebaseApp);

  const userRef = collection(db, "user");  

  try {
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    let found = false;

    querySnapshot.forEach((doc) => {      
      if(doc.exists()) {        
        console.log("found")
        found = true;
        return;
      }      
    });
    return found;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }    
};

export default CheckEmailAction;
