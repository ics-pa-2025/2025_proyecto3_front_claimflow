import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Building2, AlertTriangle, CheckCircle2, MessageSquare, Paperclip, Send } from 'lucide-react';
import anime from 'animejs';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { MOCK_CLAIMS } from '../../lib/mock-data';
import { cn } from '../../lib/utils';

export const ClaimDetail = () => {
    const { id } = useParams();
    const claim = MOCK_CLAIMS.find(c => c.id === id) || MOCK_CLAIMS[0];
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        anime({
            targets: timelineRef.current?.children,
            translateX: [-20, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            easing: 'easeOutQuad'
        });
    }, []);

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
                        <h1 className="text-2xl font-bold text-secondary-900">Reclamo #{claim.id}</h1>
                        <span className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            claim.status === 'Abierto' && "bg-blue-100 text-blue-800",
                            claim.status === 'En Proceso' && "bg-yellow-100 text-yellow-800",
                            claim.status === 'Cerrado' && "bg-green-100 text-green-800",
                        )}>
                            {claim.status}
                        </span>
                    </div>
                    <p className="text-secondary-500">Creado el {new Date(claim.createdAt).toLocaleDateString()}</p>
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
                                <h3 className="font-semibold text-secondary-900">{claim.title}</h3>
                                <p className="mt-2 text-secondary-600 leading-relaxed">
                                    {claim.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-secondary-500 uppercase">Prioridad</span>
                                    <div className="flex items-center gap-2 font-medium text-secondary-900">
                                        <AlertTriangle className={cn("h-4 w-4", claim.priority === 'Alta' ? "text-red-500" : "text-orange-500")} />
                                        {claim.priority}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-secondary-500 uppercase">Criticidad</span>
                                    <div className="flex items-center gap-2 font-medium text-secondary-900">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        {claim.criticality}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-secondary-500 uppercase">Área</span>
                                    <div className="flex items-center gap-2 font-medium text-secondary-900">
                                        <Building2 className="h-4 w-4 text-secondary-400" />
                                        {claim.area}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-medium text-secondary-500 uppercase">Responsable</span>
                                    <div className="flex items-center gap-2 font-medium text-secondary-900">
                                        <User className="h-4 w-4 text-secondary-400" />
                                        {claim.assignedTo ? 'Usuario ' + claim.assignedTo : 'Sin asignar'}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Comentarios</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm">
                                        AU
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <textarea
                                            className="w-full rounded-md border border-secondary-200 p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[80px]"
                                            placeholder="Escribe un comentario interno..."
                                        />
                                        <div className="flex justify-between items-center">
                                            <Button variant="ghost" size="sm" className="text-secondary-500">
                                                <Paperclip className="h-4 w-4 mr-2" />
                                                Adjuntar archivo
                                            </Button>
                                            <Button size="sm">
                                                <Send className="h-4 w-4 mr-2" />
                                                Enviar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Línea de Tiempo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l border-secondary-200 ml-3 space-y-8 py-2" ref={timelineRef}>
                                <div className="relative pl-6">
                                    <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary-500 ring-4 ring-white" />
                                    <p className="text-sm font-medium text-secondary-900">Reclamo Creado</p>
                                    <p className="text-xs text-secondary-500">Hace 2 horas por Cliente</p>
                                </div>
                                <div className="relative pl-6">
                                    <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-secondary-300 ring-4 ring-white" />
                                    <p className="text-sm font-medium text-secondary-900">Asignado a Soporte</p>
                                    <p className="text-xs text-secondary-500">Hace 1 hora por Sistema</p>
                                </div>
                                <div className="relative pl-6">
                                    <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-secondary-300 ring-4 ring-white" />
                                    <p className="text-sm font-medium text-secondary-900">Cambio de estado: En Proceso</p>
                                    <p className="text-xs text-secondary-500">Hace 30 min por Admin</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Acciones</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">
                                <User className="mr-2 h-4 w-4" />
                                Reasignar
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Marcar como Resuelto
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
