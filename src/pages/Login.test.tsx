import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Login } from './Login';
import { AuthProvider } from '../context/AuthContext';

// Mock del módulo animejs
jest.mock('animejs', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock de navegación
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock del logo
jest.mock('../assets/logo.png', () => 'logo.png');

describe('Login Page - Usabilidad y Respuestas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  describe('Renderizado y UI', () => {
    it('debe renderizar todos los elementos principales', () => {
      renderLogin();
      
      expect(screen.getByText('ClaimFlow')).toBeInTheDocument();
      expect(screen.getByText('Sistema de Gestión de Reclamos')).toBeInTheDocument();
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
      expect(screen.getByText('Ingresa tus credenciales para acceder')).toBeInTheDocument();
    });

    it('debe mostrar el logo de la aplicación', () => {
      renderLogin();
      const logo = screen.getByAltText('ClaimFlow Logo');
      expect(logo).toBeInTheDocument();
    });

    it('debe renderizar campos de email y contraseña', () => {
      renderLogin();
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    });

    it('debe mostrar botón de ingresar', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
    });

    it('debe mostrar link de recuperación de contraseña', () => {
      renderLogin();
      expect(screen.getByText(/¿Olvidaste tu contraseña?/i)).toBeInTheDocument();
      expect(screen.getByText(/Contactar soporte/i)).toBeInTheDocument();
    });
  });

  describe('Validación de Formulario', () => {
    it('debe requerir email', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeRequired();
    });

    it('debe requerir contraseña', async () => {
      renderLogin();
      const passwordInput = screen.getByLabelText(/contraseña/i);
      expect(passwordInput).toBeRequired();
    });

    it('debe tener type="email" en campo de email', () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('debe tener type="password" en campo de contraseña', () => {
      renderLogin();
      const passwordInput = screen.getByLabelText(/contraseña/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('debe mostrar placeholder en campo email', () => {
      renderLogin();
      const emailInput = screen.getByPlaceholderText('nombre@empresa.com');
      expect(emailInput).toBeInTheDocument();
    });
  });

  describe('Interacciones del Usuario', () => {
    it('debe permitir escribir en el campo de email', async () => {
      const user = userEvent.setup();
      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('debe permitir escribir en el campo de contraseña', async () => {
      const user = userEvent.setup();
      renderLogin();
      
      const passwordInput = screen.getByLabelText(/contraseña/i);
      await user.type(passwordInput, 'password123');
      
      expect(passwordInput).toHaveValue('password123');
    });

    it('debe limpiar campos cuando el usuario los edita', async () => {
      const user = userEvent.setup();
      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      await user.clear(emailInput);
      
      expect(emailInput).toHaveValue('');
    });
  });

  describe('Respuesta de Login Exitoso', () => {
    it('debe mostrar estado de carga durante el login', async () => {
      const user = userEvent.setup();
      
      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({
            accessToken: 'fake-token',
            user: { id: 1, fullname: 'Test User', email: 'test@example.com' }
          })
        }), 100))
      );

      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /ingresar/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(screen.getByText(/ingresando.../i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('debe navegar al dashboard después de login exitoso', async () => {
      const user = userEvent.setup();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          accessToken: 'fake-token',
          user: { id: 1, fullname: 'Test User', email: 'test@example.com' }
        })
      });

      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /ingresar/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('Respuesta de Login Fallido', () => {
    it('debe mostrar mensaje de error cuando las credenciales son incorrectas', async () => {
      const user = userEvent.setup();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Credenciales inválidas' })
      });

      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /ingresar/i });

      await user.type(emailInput, 'wrong@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
      });
    });

    it('debe mostrar error genérico cuando falla la conexión', async () => {
      const user = userEvent.setup();
      
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /ingresar/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('debe mantener los datos en los campos después de un error', async () => {
      const user = userEvent.setup();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Error' })
      });

      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(screen.getByRole('button', { name: /ingresar/i }));

      await waitFor(() => {
        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
      });
    });

    it('debe volver a habilitar el botón después de un error', async () => {
      const user = userEvent.setup();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Error' })
      });

      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /ingresar/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Usabilidad con Teclado', () => {
    it('debe poder enviar formulario con Enter', async () => {
      const user = userEvent.setup();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          accessToken: 'fake-token',
          user: { id: 1, fullname: 'Test User', email: 'test@example.com' }
        })
      });

      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('debe poder navegar entre campos con Tab', async () => {
      const user = userEvent.setup();
      renderLogin();
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      emailInput.focus();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();
    });
  });

  describe('Diseño Responsive', () => {
    it('debe tener clases responsive correctas', () => {
      const { container } = renderLogin();
      const mainDiv = container.querySelector('.min-h-screen');
      expect(mainDiv).toBeInTheDocument();
    });

    it('debe tener contenedor con ancho máximo', () => {
      const { container } = renderLogin();
      const cardContainer = container.querySelector('.max-w-md');
      expect(cardContainer).toBeInTheDocument();
    });
  });
});
