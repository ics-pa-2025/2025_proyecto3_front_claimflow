import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { getDashboardStats, getClaimsPerDay, getClaimsByArea } from '../services/claims.service';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

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
        reclamosFinalizados: 0
    });
    const [chartData, setChartData] = useState(initialData);
    const [pieChartData, setPieChartData] = useState(initialPieData);

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
                    <CardHeader>
                        <CardTitle>Reclamos por Día</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="reclamos" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Distribución por Área</CardTitle>
                    </CardHeader>
                    <CardContent>
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
        </div>
    );
};
