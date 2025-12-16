import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { MessageCircle } from 'lucide-react';
import { environment } from '../../environment/environments';

interface Reclamo {
    _id: string;
    titulo: string;
    descripcion: string;
    estado: {
        nombre: string;
    };
    cliente: {
        razonSocial: string;
    };
}

export const ChatList: React.FC = () => {
    const navigate = useNavigate();
    const [reclamos, setReclamos] = useState<Reclamo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReclamos();
    }, []);

    const loadReclamos = async () => {
        try {
            const token = Cookies.get('access_token');
            const response = await fetch(`${environment.apiUrl}/reclamo`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch reclamos');
            }

            const data = await response.json();
            setReclamos(data);
        } catch (error) {
            console.error('Error loading reclamos:', error);
        } finally {
            setLoading(false);
        }
    };

    const openChat = (reclamoId: string) => {
        navigate(`/chat/${reclamoId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Cargando chats...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <MessageCircle className="w-8 h-8 text-blue-600" />
                        Mis Chats
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Selecciona un reclamo para iniciar o continuar la conversación
                    </p>
                </div>

                {/* Chat List */}
                {reclamos.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No tienes reclamos disponibles para chatear</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {reclamos.map((reclamo) => (
                            <div
                                key={reclamo._id}
                                onClick={() => openChat(reclamo._id)}
                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6 border border-gray-200"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <MessageCircle className="w-5 h-5 text-blue-600" />
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {reclamo.titulo}
                                            </h3>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {reclamo.descripcion}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-gray-500">
                                                Cliente: {reclamo.cliente?.razonSocial || 'N/A'}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${reclamo.estado?.nombre === 'Resuelto'
                                                ? 'bg-green-100 text-green-800'
                                                : reclamo.estado?.nombre === 'En Proceso'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {reclamo.estado?.nombre || 'Pendiente'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            Abrir Chat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
