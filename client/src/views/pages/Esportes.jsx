import { useState, useEffect } from "react";
import Header from "../components/Header";
import {
    ouvirEsportes,
    ouvirEsportesDoUsuario,
    participarDoEsporte,
  } from "../../controllers/esporteController";

  export default function Esportes() {
    const [esportes, setEsportes] = useState([]);
    const [esportesDoUsuario, setEsportesDoUsuario] = useState([]);
  
    useEffect(() => {
      const unsubscribe = ouvirEsportes(setEsportes);
      return () => unsubscribe?.();
    }, []);
  
    useEffect(() => {
      const unsubscribe = ouvirEsportesDoUsuario(setEsportesDoUsuario);
      return () => unsubscribe?.();
    }, []);
  
    const handleParticipar = async (id) => {
      try {
        await participarDoEsporte(id);
        alert("Inscrição realizada com sucesso!");
      } catch (err) {
        alert(err.message);
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0e2a] text-white">
        <Header />
        <div className="min-h-screen bg-blue-950 text-white flex flex-col items-center pt-10 px-4">
          <h1 className="text-2xl font-bold mb-6">Esportes Disponíveis</h1>
  
          <ul className="space-y-4">
            {esportes.map((esporte) => {
              const jaParticipa = esportesDoUsuario.includes(esporte.id);
  
              return (
                <li
                  key={esporte.id}
                  className="bg-blue-900 p-4 rounded-lg shadow flex justify-between items-center"
                >
                  <span className="text-lg">{esporte.nome}</span>
                  <button
                    className={`${
                      jaParticipa
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-white hover:bg-gray-100 text-blue-800"
                    } px-4 py-2 rounded`}
                    onClick={() => handleParticipar(esporte.id)}
                  >
                    {jaParticipa ? "Inscrito" : "Participar"}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }