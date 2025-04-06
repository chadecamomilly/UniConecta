import { UserCircle, Settings } from 'lucide-react';
import logo from '../assets/logoUniConecta.png';

export default function Cabecalho() {
    return (
        <header className="bg-uniblue-dark text-white flex items-center justify-between p-4 shadow-md">
            <img src={logo} alt="Logo UniConecta" className="h-12" />
            <div className="flex items-center gap-4">
                <Settings className="w-6 h-6 cursor-pointer" />
                <UserCircle className="w-7 h-7 cursor-pointer" />
            </div>
        </header>
    );
}
