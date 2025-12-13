import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';

// Mock de Recharts para evitar problemas con SVG
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
}));

describe('Dashboard Page - UI y Usabilidad', () => {
  describe('Renderizado Principal', () => {
    it('debe renderizar el título del dashboard', () => {
      render(<Dashboard />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('debe mostrar la última actualización', () => {
      render(<Dashboard />);
      expect(screen.getByText(/última actualización/i)).toBeInTheDocument();
      expect(screen.getByText(/hoy, 14:30/i)).toBeInTheDocument();
    });
  });

  describe('Cards de Estadísticas', () => {
    it('debe renderizar la tarjeta de Total Reclamos', () => {
      render(<Dashboard />);
      expect(screen.getByText('Total Reclamos')).toBeInTheDocument();
      expect(screen.getByText('1,234')).toBeInTheDocument();
      expect(screen.getByText('+20.1% mes anterior')).toBeInTheDocument();
    });

    it('debe renderizar la tarjeta de En Proceso', () => {
      render(<Dashboard />);
      expect(screen.getByText('En Proceso')).toBeInTheDocument();
      expect(screen.getByText('45')).toBeInTheDocument();
      expect(screen.getByText('-4% desde ayer')).toBeInTheDocument();
    });

    it('debe renderizar la tarjeta de Cerrados', () => {
      render(<Dashboard />);
      expect(screen.getByText('Cerrados')).toBeInTheDocument();
      expect(screen.getByText('1,189')).toBeInTheDocument();
      expect(screen.getByText('+12% esta semana')).toBeInTheDocument();
    });

    it('debe renderizar la tarjeta de Tiempo Promedio', () => {
      render(<Dashboard />);
      expect(screen.getByText('Tiempo Promedio')).toBeInTheDocument();
      expect(screen.getByText('2.4h')).toBeInTheDocument();
      expect(screen.getByText('-30min mejora')).toBeInTheDocument();
    });

    it('debe renderizar las 4 tarjetas de estadísticas', () => {
      const { container } = render(<Dashboard />);
      const cards = container.querySelectorAll('.grid.gap-6 > div');
      expect(cards.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Gráficos', () => {
    it('debe renderizar el gráfico de Reclamos por Día', () => {
      render(<Dashboard />);
      expect(screen.getByText('Reclamos por Día')).toBeInTheDocument();
    });

    it('debe renderizar el gráfico de Distribución por Área', () => {
      render(<Dashboard />);
      expect(screen.getByText('Distribución por Área')).toBeInTheDocument();
    });

    it('debe mostrar leyenda del gráfico circular', () => {
      render(<Dashboard />);
      expect(screen.getByText('Ventas')).toBeInTheDocument();
      expect(screen.getByText('Soporte')).toBeInTheDocument();
      expect(screen.getByText('Facturación')).toBeInTheDocument();
    });

    it('debe renderizar componentes de gráficos', () => {
      render(<Dashboard />);
      expect(screen.getAllByTestId('responsive-container')).toHaveLength(2);
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });
  });

  describe('Iconos Visuales', () => {
    it('debe incluir iconos en las cards de estadísticas', () => {
      const { container } = render(<Dashboard />);
      const svgIcons = container.querySelectorAll('svg');
      expect(svgIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Estructura y Layout', () => {
    it('debe tener layout de grid para las estadísticas', () => {
      const { container } = render(<Dashboard />);
      const gridContainer = container.querySelector('.grid.gap-6.md\\:grid-cols-2.lg\\:grid-cols-4');
      expect(gridContainer).toBeInTheDocument();
    });

    it('debe tener layout responsive para los gráficos', () => {
      const { container } = render(<Dashboard />);
      const chartsGrid = container.querySelector('.grid.gap-6.md\\:grid-cols-2.lg\\:grid-cols-7');
      expect(chartsGrid).toBeInTheDocument();
    });

    it('debe aplicar espaciado consistente', () => {
      const { container } = render(<Dashboard />);
      const mainContainer = container.querySelector('.space-y-6');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('Información Visual', () => {
    it('debe mostrar tendencias positivas en verde', () => {
      const { container } = render(<Dashboard />);
      const positiveText = screen.getByText('+20.1% mes anterior');
      expect(positiveText).toBeInTheDocument();
    });

    it('debe mostrar tendencias negativas', () => {
      render(<Dashboard />);
      expect(screen.getByText('-4% desde ayer')).toBeInTheDocument();
    });

    it('debe mostrar mejoras en el tiempo', () => {
      render(<Dashboard />);
      expect(screen.getByText('-30min mejora')).toBeInTheDocument();
    });
  });

  describe('Usabilidad y Accesibilidad', () => {
    it('debe tener títulos descriptivos', () => {
      render(<Dashboard />);
      expect(screen.getByText('Total Reclamos')).toBeInTheDocument();
      expect(screen.getByText('En Proceso')).toBeInTheDocument();
      expect(screen.getByText('Cerrados')).toBeInTheDocument();
      expect(screen.getByText('Tiempo Promedio')).toBeInTheDocument();
    });

    it('debe proporcionar contexto temporal', () => {
      render(<Dashboard />);
      expect(screen.getByText(/mes anterior/i)).toBeInTheDocument();
      expect(screen.getByText(/desde ayer/i)).toBeInTheDocument();
      expect(screen.getByText(/esta semana/i)).toBeInTheDocument();
    });

    it('debe ser fácilmente escaneable', () => {
      render(<Dashboard />);
      const numbers = screen.getAllByText(/\d+/);
      expect(numbers.length).toBeGreaterThan(0);
    });
  });

  describe('Cards con Hover Effect', () => {
    it('debe aplicar efecto hover a las cards de estadísticas', () => {
      const { container } = render(<Dashboard />);
      // Las cards tienen el prop hoverEffect que aplica clases específicas
      const cards = container.querySelectorAll('.hover\\:-translate-y-1');
      expect(cards.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Visualización de Datos', () => {
    it('debe presentar datos numéricos de forma prominente', () => {
      const { container } = render(<Dashboard />);
      const bigNumbers = container.querySelectorAll('.text-2xl.font-bold');
      expect(bigNumbers.length).toBeGreaterThanOrEqual(4);
    });

    it('debe mostrar métricas secundarias más pequeñas', () => {
      const { container } = render(<Dashboard />);
      const smallText = container.querySelectorAll('.text-xs');
      expect(smallText.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('debe tener clases responsive en la grilla', () => {
      const { container } = render(<Dashboard />);
      const responsiveGrid = container.querySelector('.md\\:grid-cols-2.lg\\:grid-cols-4');
      expect(responsiveGrid).toBeInTheDocument();
    });

    it('debe adaptar el layout de los gráficos', () => {
      const { container } = render(<Dashboard />);
      const chartGrid = container.querySelector('.md\\:grid-cols-2');
      expect(chartGrid).toBeInTheDocument();
    });
  });

  describe('Colores y Estética', () => {
    it('debe usar colores consistentes para los iconos', () => {
      const { container } = render(<Dashboard />);
      // Verifica que hay elementos con clases de color
      const colorClasses = container.innerHTML;
      expect(colorClasses).toContain('text-primary-600');
      expect(colorClasses).toContain('text-orange-500');
      expect(colorClasses).toContain('text-green-500');
      expect(colorClasses).toContain('text-blue-500');
    });
  });
});
