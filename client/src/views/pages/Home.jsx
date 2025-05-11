import { useState } from "react";
import Publicacoes from "../components/Publicacoes";
import Calendario from "../components/Calendario";
import Header from "../components/Header";

export default function Home() {
  const [abaAtiva, setAbaAtiva] = useState("publicacoes");

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e2a] text-white">
      
      <Header />

      <div className="flex-grow p-4">
        {abaAtiva === "publicacoes" ? <Publicacoes /> : <Calendario />}
      </div>

      <nav className="fixed bottom-0 w-full bg-uniblue-dark shadow-inner  flex justify-around text-black">
        <button
          onClick={() => setAbaAtiva("publicacoes")}
          className={`p-4 flex-1 text-center ${abaAtiva === "publicacoes" ? "text-blue-600 font-bold" : "text-gray-500"}`}
        >
          📝 Publicações
        </button>
        <button
          onClick={() => setAbaAtiva("calendario")}
          className={`p-4 flex-1 text-center ${abaAtiva === "calendario" ? "text-blue-600 font-bold" : "text-gray-500"}`}
        >
          📅 Calendário
        </button>
      </nav>
    </div>
  );
}
