import { onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import { auth } from "../services/firebaseConnection";


interface AuthProviderProps {
  children: ReactNode;
 }
 interface UserProps{
  uid: string;
  name: string | null;
  email: string | null;
}
 type AuthContextData = {
  signed : boolean;
  loadingAuth : boolean;  
  user: UserProps | null;
  handleInfoUser: ({name,email,uid} : UserProps) => void;
 }

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({children}: AuthProviderProps){

  const [user,setUser] = useState<UserProps | null>(null);
  const [loadingAuth,setLoadingAuth] = useState(true);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (user)=>{
      if(user){
        setUser({
          uid: user.uid,
          name: user?.displayName,
          email: user?.email
        
        })
        setLoadingAuth(false);
      }else{
        setUser(null);
        setLoadingAuth(false);
      }

    })
    return () => {
      unsub();
    
    }
  },[])

 function handleInfoUser({name, email,uid} : UserProps){
  setUser({
    name,
    email,
    uid
  })
 
 }



  return(
    <AuthContext.Provider value={{signed: !!user, loadingAuth,  user,handleInfoUser}}>
      {children}
    </AuthContext.Provider>
  )
}
export default AuthProvider;