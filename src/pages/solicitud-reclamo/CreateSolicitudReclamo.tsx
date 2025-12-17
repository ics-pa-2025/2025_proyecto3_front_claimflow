import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { getProjectsByClient } from '../../services/projects.service';
import { getClients } from '../../services/clients.service';
import { getTiposReclamo } from '../../services/tipoReclamo.service';
import { environment } from '../../environment/environments';

export const CreateSolicitudReclamo = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [tipoReclamos, setTipoReclamos] = useState<any[]>([]);
    // const [clients, setClients] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        tipo: '',
        descripcion: '',
        evidencia: [],
        proyecto: '',
        files: [] as File[],
    });
    const [clienteId, setClienteId] = useState<string>('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) throw new Error('No hay sesión activa');
                // Obtener usuario actual
                const userRes = await fetch(`${environment.authUrl}/user/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!userRes.ok) throw new Error('No autenticado');
                const user = await userRes.json();
                // Buscar cliente por email
                const clientsData = await getClients(token);
                const client = clientsData.find((c: any) => c.email === user.email);
                if (!client) throw new Error('No se encontró el cliente para este usuario');
                setClienteId(client._id);
                // Cargar solo los proyectos del cliente logueado y los tipos de reclamo desde la API
                const [projectsData, tiposData] = await Promise.all([
                    getProjectsByClient(client._id, token),
                    getTiposReclamo(token),
                ]);
                setProjects(projectsData);
                setTipoReclamos(tiposData);
            } catch (err: any) {
                setError('Error al cargar datos: ' + err.message);
            } finally {
                setIsFetching(false);
            }
        };
        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(prev => ({ ...prev, files: Array.from(e.target.files!) }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            // Simple validations
            if (!formData.tipo) {
                setError('Seleccione un tipo de reclamo');
                setIsLoading(false);
                return;
            }
            if (!formData.proyecto) {
                setError('Seleccione un proyecto');
                setIsLoading(false);
                return;
            }
            if (!formData.descripcion || formData.descripcion.trim().length < 10) {
                setError('Descripción muy corta (min 10 caracteres)');
                setIsLoading(false);
                return;
            }
            const token = Cookies.get('access_token');
            if (!token) throw new Error('No hay sesión activa');
            if (!clienteId) throw new Error('No se pudo determinar el cliente actual');
            const data = new FormData();
            data.append('tipo', formData.tipo);
            data.append('descripcion', formData.descripcion);
            // `area` no debe ser asignada por el solicitante; el sistema la determinará posteriormente
            data.append('cliente', clienteId);
            data.append('proyecto', formData.proyecto);
            formData.files.forEach((file, idx) => {
                data.append('evidencia', file);
            });
            const res = await fetch(`${environment.apiUrl}/solicitud-reclamo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });
            if (!res.ok) throw new Error('Error al crear la solicitud');
            navigate('/solicitud-reclamo');
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
                <h1 className="text-3xl font-bold text-secondary-900">Nueva Solicitud de Reclamo</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Datos de la Solicitud</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700">Tipo</label>
                                <Select name="tipo" value={formData.tipo} onChange={handleChange} required>
                                    <option value="">Seleccione un tipo</option>
                                    {tipoReclamos.length === 0 ? (
                                        <option value="">No hay tipos disponibles</option>
                                    ) : (
                                        tipoReclamos.map((t: any) => (
                                            <option key={t._id} value={t._id}>{t.nombre}</option>
                                        ))
                                    )}
                                </Select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-secondary-700">Proyecto</label>
                                <Select name="proyecto" value={formData.proyecto} onChange={handleChange} required>
                                    <option value="">Seleccione un proyecto</option>
                                    {projects.map((project: any) => (
                                        <option key={project._id} value={project._id}>{project.nombre}</option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700">Descripción</label>
                            <Textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required placeholder="Describa el reclamo" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-700">Evidencia (puede adjuntar archivos)</label>
                            <Input type="file" name="evidencia" multiple onChange={handleFileChange} />
                        </div>
                        {error && <div className="text-[var(--accent)] text-sm dark:text-[var(--accent)]">{error}</div>}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Crear Solicitud'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
