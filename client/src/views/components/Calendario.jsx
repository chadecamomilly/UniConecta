import { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { buscarEventos, salvarEvento, excluirEvento } from '../../controllers/eventoController';
import { useAuth } from '../../contexts/AuthContext';

moment.locale('pt-BR');
const localizer = momentLocalizer(moment);

export default function CalendarioAdmin() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [view, setView] = useState(Views.MONTH);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Carrega eventos
  useEffect(() => {
    const carregarEventos = async () => {
      try {
        const eventos = await buscarEventos();
        setEvents(eventos);
      } catch (err) {
        setError("Erro ao carregar eventos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarEventos();
  }, []);

  // Manipuladores de eventos
  const handleSelectSlot = useCallback(({ start, end }) => {
    setCurrentEvent({
      start,
      end,
      title: '',
      descricao: '',
      local: ''
    });
    setShowModal(true);
  }, []);

  const handleSelectEvent = useCallback(event => {
    setCurrentEvent(event);
    setShowModal(true);
  }, []);

  const handleSaveEvent = async () => {
    try {
      await salvarEvento(currentEvent);
      const eventosAtualizados = await buscarEventos();
      setEvents(eventosAtualizados);
      setShowModal(false);
    } catch (error) {
      setError("Erro ao salvar evento");
      console.error(error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      if (currentEvent.id) {
        await excluirEvento(currentEvent.id);
        setEvents(events.filter(event => event.id !== currentEvent.id));
        setShowModal(false);
      }
    } catch (error) {
      setError("Erro ao excluir evento");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Carregando calendário...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Calendário de Eventos</h1>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100%-80px)]">
          <p className="text-lg mb-4">Nenhum evento cadastrado ainda</p>

          {user?.tipo && user.tipo !== 'ATLETA' && (
            <button
              onClick={() => {
                setCurrentEvent({
                  start: new Date(),
                  end: new Date(),
                  title: '',
                  descricao: '',
                  local: ''
                });
                setShowModal(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Criar Primeiro Evento
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-lg p-4 h-[calc(100%-80px)]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              defaultView={view}
              onView={setView}
              messages={{
                today: 'Hoje',
                previous: 'Anterior',
                next: 'Próximo',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia',
                agenda: 'Agenda',
                date: 'Data',
                time: 'Hora',
                event: 'Evento',
              }}
            />
          </div>

          {/* Modal para adicionar/editar eventos */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                  {currentEvent.id ? 'Editar Evento' : 'Novo Evento'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">Título</label>
                    <input
                      type="text"
                      value={currentEvent.title}
                      onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Descrição</label>
                    <textarea
                      value={currentEvent.descricao}
                      onChange={(e) => setCurrentEvent({ ...currentEvent, descricao: e.target.value })}
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Local</label>
                    <input
                      type="text"
                      value={currentEvent.local}
                      onChange={(e) => setCurrentEvent({ ...currentEvent, local: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">Início</label>
                      <input
                        type="datetime-local"
                        value={moment(currentEvent.start).format('YYYY-MM-DDTHH:mm')}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, start: new Date(e.target.value) })}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Fim</label>
                      <input
                        type="datetime-local"
                        value={moment(currentEvent.end).format('YYYY-MM-DDTHH:mm')}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, end: new Date(e.target.value) })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  {currentEvent.id && (
                    <button
                      onClick={handleDeleteEvent}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Excluir
                    </button>
                  )}

                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleSaveEvent}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}