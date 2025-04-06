import { useNavigate } from "react-router-dom";
import Box from "../components/Box";
import Header from "../components/Header";

export default function Configuracoes() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0e2a] text-white">
            <Header />
            <div className="min-h-screen bg-blue-950 text-white flex flex-col items-center pt-10 px-4">
                <h1 className="text-2xl font-bold mb-6">Configurações</h1>

                <Box>
                    <button
                        onClick={() => navigate("/esportes")}
                        className="w-full bg-white text-blue-800 font-semibold py-2 px-4 rounded hover:bg-gray-100"
                    >
                        Esportes
                    </button>
                </Box>
            </div>
        </div>
    );
}
