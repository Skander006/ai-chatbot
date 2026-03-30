import { useAuth } from '../context/Authcontext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ model, setModel }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    console.log(user);
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <h1 className="logo">💬 AI Chatbot</h1>
            <div className="content-navbar">
                <select
                    className="models"
                    value={model}
                    onChange={e => setModel(e.target.value)}
                >
                    <option value="llama-3.3-70b-versatile">Llama 3.3 70B</option>
                    <option value="llama-3.1-8b-instant">Llama 3.1 8B</option>
                    <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                </select>
                <span className="email">{user.email}</span>
                <button className="button-navbar" onClick={handleLogout}>Déconnexion</button>
            </div>
        </nav>
    );
}
