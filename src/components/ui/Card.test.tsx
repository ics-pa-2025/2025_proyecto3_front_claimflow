import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

describe('Card Component - UI & Usability Tests', () => {
  describe('Renderizado de Card Principal', () => {
    it('debe renderizar correctamente', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText(/card content/i)).toBeInTheDocument();
    });

    it('debe aplicar estilos base', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('rounded-xl', 'border', 'bg-white');
    });

    it('debe aplicar efecto hover cuando hoverEffect es true', () => {
      const { container } = render(<Card hoverEffect>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('hover:-translate-y-1', 'hover:shadow-md');
    });

    it('no debe aplicar efecto hover por defecto', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveClass('hover:-translate-y-1');
    });

    it('debe aceptar clases personalizadas', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('CardHeader Component', () => {
    it('debe renderizar CardHeader correctamente', () => {
      render(
        <Card>
          <CardHeader>Header content</CardHeader>
        </Card>
      );
      expect(screen.getByText(/header content/i)).toBeInTheDocument();
    });

    it('debe aplicar padding correcto', () => {
      const { container } = render(<CardHeader>Content</CardHeader>);
      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass('p-6');
    });

    it('debe tener flex layout', () => {
      const { container } = render(<CardHeader>Content</CardHeader>);
      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass('flex', 'flex-col');
    });
  });

  describe('CardTitle Component', () => {
    it('debe renderizar CardTitle correctamente', () => {
      render(<CardTitle>Title</CardTitle>);
      expect(screen.getByText(/title/i)).toBeInTheDocument();
    });

    it('debe ser un elemento h3', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText(/title/i);
      expect(title.tagName).toBe('H3');
    });

    it('debe tener estilos de fuente correctos', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText(/title/i);
      expect(title).toHaveClass('font-semibold', 'leading-none');
    });
  });

  describe('CardContent Component', () => {
    it('debe renderizar CardContent correctamente', () => {
      render(<CardContent>Content text</CardContent>);
      expect(screen.getByText(/content text/i)).toBeInTheDocument();
    });

    it('debe aplicar padding correcto', () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const content = container.firstChild as HTMLElement;
      expect(content).toHaveClass('p-6', 'pt-0');
    });
  });

  describe('Estructura Completa de Card', () => {
    it('debe renderizar una card completa con todos sus componentes', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card content goes here</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card content goes here')).toBeInTheDocument();
    });

    it('debe mantener jerarquía visual correcta', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      expect(card.children.length).toBe(2);
    });
  });

  describe('Usabilidad Visual', () => {
    it('debe tener sombra para dar profundidad', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('shadow-sm');
    });

    it('debe tener bordes redondeados para mejor estética', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('rounded-xl');
    });

    it('debe tener transición suave en hover', () => {
      const { container } = render(<Card hoverEffect>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('transition-transform', 'duration-300');
    });
  });

  describe('Casos de Uso en Dashboard', () => {
    it('debe renderizar card de estadística', () => {
      render(
        <Card hoverEffect>
          <CardHeader>
            <CardTitle>Total Reclamos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs">+20.1% mes anterior</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByText('Total Reclamos')).toBeInTheDocument();
      expect(screen.getByText('1,234')).toBeInTheDocument();
      expect(screen.getByText('+20.1% mes anterior')).toBeInTheDocument();
    });

    it('debe renderizar múltiples cards', () => {
      render(
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Card 1</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Card 2</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Card 3</CardTitle>
            </CardHeader>
          </Card>
        </div>
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
    });
  });

  describe('Responsividad', () => {
    it('debe mantener estructura en diferentes tamaños', () => {
      const { container } = render(
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Responsive Card</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('w-full');
    });
  });
});
