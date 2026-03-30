import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Chat from "./pages/Chat.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import AuthProvider, {useAuth} from "./context/Authcontext.jsx";

function ProtectedRoute({children}) {
    const {user} = useAuth();
    return user? children : <Navigate to="/login" />
}

export default function App(){
    return(
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}