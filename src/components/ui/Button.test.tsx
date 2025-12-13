import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component - UI & Usability Tests', () => {
  describe('Renderizado', () => {
    it('debe renderizar correctamente con children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('debe aplicar la variante primary por defecto', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary-600');
    });

    it('debe aplicar la variante secondary correctamente', () => {
      render(<Button variant="secondary">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary-100');
    });

    it('debe aplicar la variante outline correctamente', () => {
      render(<Button variant="outline">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-secondary-300');
    });

    it('debe aplicar la variante danger correctamente', () => {
      render(<Button variant="danger">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-600');
    });
  });

  describe('Tamaños', () => {
    it('debe aplicar el tamaño md por defecto', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10');
    });

    it('debe aplicar el tamaño sm correctamente', () => {
      render(<Button size="sm">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8');
    });

    it('debe aplicar el tamaño lg correctamente', () => {
      render(<Button size="lg">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12');
    });
  });

  describe('Usabilidad e Interacciones', () => {
    it('debe responder a clicks del usuario', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('debe estar deshabilitado cuando disabled es true', () => {
      render(<Button disabled>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('debe mostrar estado de carga', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button.querySelector('svg')).toBeInTheDocument(); // Loader icon
    });

    it('no debe responder a clicks cuando está en loading', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button isLoading onClick={handleClick}>Button</Button>);
      const button = screen.getByRole('button');
      
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('debe tener focus ring para accesibilidad', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('Accesibilidad', () => {
    it('debe ser accesible por teclado', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Button</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('debe mantener el type submit en formularios', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('Respuestas Visuales', () => {
    it('debe aplicar clases personalizadas', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('debe mostrar opacity reducida cuando está disabled', () => {
      render(<Button disabled>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:opacity-50');
    });
  });
});
