import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { getDashboardStats } from '../services/claims.service';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const data = [
    { name: 'Lun', reclamos: 4 },
    { name: 'Mar', reclamos: 7 },
    { name: 'Mie', reclamos: 5 },
    { name: 'Jue', reclamos: 12 },
    { name: 'Vie', reclamos: 9 },
    { name: 'Sab', reclamos: 3 },
    { name: 'Dom', reclamos: 2 },
];

const pieData = [
    { name: 'Ventas', value: 400 },
    { name: 'Soporte', value: 300 },
    { name: 'Facturación', value: 300 },
];

const COLORS = ['#0ea5e9', '#64748b', '#94a3b8'];

export const Dashboard = () => {
    const [stats, setStats] = useState({
        totalReclamos: 0,
        porcentajeCrecimiento: '',
        diferenciaMesAnterior: ''
    });

    useEffect(() => {
        const token = Cookies.get('access_token');
        if (token) {
            getDashboardStats(token).then(data => {
                setStats(data);
            }).catch(console.error);
        }
    }, []);
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
                <div className="text-sm text-secondary-500">Última actualización: Hoy, 14:30</div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card hoverEffect>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-secondary-500">Total Reclamos</CardTitle>
                        <AlertCircle className="h-4 w-4 text-primary-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalReclamos.toLocaleString()}</div>
                        <p className="text-xs text-secondary-500">{stats.diferenciaMesAnterior}</p>
                    </CardContent>
                </Card>
                <Card hoverEffect>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-secondary-500">En Proceso</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45</div>
                        <p className="text-xs text-secondary-500">-4% desde ayer</p>
                    </CardContent>
                </Card>
                <Card hoverEffect>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-secondary-500">Cerrados</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,189</div>
                        <p className="text-xs text-secondary-500">+12% esta semana</p>
                    </CardContent>
                </Card>
                <Card hoverEffect>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-secondary-500">Tiempo Promedio</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.4h</div>
                        <p className="text-xs text-secondary-500">-30min mejora</p>
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
                            <BarChart data={data}>
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
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex justify-center gap-4">
                            {pieData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
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
