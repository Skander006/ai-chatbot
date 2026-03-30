import api from "../api/axios.js";
import { useState } from "react";
import {useAuth} from "../context/Authcontext.jsx";
import {Link, useNavigate} from "react-router-dom";

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setError("");
        try{
            const res = api.post("/auth/login", {email, password});
            login(res.data.token, res.data.user);
            navigate('/');
        } catch(err){
            setError(res?.response?.data?.error || 'Erreur de connexion');
        }
    }

    return(
        <div className="container">
            <div className="card">
                <h2 className="title">Connexion</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} className="form">
                    <input
                        className="input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                        />

                    <input
                        className="input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                        />
                    <button type="submit" className="button">Se connecter</button>
                </form>
                <p className="link">
                    Pas de compte? <span className="action"><Link to="/register">S'inscrire</Link></span>
                </p>
            </div>
        </div>
    )
}
