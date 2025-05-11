import { ref, set, get, remove } from 'firebase/database';
import { db } from '../services/firebase';

export async function buscarEventos() {
  try {
    const eventosRef = ref(db, 'eventos');
    const snapshot = await get(eventosRef);

    if (!snapshot.exists()) return [];

    const eventosData = snapshot.val();
    return Object.keys(eventosData).map(id => ({
      id,
      ...eventosData[id],
      start: new Date(eventosData[id].start),
      end: new Date(eventosData[id].end)
    }));
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    throw error;
  }
}

export async function salvarEvento(evento) {
  try {
    const eventosRef = evento.id
      ? ref(db, `eventos/${evento.id}`)
      : ref(db, 'eventos').push();

    await set(eventosRef, {
      title: evento.title,
      descricao: evento.descricao,
      local: evento.local,
      start: evento.start.toISOString(),
      end: evento.end.toISOString()
    });

    return eventosRef.key; // Retorna o ID do evento
  } catch (error) {
    console.error("Erro ao salvar evento:", error);
    throw error;
  }
}

export async function excluirEvento(eventoId) {
  try {
    await remove(ref(db, `eventos/${eventoId}`));
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    throw error;
  }
}