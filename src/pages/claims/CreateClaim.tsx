import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Check, Save, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { createClaim, getClaimById, updateClaim } from '../../services/claims.service';
import { getProjects } from '../../services/projects.service';
import { getClients } from '../../services/clients.service';
import Cookies from 'js-cookie';
import { getEstadosReclamo } from '../../services/estadoReclamo.service';
import { getAreas } from '../../services/areas.service';
import { getTiposReclamo, TipoReclamo } from '../../services/tipoReclamo.service';

export const CreateClaim = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [allProjects, setAllProjects] = useState<any[]>([]); // Store all projects
    const [filteredProjects, setFilteredProjects] = useState<any[]>([]); // Store filtered projects
    const [clients, setClients] = useState<any[]>([]);
    const [estados, setEstados] = useState<any[]>([]);
    const [areas, setAreas] = useState<any[]>([]);
    const [tipos, setTipos] = useState<TipoReclamo[]>([]);

    const [formData, setFormData] = useState({
        tipo: '',
        prioridad: 'Media',
        criticidad: 'Media',
        descripcion: '',
        proyecto: '',
        cliente: '',
        estado: '',
        area: '',
        file: null as File | null
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) return;

                const [projectsData, clientsData, estadosData, areasData, tiposData] = await Promise.all([
                    getProjects(token),
                    getClients(token),
                    getEstadosReclamo(token),
                    getAreas(token),
                    getTiposReclamo(token)
                ]);

                setAllProjects(projectsData);
                setFilteredProjects(projectsData); // Initially show all
                setClients(clientsData);
                setEstados(estadosData);
                setAreas(areasData);
                setTipos(tiposData);

                if (isEditMode) {

                    const claim = await getClaimById(id, token);
                    const projectId = claim.proyecto?._id || claim.proyecto;
                    const clientId = claim.cliente?._id || claim.cliente;
                    const estadoId = claim.estado?._id || claim.estado || (typeof claim.estado === 'string' ? claim.estado : '');
                    const areaId = claim.area?._id || claim.area || (typeof claim.area === 'string' ? claim.area : '');
                    const tipoId = claim.tipo?._id || claim.tipo || (typeof claim.tipo === 'string' ? claim.tipo : '');

                    setFormData({
                        tipo: tipoId,
                        prioridad: claim.prioridad,
                        criticidad: claim.criticidad,
                        descripcion: claim.descripcion,
                        proyecto: projectId,
                        cliente: clientId,
                        estado: estadoId,
                        // @ts-ignore
                        area: areaId,
                        file: null
                    });
                    // Filter projects based on the loaded (and set) client
                    if (clientId) {
                        const clientProjects = projectsData.filter((p: any) =>
                            (p.clienteId && (p.clienteId === clientId || p.clienteId._id === clientId))
                        );
                        setFilteredProjects(clientProjects);
                    }

                } else {
                    // Pre-select 'Pendiente' if acceptable, otherwise leave empty or let backend handle it.
                    // If we want to show it in the UI, we should probably find it.
                    const pendiente = estadosData.find((e: any) => e.nombre === 'Pendiente');
                    if (pendiente) {
                        setFormData(prev => ({ ...prev, estado: pendiente._id }));
                    }
                }

            } catch (err: any) {
                console.error("Error loading data", err);
                setError("Error al cargar datos: " + err.message);
            } finally {
                setIsFetching(false);
            }
        };
        loadData();
    }, [id, isEditMode]);

    // Handle Client Change -> Filter Projects
    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedClientId = e.target.value;
        // If client changed, we might want to clear project selection or fetch new projects
        // But getProjects() fetches ALL projects currently.
        // If we implement getProjectsByClient(clientId), we would call it here.

        // Update Form
        setFormData(prev => ({ ...prev, cliente: selectedClientId }));

        // Filter Projects
        if (selectedClientId) {
            const clientProjects = allProjects.filter(p =>
                p.clienteId && (p.clienteId === selectedClientId || p.clienteId._id === selectedClientId)
            );
            setFilteredProjects(clientProjects);

            // If current selected project is NOT in the new list, clear it
            const isCurrentProjectValid = clientProjects.some(p => p._id === formData.proyecto);
            if (!isCurrentProjectValid) {
                setFormData(prev => ({ ...prev, proyecto: '', cliente: selectedClientId }));
            }
        } else {
            // No client selected -> Show all projects? Or none? 
            // Creating a claim usually implies a client context. 
            // Let's show all projects if no client is restricted.
            setFilteredProjects(allProjects);
        }
    };

    // Handle Project Change -> Auto select Client
    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProjectId = e.target.value;
        setFormData(prev => ({ ...prev, proyecto: selectedProjectId }));

        if (selectedProjectId) {
            const project = allProjects.find(p => p._id === selectedProjectId);
            if (project && project.clienteId) {
                const clientId = typeof project.clienteId === 'object' ? project.clienteId._id : project.clienteId;

                // Only update client if it's different (avoids loops, though setState checks values)
                if (formData.cliente !== clientId) {
                    setFormData(prev => ({ ...prev, cliente: clientId, proyecto: selectedProjectId }));
                    // Also re-filter projects to match this client context?
                    // Yes, if I pick a project, I implicitly pick the client, so the scope narrows.
                    const clientProjects = allProjects.filter(p =>
                        p.clienteId && (p.clienteId === clientId || p.clienteId._id === clientId)
                    );
                    setFilteredProjects(clientProjects);
                }
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, file: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const token = Cookies.get('access_token');
            if (!token) throw new Error("No hay sesión activa");

            const data = new FormData();
            data.append('tipo', formData.tipo);
            data.append('prioridad', formData.prioridad);
            data.append('criticidad', formData.criticidad);
            data.append('descripcion', formData.descripcion);
            data.append('area', formData.area);
            data.append('proyecto', formData.proyecto);
            data.append('cliente', formData.cliente);
            if (formData.estado) {
                data.append('estado', formData.estado);
            }

            if (formData.file) {
                data.append('file', formData.file);
            }

            if (isEditMode) {
                await updateClaim(id, data, token);
            } else {
                await createClaim(data, token);
            }

            navigate('/claims');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-secondary-900">{isEditMode ? 'Editar Reclamo' : 'Nuevo Reclamo'}</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Reclamo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-700">Cliente</label>
                                <select
                                    name="cliente"
                                    value={formData.cliente}
                                    onChange={handleClientChange}
                                    className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                >
                                    <option value="">Seleccionar Cliente</option>
                                    {clients.map(client => (
                                        <option key={client._id} value={client._id}>
                                            {client.nombre} {client.apellido}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-700">Estado</label>
                                <select
                                    disabled={isEditMode}
                                    title={isEditMode ? 'no puedes editar este campo' : undefined}
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    className={`flex h-10 w-full rounded-md border border-secondary-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none ${isEditMode ? 'bg-secondary-100 text-secondary-500 cursor-not-allowed' : 'bg-white'}`}
                                >
                                    <option value="">Seleccionar Estado</option>
                                    {estados.map(estado => (
                                        <option key={estado._id} value={estado._id} disabled={!estado.activo}>
                                            {estado.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-700">Proyecto</label>
                                <select
                                    name="proyecto"
                                    value={formData.proyecto}
                                    onChange={handleProjectChange}
                                    className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                >
                                    <option value="">Seleccionar Proyecto</option>
                                    {filteredProjects.map(project => (
                                        <option key={project._id} value={project._id}>
                                            {project.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-700">Tipo</label>
                                <select
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                    required
                                >
                                    <option value="">Seleccione un tipo</option>
                                    {tipos.map(tipo => (
                                        <option key={tipo._id} value={tipo._id} disabled={!tipo.activo}>
                                            {tipo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-700">Prioridad</label>
                                <select
                                    name="prioridad"
                                    value={formData.prioridad}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                >
                                    <option>Baja</option>
                                    <option>Media</option>
                                    <option>Alta</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-700">Criticidad</label>
                                <select
                                    name="criticidad"
                                    value={formData.criticidad}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                >
                                    <option>Baja</option>
                                    <option>Media</option>
                                    <option>Alta</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-700">Área</label>
                                <select
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                    required
                                >
                                    <option value="">Seleccionar Área</option>
                                    {areas.map(area => (
                                        <option key={area._id} value={area._id}>
                                            {area.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-700">Descripción Detallada</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                disabled={isEditMode}
                                title={isEditMode ? 'no puedes editar este campo' : undefined}
                                className={`flex min-h-[120px] w-full rounded-md border border-secondary-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none ${isEditMode ? 'bg-secondary-100 text-secondary-500 cursor-not-allowed' : 'bg-white'}`}
                                placeholder="Describe el problema en detalle..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-700">Archivo Adjunto</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="cursor-pointer"
                                />
                            </div>
                            {isEditMode && (
                                <p className="text-xs text-secondary-500">
                                    Suba un nuevo archivo para reemplazar el existente. Deje en blanco para mantener el actual.
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate('/claims')}>
                                <X className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                {isEditMode ? 'Actualizar Reclamo' : 'Guardar Reclamo'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};
