import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import Cookies from 'js-cookie';

// Mock de Cookies
jest.mock('js-cookie', () => {
  return {
    __esModule: true,
    default: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    },
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  };
});

// Mock de fetch global
global.fetch = jest.fn();

describe('AuthContext - Respuestas y Autenticación', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (Cookies.get as jest.Mock).mockReturnValue(undefined);
  });

  describe('Estado Inicial', () => {
    it('debe inicializar con usuario null', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('debe restaurar sesión si existe token y usuario en storage', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'User',
        avatar: 'https://example.com/avatar.jpg',
      };

      (Cookies.get as jest.Mock).mockReturnValue('fake-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('Login Exitoso', () => {
    it('debe autenticar usuario correctamente', async () => {
      const mockResponse = {
        accessToken: 'test-token-123',
        user: {
          id: '1',
          fullname: 'John Doe',
          email: 'john@example.com',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.login('john@example.com', 'password123');

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
        expect(result.current.user?.email).toBe('john@example.com');
        expect(result.current.user?.name).toBe('John Doe');
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.error).toBeNull();
      });
    });

    it('debe guardar token en cookies', async () => {
      const mockResponse = {
        accessToken: 'test-token-123',
        user: {
          id: '1',
          fullname: 'John Doe',
          email: 'john@example.com',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.login('john@example.com', 'password123');

      await waitFor(() => {
        expect(Cookies.set).toHaveBeenCalledWith(
          'access_token',
          'test-token-123',
          { expires: 1 }
        );
      });
    });

    it('debe guardar usuario en localStorage', async () => {
      const mockResponse = {
        accessToken: 'test-token-123',
        user: {
          id: '1',
          fullname: 'John Doe',
          email: 'john@example.com',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.login('john@example.com', 'password123');

      await waitFor(() => {
        const savedUser = localStorage.getItem('user');
        expect(savedUser).not.toBeNull();
        const parsedUser = JSON.parse(savedUser!);
        expect(parsedUser.email).toBe('john@example.com');
      });
    });

    it('debe hacer request al endpoint correcto', async () => {
      const mockResponse = {
        accessToken: 'test-token-123',
        user: {
          id: '1',
          fullname: 'John Doe',
          email: 'john@example.com',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.login('john@example.com', 'password123');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'john@example.com',
            password: 'password123',
          }),
        })
      );
    });
  });

  describe('Login Fallido', () => {
    it('debe manejar credenciales incorrectas', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Credenciales inválidas' }),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        result.current.login('wrong@example.com', 'wrongpassword')
      ).rejects.toThrow('Credenciales inválidas');

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe('Credenciales inválidas');
    });

    it('debe manejar errores de red', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        result.current.login('test@example.com', 'password123')
      ).rejects.toThrow('Network error');

      expect(result.current.error).toBe('Network error');
    });

    it('debe mostrar mensaje de error genérico si no hay mensaje específico', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        result.current.login('test@example.com', 'password123')
      ).rejects.toThrow('Error al iniciar sesión');
    });

    it('debe limpiar error al intentar login nuevamente', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Primer intento fallido
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Error' }),
      });

      await expect(
        result.current.login('test@example.com', 'wrong')
      ).rejects.toThrow();

      // Segundo intento exitoso
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          accessToken: 'token',
          user: { id: '1', fullname: 'Test', email: 'test@example.com' },
        }),
      });

      await result.current.login('test@example.com', 'correct');

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('Estado de Carga', () => {
    it('debe mostrar loading durante el login', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({
                    accessToken: 'token',
                    user: {
                      id: '1',
                      fullname: 'Test',
                      email: 'test@example.com',
                    },
                  }),
                }),
              100
            )
          )
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const loginPromise = result.current.login('test@example.com', 'password');

      // Durante el login debe estar en loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      await loginPromise;

      // Después del login debe dejar de estar en loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('Logout', () => {
    it('debe limpiar sesión correctamente', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'User' as const,
        avatar: 'avatar.jpg',
      };

      (Cookies.get as jest.Mock).mockReturnValue('fake-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await result.current.logout();

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
      });
    });

    it('debe remover token de cookies', async () => {
      (Cookies.get as jest.Mock).mockReturnValue('fake-token');
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.logout();

      expect(Cookies.remove).toHaveBeenCalledWith('access_token');
    });

    it('debe remover usuario de localStorage', async () => {
      localStorage.setItem('user', JSON.stringify({ id: '1' }));
      (Cookies.get as jest.Mock).mockReturnValue('fake-token');
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.logout();

      expect(localStorage.getItem('user')).toBeNull();
    });

    it('debe llamar al endpoint de logout', async () => {
      (Cookies.get as jest.Mock).mockReturnValue('test-token');
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.logout();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/auth/logout',
        expect.objectContaining({
          method: 'POST',
          headers: {
            Authorization: 'Bearer test-token',
          },
        })
      );
    });

    it('debe limpiar sesión incluso si falla el request', async () => {
      (Cookies.get as jest.Mock).mockReturnValue('test-token');
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.logout();

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(Cookies.remove).toHaveBeenCalled();
      });
    });
  });

  describe('Generación de Avatar', () => {
    it('debe generar URL de avatar basada en el nombre', async () => {
      const mockResponse = {
        accessToken: 'token',
        user: {
          id: '1',
          fullname: 'Jane Smith',
          email: 'jane@example.com',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.login('jane@example.com', 'password');

      await waitFor(() => {
        expect(result.current.user?.avatar).toContain('Jane Smith');
        expect(result.current.user?.avatar).toContain('ui-avatars.com');
      });
    });
  });
});
