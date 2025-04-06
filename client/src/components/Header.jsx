import { Link, useNavigate } from "react-router-dom";
import { UserCircle, Settings } from 'lucide-react';
import logo from '../assets/logoUniConecta.png';


export default function Cabecalho() {
    const navigate = useNavigate();
    return (
        <header className="bg-uniblue-dark text-white flex items-center justify-between p-4 shadow-md">
            <Link to="/">
                <img src={logo} alt="Logo UniConecta" className="h-12 hover:opacity-80 transition" />
            </Link>
            <div className="flex items-center gap-4">
                <button onClick={() => navigate("/configuracoes")}>
                    <Settings className="h-8 w-8 text-white" />
                </button>
                <button onClick={() => navigate("/perfil")}>
                    <UserCircle className="h-8 w-8 text-white" />
                </button>
            </div>
        </header>
    );
}
