import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AlertCircle, CheckCircle2, Clock, FileSpreadsheet, Image as ImageIcon } from 'lucide-react';
import { getDashboardStats, getClaimsPerDay, getClaimsByArea, getClaimsByType, getClaimsByResponsable } from '../services/claims.service';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { exportToCSV, exportChartAsImage } from '../lib/exportUtils';
import { Button } from '../components/ui/Button';

const initialData = [
    { name: 'Lun', reclamos: 0 },
    { name: 'Mar', reclamos: 0 },
    { name: 'Mie', reclamos: 0 },
    { name: 'Jue', reclamos: 0 },
    { name: 'Vie', reclamos: 0 },
    { name: 'Sab', reclamos: 0 },
    { name: 'Dom', reclamos: 0 },
];

const initialPieData = [
    { name: 'Ventas', value: 0 },
    { name: 'Soporte', value: 0 },
    { name: 'Facturación', value: 0 },
];

const COLORS = ['#0ea5e9', '#64748b', '#94a3b8'];

export const Dashboard = () => {
    const [stats, setStats] = useState({
        totalReclamos: 0,
        porcentajeCrecimiento: '',
        diferenciaMesAnterior: '',
        reclamosEnProceso: 0,
        reclamosFinalizados: 0,
        avgResolutionDays: 0,
    });
    const [chartData, setChartData] = useState(initialData);
    const [pieChartData, setPieChartData] = useState(initialPieData);
    const [tipoChartData, setTipoChartData] = useState<{ name: string; value: number }[]>([]);
    const [responsableChartData, setResponsableChartData] = useState<any[]>([]);

    useEffect(() => {
        const token = Cookies.get('access_token');
        if (token) {
            getDashboardStats(token).then(data => {
                setStats(data);
            }).catch(console.error);

            getClaimsPerDay(token).then(data => {
                setChartData(data);
            }).catch(console.error);

            getClaimsByArea(token).then(data => {
                // Only update if we have data, otherwise keep initial structure or handle empty state
                if (data && data.length > 0) {
                    setPieChartData(data);
                }
            }).catch(console.error);

            getClaimsByType(token).then(data => {
                if (data && data.length > 0) {
                    setTipoChartData(data);
                }
            }).catch(console.error);

            getClaimsByResponsable(token).then(data => {
                if (data && data.length > 0) {
                    setResponsableChartData(data);
                }
            }).catch(console.error);
        }
    }, []);
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
                <div className="text-sm text-secondary-500">Última actualización: Hoy, 14:30</div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-secondary-500">Total Reclamos</CardTitle>
                        <AlertCircle className="h-4 w-4 text-primary-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalReclamos.toLocaleString()}</div>
                        <p className="text-xs text-secondary-500">{stats.diferenciaMesAnterior}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Promedio resolución (días)</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Number((stats as any).avgResolutionDays).toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Promedio para reclamos cerrados</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reclamos en Proceso</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.reclamosEnProceso}</div>
                        <p className="text-xs text-muted-foreground">En gestión activa</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reclamos Cerrados</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.reclamosFinalizados}</div>
                        <p className="text-xs text-muted-foreground">Total histórico</p>
                    </CardContent>
                </Card>

            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Reclamos por Día</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportToCSV(chartData, 'reclamos-por-dia')}
                                title="Exportar a CSV"
                            >
                                <FileSpreadsheet className="h-4 w-4 mr-1" />
                                CSV
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportChartAsImage('bar-chart-container', 'reclamos-por-dia')}
                                title="Descargar como imagen"
                            >
                                <ImageIcon className="h-4 w-4 mr-1" />
                                PNG
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div id="bar-chart-container">
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="reclamos" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Distribución por Área</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportToCSV(pieChartData, 'distribucion-por-area')}
                                title="Exportar a CSV"
                            >
                                <FileSpreadsheet className="h-4 w-4 mr-1" />
                                CSV
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportChartAsImage('pie-chart-container', 'distribucion-por-area')}
                                title="Descargar como imagen"
                            >
                                <ImageIcon className="h-4 w-4 mr-1" />
                                PNG
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div id="pie-chart-container">
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieChartData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex justify-center gap-4">
                            {pieChartData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-sm text-secondary-600">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Distribución por Tipo de Reclamo</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportToCSV(tipoChartData, 'reclamos-por-tipo')}
                                title="Exportar a CSV"
                            >
                                <FileSpreadsheet className="h-4 w-4 mr-1" />
                                CSV
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportChartAsImage('tipo-chart-container', 'reclamos-por-tipo')}
                                title="Descargar como imagen"
                            >
                                <ImageIcon className="h-4 w-4 mr-1" />
                                PNG
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div id="tipo-chart-container">
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={tipoChartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        type="category"
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        type="number"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Reclamos por Responsable</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportToCSV(responsableChartData, 'reclamos-por-responsable')}
                                title="Exportar a CSV"
                            >
                                <FileSpreadsheet className="h-4 w-4 mr-1" />
                                CSV
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportChartAsImage('responsable-chart-container', 'reclamos-por-responsable')}
                                title="Descargar como imagen"
                            >
                                <ImageIcon className="h-4 w-4 mr-1" />
                                PNG
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div id="responsable-chart-container">
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={responsableChartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="responsable"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="asignados" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Asignados" />
                                    <Bar dataKey="enProceso" fill="#f59e0b" radius={[4, 4, 0, 0]} name="En Proceso" />
                                    <Bar dataKey="resueltos" fill="#10b981" radius={[4, 4, 0, 0]} name="Resueltos" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
