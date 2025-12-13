import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input Component - UI & Usability Tests', () => {
  describe('Renderizado Básico', () => {
    it('debe renderizar correctamente', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
    });

    it('debe mostrar label cuando se proporciona', () => {
      render(<Input label="Username" />);
      expect(screen.getByText(/username/i)).toBeInTheDocument();
    });

    it('debe mostrar placeholder correctamente', () => {
      render(<Input placeholder="john@example.com" />);
      expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
    });

    it('debe renderizar sin label', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Validación y Errores', () => {
    it('debe mostrar mensaje de error', () => {
      render(<Input error="Este campo es requerido" />);
      expect(screen.getByText(/este campo es requerido/i)).toBeInTheDocument();
    });

    it('debe aplicar estilos de error cuando hay un error', () => {
      render(<Input error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });

    it('debe mostrar error en color rojo', () => {
      render(<Input error="Error message" />);
      const errorElement = screen.getByText('Error message');
      expect(errorElement).toHaveClass('text-red-500');
    });

    it('no debe mostrar error cuando no se proporciona', () => {
      render(<Input />);
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('Interacciones del Usuario', () => {
    it('debe permitir escribir texto', async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole('textbox');
      
      await user.type(input, 'Hello World');
      expect(input).toHaveValue('Hello World');
    });

    it('debe llamar onChange cuando el usuario escribe', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      
      await user.type(input, 'Test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('debe manejar diferentes tipos de input', () => {
      const { rerender } = render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
      
      rerender(<Input type="password" />);
      const passwordInput = document.querySelector('input[type="password"]');
      expect(passwordInput).toBeInTheDocument();
    });

    it('debe estar deshabilitado cuando disabled es true', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('debe aplicar estilos de disabled', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('disabled:opacity-50');
    });
  });

  describe('Usabilidad y Accesibilidad', () => {
    it('debe ser required cuando se especifica', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('debe tener focus ring para accesibilidad', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus:ring-2');
    });

    it('debe poder recibir y mantener focus', async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole('textbox');
      
      await user.click(input);
      expect(input).toHaveFocus();
    });

    it('debe mostrar estilos de focus', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus:ring-primary-500');
    });

    it('debe asociar label con input correctamente', () => {
      render(<Input label="Email" id="email" />);
      const label = screen.getByText('Email');
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'email');
    });
  });

  describe('Respuestas Visuales', () => {
    it('debe aplicar transiciones', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('transition-all');
    });

    it('debe aplicar clases personalizadas', () => {
      render(<Input className="custom-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-input');
    });

    it('debe tener estilos base correctos', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('rounded-md', 'border', 'bg-white');
    });
  });

  describe('Casos de Uso Comunes', () => {
    it('debe funcionar en un formulario de login', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e) => e.preventDefault());
      
      render(
        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" required />
          <Input label="Password" type="password" required />
          <button type="submit">Submit</button>
        </form>
      );
      
      const emailInput = screen.getByRole('textbox');
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');
    });
  });
});
