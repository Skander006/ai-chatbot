import {useContext, createContext, useState} from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(
        localStorage.getItem("user") || null
    );

    const login = (token, userData)=>{
        localStorage.setItem("user", userData);
        localStorage.setItem("token", token);
        setUser(userData);
    }

    const logout = ()=>{
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = ()=> useContext(AuthContext);