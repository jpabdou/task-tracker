"use client"
import React, { FC, createContext,useContext , useState } from "react";
import Realm, { App, Credentials } from "realm-web";

// Creating a Realm App Instance
const app = new App(process.env.NEXT_PUBLIC_APP_ID || "");
 


const defaultUser = {};
export var UserContext = createContext(defaultUser);
export var useGlobalContext = () => useContext(UserContext)

export const UserProvider= ({ children }) => {
 const [alertMessage, setAlertMessage] = useState({message: "", severity: ""})


 return <UserContext.Provider value={
  { 
    alertMessage,
    setAlertMessage, 
    }}>
   {children}
 </UserContext.Provider>;
}
