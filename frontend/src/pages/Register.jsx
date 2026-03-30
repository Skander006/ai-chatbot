import {useState} from 'react'
import {useAuth} from "../context/Authcontext.jsx";
import {Link, useNavigate} from "react-router-dom";
import api from "../api/axios.js";

export default function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        try{
            const res = await api.post("auth/register", {email, password});
            login(res.data.token, res.data.user);
            navigate("/");
        }
        catch(err){
            setError(res?.response?.data?.error || "Erreur lors de l'inscription");
        }
    }

    return(
        <div className="container">
            <div className="card">
                <h2 className="title">Inscription</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} className="form">
                    <input
                        type="email"
                        className="input"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail.target.value}
                        required
                        />
                    <input
                        type="password"
                        className="input"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword.target.value}
                        required
                        />
                    <button type="submit" className="button">S'inscrire</button>
                    <p className="link">
                        Déjà un compte? <span className="action"><Link to="/login">Se connecter</Link></span>
                    </p>
                </form>
            </div>
        </div>
    )
}

