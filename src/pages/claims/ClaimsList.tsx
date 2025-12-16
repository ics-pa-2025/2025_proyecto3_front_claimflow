import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search, Eye, Loader2, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { cn } from '../../lib/utils';
import { getClaims } from '../../services/claims.service';
import { getEstadosReclamo } from '../../services/estadoReclamo.service';
import { getAreas } from '../../services/areas.service';
import { getClients } from '../../services/clients.service';
import { getTiposReclamo } from '../../services/tipoReclamo.service';
import Cookies from 'js-cookie';
import { useAuth } from '../../context/AuthContext';

export const ClaimsList = () => {
    const { user } = useAuth();
    const [claims, setClaims] = useState<any[]>([]);
    const [filteredClaims, setFilteredClaims] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilterModal, setShowFilterModal] = useState(false);

    // Filter options
    const [estados, setEstados] = useState<any[]>([]);
    const [areas, setAreas] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);
    const [tipos, setTipos] = useState<any[]>([]);

    // Filter values
    const [filters, setFilters] = useState({
        estado: '',
        cliente: '',
        area: '',
        tipo: '',
        fechaDesde: '',
        fechaHasta: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) return;

                const [claimsData, estadosData, areasData, clientesData, tiposData] = await Promise.all([
                    getClaims(token),
                    getEstadosReclamo(token),
                    getAreas(token),
                    getClients(token),
                    getTiposReclamo(token)
                ]);

                setClaims(claimsData);
                setFilteredClaims(claimsData);
                setEstados(estadosData);
                setAreas(areasData);
                setClientes(clientesData);
                setTipos(tiposData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...claims];

        if (filters.estado) {
            filtered = filtered.filter(claim => claim.estado?._id === filters.estado);
        }
        if (filters.cliente) {
            filtered = filtered.filter(claim => claim.cliente?._id === filters.cliente);
        }
        if (filters.area) {
            filtered = filtered.filter(claim => claim.area?._id === filters.area);
        }
        if (filters.tipo) {
            filtered = filtered.filter(claim => {
                if (!claim.tipo) return false;
                // If claim.tipo is an object (populated), check its _id
                if (typeof claim.tipo === 'object' && claim.tipo._id) {
                    return claim.tipo._id === filters.tipo;
                }
                // Fallback for legacy string data (though we are moving away from this)
                return typeof claim.tipo === 'string' && claim.tipo === filters.tipo;
            });
        }
        if (filters.fechaDesde) {
            filtered = filtered.filter(claim =>
                new Date(claim.createdAt) >= new Date(filters.fechaDesde)
            );
        }
        if (filters.fechaHasta) {
            filtered = filtered.filter(claim =>
                new Date(claim.createdAt) <= new Date(filters.fechaHasta)
            );
        }

        setFilteredClaims(filtered);
    }, [filters, claims]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            estado: '',
            cliente: '',
            area: '',
            tipo: '',
            fechaDesde: '',
            fechaHasta: ''
        });
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Reclamos</h1>
                    <p className="text-secondary-500">Gestiona y da seguimiento a los reclamos ({filteredClaims.length} de {claims.length})</p>
                </div>
                {user?.role?.name !== 'client' && (
                    <Link to="/claims/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Reclamo
                        </Button>
                    </Link>
                )}
            </div>

            <Card>
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondary-500" />
                        <Input className="pl-9" placeholder="Buscar por título, ID..." />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilterModal(true)}
                            className={cn(hasActiveFilters && "border-primary-500 text-primary-600")}
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            Filtros {hasActiveFilters && `(${Object.values(filters).filter(v => v).length})`}
                        </Button>
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                            >
                                Limpiar
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md border border-secondary-200">
                        <table className="w-full text-sm">
                            <thead className="bg-secondary-50 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Tipo / Proyecto</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Prioridad</th>
                                    <th className="px-4 py-3">Área</th>
                                    <th className="px-4 py-3">Cliente</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-200 bg-white">
                                {filteredClaims.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-secondary-500">
                                            {claims.length === 0 ? 'No hay reclamos registrados' : 'No se encontraron reclamos con los filtros aplicados'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredClaims.map((claim) => (
                                        <tr key={claim._id} className="hover:bg-secondary-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-secondary-900">#{claim._id.slice(-6)}</td>
                                            <td className="px-4 py-3 text-secondary-700">
                                                <div className="font-medium">{claim.tipo?.nombre || claim.tipo || 'Sin tipo'}</div>
                                                <div className="text-xs text-secondary-500">{claim.proyecto?.nombre || 'Sin proyecto'}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                                                    style={{
                                                        backgroundColor: claim.estado?.color ? `${claim.estado.color}20` : '#e5e7eb',
                                                        color: claim.estado?.color || '#374151'
                                                    }}
                                                >
                                                    {claim.estado?.nombre || 'Sin estado'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                    claim.prioridad === 'Alta' && "bg-red-100 text-red-800",
                                                    claim.prioridad === 'Media' && "bg-orange-100 text-orange-800",
                                                    claim.prioridad === 'Baja' && "bg-gray-100 text-gray-800",
                                                )}>
                                                    {claim.prioridad}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-secondary-700">{claim.area?.nombre || 'Sin área'}</td>
                                            <td className="px-4 py-3 text-secondary-700">
                                                {claim.cliente ? `${claim.cliente.nombre} ${claim.cliente.apellido}` : 'Sin cliente'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {user?.role?.name !== 'client' && (
                                                        <Link to={`/claims/${claim._id}/edit`}>
                                                            <Button variant="ghost" size="sm">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    <Link to={`/claims/${claim._id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Filter Modal */}
            {showFilterModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                        <div className="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-secondary-900">Filtros de Búsqueda</h2>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="text-secondary-400 hover:text-secondary-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Estado */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Estado
                                </label>
                                <select
                                    value={filters.estado}
                                    onChange={(e) => handleFilterChange('estado', e.target.value)}
                                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">Todos los estados</option>
                                    {estados.map((estado) => (
                                        <option key={estado._id} value={estado._id}>
                                            {estado.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Cliente */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Cliente
                                </label>
                                <select
                                    value={filters.cliente}
                                    onChange={(e) => handleFilterChange('cliente', e.target.value)}
                                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">Todos los clientes</option>
                                    {clientes.map((cliente) => (
                                        <option key={cliente._id} value={cliente._id}>
                                            {cliente.nombre} {cliente.apellido}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Área */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Área
                                </label>
                                <select
                                    value={filters.area}
                                    onChange={(e) => handleFilterChange('area', e.target.value)}
                                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">Todas las áreas</option>
                                    {areas.map((area) => (
                                        <option key={area._id} value={area._id}>
                                            {area.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tipo de Reclamo */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Tipo de Reclamo
                                </label>
                                <select
                                    value={filters.tipo}
                                    onChange={(e) => handleFilterChange('tipo', e.target.value)}
                                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">Todos los tipos</option>
                                    {tipos.map((tipo) => (
                                        <option key={tipo._id} value={tipo._id}>
                                            {tipo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Fecha Desde */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Fecha Desde
                                </label>
                                <input
                                    type="date"
                                    value={filters.fechaDesde}
                                    onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
                                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            {/* Fecha Hasta */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Fecha Hasta
                                </label>
                                <input
                                    type="date"
                                    value={filters.fechaHasta}
                                    onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
                                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-secondary-50 px-6 py-4 flex justify-end gap-3 border-t border-secondary-200">
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                            >
                                Limpiar Filtros
                            </Button>
                            <Button
                                onClick={() => setShowFilterModal(false)}
                            >
                                Aplicar Filtros
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
