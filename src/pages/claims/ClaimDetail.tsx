import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Building2, AlertTriangle, CheckCircle2, Paperclip, Loader2 } from 'lucide-react';
import anime from 'animejs';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { getClaimById, updateClaimStatus } from '../../services/claims.service';
import Cookies from 'js-cookie';
import { environment } from '../../environment/environments';
import { useSocket } from '../../hooks/useSocket';
import { chatService } from '../../services/chatService';
import { MessageList } from '../../components/chat/MessageList';
import { MessageInput } from '../../components/chat/MessageInput';

interface Mensaje {
    _id: string;
    contenido: string;
    emisor: {
        tipo: 'cliente' | 'usuario';
        id: string;
        nombre?: string;
    };
    reclamoId: string;
    leido: boolean;
    fechaCreacion: string;
}

export const ClaimDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [claim, setClaim] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showReassignModal, setShowReassignModal] = useState(false);
    const [showEstadoModal, setShowEstadoModal] = useState(false);
    const [areas, setAreas] = useState<any[]>([]);
    const [estados, setEstados] = useState<any[]>([]);
    const [selectedArea, setSelectedArea] = useState<string>('');
    const [selectedEstado, setSelectedEstado] = useState<string>('');
    const timelineRef = useRef<HTMLDivElement>(null);

    // Chat State
    const { socket, isConnected, joinRoom, leaveRoom, sendMessage, sendTyping } = useSocket();
    const [messages, setMessages] = useState<Mensaje[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [chatLoading, setChatLoading] = useState(true);

    useEffect(() => {
        const fetchClaim = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token || !id) return;
                const data = await getClaimById(id, token);
                setClaim(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClaim();
    }, [id]);

    useEffect(() => {
        if (claim) {
            anime({
                targets: timelineRef.current?.children,
                translateX: [-20, 0],
                opacity: [0, 1],
                delay: anime.stagger(100),
                easing: 'easeOutQuad'
            });
        }
    }, [claim]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) return;
                
                const [areasResponse, estadosResponse] = await Promise.all([
                    fetch(`${environment.apiUrl}/area`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${environment.apiUrl}/estado-reclamo`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);
                
                const areasData = await areasResponse.json();
                const estadosData = await estadosResponse.json();
                
                setAreas(areasData);
                setEstados(estadosData);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!id) return;

        const loadMessages = async () => {
            setChatLoading(true);
            try {
                const history = await chatService.getMessagesByReclamo(id);
                setMessages(history);
            } catch (error) {
                console.error('Error loading messages:', error);
            } finally {
                setChatLoading(false);
            }
        };

        loadMessages();

        if (isConnected && socket) {
            joinRoom(id);
        }

        return () => {
            if (id) {
                leaveRoom(id);
            }
        };
    }, [id, isConnected]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message: Mensaje) => {
            setMessages((prev) => [...prev, message]);
        };

        const handleUserTyping = ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
            setIsTyping(isTyping);
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('userTyping', handleUserTyping);

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('userTyping', handleUserTyping);
        };
    }, [socket]);

    const handleSendMessage = (contenido: string) => {
        if (id) {
            sendMessage(id, contenido);
        }
    };

    const handleTyping = (isTypingNow: boolean) => {
        if (id) {
            sendTyping(id, isTypingNow);
        }
    };

    const handleMarkAsResolved = async () => {
        if (!id || !claim) return;

        setIsUpdating(true);
        try {
            const token = Cookies.get('access_token');
            if (!token) throw new Error('No autenticado');

            // Fetch estado "Cerrado" or "Resuelto"
            const estadosResponse = await fetch(`${environment.apiUrl}/estado-reclamo`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const estados = await estadosResponse.json();
            const estadoResuelto = estados.find((e: any) => e.nombre === 'Cerrado' || e.nombre === 'Resuelto');

            if (!estadoResuelto) throw new Error('Estado "Cerrado" no encontrado');

            const userName = (user as any)?.username || user?.email || 'Usuario';
            await updateClaimStatus(
                id,
                estadoResuelto._id,
                {
                    accion: 'Reclamo marcado como resuelto',
                    responsable: userName
                },
                token
            );

            // Refresh claim data
            const updatedClaim = await getClaimById(id, token);
            setClaim(updatedClaim);
        } catch (err: any) {
            alert(err.message || 'Error al actualizar el reclamo');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleReassign = async () => {
        if (!id || !selectedArea) return;

        setIsUpdating(true);
        try {
            const token = Cookies.get('access_token');
            if (!token) throw new Error('No autenticado');

            const areaData = areas.find(a => a._id === selectedArea);
            const userName = (user as any)?.username || user?.email || 'Usuario';

            await updateClaimStatus(
                id,
                claim.estado._id,
                {
                    accion: `Reasignado al área: ${areaData?.nombre || 'Nueva área'}`,
                    responsable: userName
                },
                token
            );

            // Also update the area field
            const response = await fetch(`${environment.apiUrl}/reclamo/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ area: selectedArea })
            });

            if (!response.ok) throw new Error('Error al reasignar');

            // Refresh claim data
            const updatedClaim = await getClaimById(id, token);
            setClaim(updatedClaim);
            setShowReassignModal(false);
            setSelectedArea('');
        } catch (err: any) {
            alert(err.message || 'Error al reasignar el reclamo');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleChangeEstado = async () => {
        if (!id || !selectedEstado) return;

        setIsUpdating(true);
        try {
            const token = Cookies.get('access_token');
            if (!token) throw new Error('No autenticado');

            const estadoData = estados.find(e => e._id === selectedEstado);
            const userName = (user as any)?.username || user?.email || 'Usuario';

            await updateClaimStatus(
                id,
                selectedEstado,
                {
                    accion: `Estado cambiado a: ${estadoData?.nombre || 'Nuevo estado'}`,
                    responsable: userName
                },
                token
            );

            // Refresh claim data
            const updatedClaim = await getClaimById(id, token);
            setClaim(updatedClaim);
            setShowEstadoModal(false);
            setSelectedEstado('');
        } catch (err: any) {
            alert(err.message || 'Error al cambiar el estado');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (error || !claim) {
        return (
            <div className="space-y-6">
                <Link to="/claims">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                </Link>
                <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                    {error || 'Reclamo no encontrado'}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/claims">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-secondary-900">Reclamo #{claim._id?.slice(-6)}</h1>
                        <span
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                            style={{
                                backgroundColor: claim.estado?.color ? `${claim.estado.color}20` : '#e5e7eb',
                                color: claim.estado?.color || '#374151'
                            }}
                        >
                            {claim.estado?.nombre || 'Sin estado'}
                        </span>
                    </div>
                    <p className="text-secondary-500">
                        Proyecto: {claim.proyecto?.nombre || 'Sin proyecto'} | Cliente: {claim.cliente ? `${claim.cliente.nombre} ${claim.cliente.apellido}` : 'Sin cliente'}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles del Reclamo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-secondary-900">{claim.tipo?.nombre || claim.tipo || 'Sin Tipo'}</h3>
                                <p className="mt-2 text-secondary-600 leading-relaxed">
                                    {claim.descripcion}
                                </p>
                            </div>

                            {claim.evidencia && (
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-secondary-500 uppercase">Evidencia</span>
                                    <div className="flex items-center gap-2">
                                        <Paperclip className="h-4 w-4 text-secondary-400" />
                                        <a href={claim.evidencia} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-sm">
                                            Ver archivo adjunto
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-secondary-500 uppercase">Prioridad</span>
                                    <div className="flex items-center gap-2 font-medium text-secondary-900">
                                        <AlertTriangle className={cn("h-4 w-4", claim.prioridad === 'Alta' ? "text-red-500" : claim.prioridad === 'Media' ? "text-orange-500" : "text-gray-500")} />
                                        {claim.prioridad}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-secondary-500 uppercase">Criticidad</span>
                                    <div className="flex items-center gap-2 font-medium text-secondary-900">
                                        <AlertTriangle className={cn("h-4 w-4", claim.criticidad === 'Alta' ? "text-red-500" : claim.criticidad === 'Media' ? "text-orange-500" : "text-gray-500")} />
                                        {claim.criticidad}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-secondary-500 uppercase">Tipo</span>
                                    <div className="flex items-center gap-2 font-medium text-secondary-900">
                                        <p className="font-medium text-secondary-900">
                                            {/* @ts-ignore */}
                                            {claim.tipo?.nombre || claim.tipo || 'No especificado'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-secondary-500 uppercase">Estado</span>
                                    <div className="flex items-center gap-2 font-medium text-secondary-900">
                                        <CheckCircle2 className="h-4 w-4 text-secondary-400" />
                                        {claim.estado?.nombre || 'Sin estado'}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {user?.role?.name !== 'client' && (
                        <Card className="flex flex-col h-[500px]">
                            <CardHeader className="flex-shrink-0">
                                <CardTitle>Notas (Internas)</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
                                {chatLoading ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1 overflow-y-auto mb-4 border rounded-md p-2 bg-gray-50">
                                            <MessageList messages={messages} isTyping={isTyping} />
                                        </div>
                                        <div className="flex-shrink-0">
                                            <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Línea de Tiempo</CardTitle>
                        </CardHeader>
                        <CardContent className="max-h-[500px] overflow-y-auto">
                            <div className="relative border-l border-secondary-200 ml-3 space-y-8 py-2" ref={timelineRef}>
                                {claim.historial && claim.historial.length > 0 ? (
                                    [...claim.historial].reverse().map((event: any, index: number) => (
                                        <div key={index} className="relative pl-6">
                                            <div className={cn(
                                                "absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white",
                                                index === 0 ? "bg-primary-500" : "bg-secondary-300"
                                            )} />
                                            <p className="text-sm font-medium text-secondary-900">{event.accion}</p>
                                            <p className="text-xs text-secondary-500">
                                                {new Date(event.fecha).toLocaleDateString()} {new Date(event.fecha).toLocaleTimeString()} - {event.responsable}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="relative pl-6">
                                        <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-secondary-300 ring-4 ring-white" />
                                        <p className="text-sm font-medium text-secondary-900">Sin historial</p>
                                        <p className="text-xs text-secondary-500">No hay registros de cambios</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {user?.role?.name !== 'client' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Acciones</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => setShowReassignModal(true)}
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    Reasignar
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => setShowEstadoModal(true)}
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Cambiar Estado
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={handleMarkAsResolved}
                                    disabled={isUpdating || claim?.estado?.nombre === 'Cerrado' || claim?.estado?.nombre === 'Resuelto'}
                                >
                                    {isUpdating ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                    )}
                                    {claim?.estado?.nombre === 'Cerrado' || claim?.estado?.nombre === 'Resuelto' ? 'Ya Resuelto' : 'Marcar como Resuelto'}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Modal de reasignación */}
            {showReassignModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/10">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border border-secondary-200">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Reasignar Área</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Seleccionar nueva área
                                </label>
                                <select
                                    className="w-full rounded-md border border-secondary-200 p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                    value={selectedArea}
                                    onChange={(e) => setSelectedArea(e.target.value)}
                                >
                                    <option value="">Seleccione un área</option>
                                    {areas.map((area) => (
                                        <option key={area._id} value={area._id}>
                                            {area.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowReassignModal(false);
                                        setSelectedArea('');
                                    }}
                                    disabled={isUpdating}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleReassign}
                                    disabled={!selectedArea || isUpdating}
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Reasignando...
                                        </>
                                    ) : (
                                        'Reasignar'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de cambio de estado */}
            {showEstadoModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/10">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border border-secondary-200">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Cambiar Estado</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Seleccionar nuevo estado
                                </label>
                                <select
                                    className="w-full rounded-md border border-secondary-200 p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                    value={selectedEstado}
                                    onChange={(e) => setSelectedEstado(e.target.value)}
                                >
                                    <option value="">Seleccione un estado</option>
                                    {estados.map((estado) => (
                                        <option key={estado._id} value={estado._id}>
                                            {estado.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowEstadoModal(false);
                                        setSelectedEstado('');
                                    }}
                                    disabled={isUpdating}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleChangeEstado}
                                    disabled={!selectedEstado || isUpdating}
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Cambiando...
                                        </>
                                    ) : (
                                        'Cambiar Estado'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
