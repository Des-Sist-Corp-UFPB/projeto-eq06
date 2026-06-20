import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import { AuthContext } from '../../context/AuthContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('react-toastify', () => ({
    ToastContainer: () => <div data-testid="toast-container" />,
    toast: {
        error: vi.fn()
    }
}));
import { toast } from 'react-toastify';

describe('Login Component', () => {
    const mockLogin = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    const renderLogin = () => {
        return render(
            <AuthContext.Provider value={{ login: mockLogin }}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </AuthContext.Provider>
        );
    };

    it('renders user login by default', () => {
        renderLogin();
        expect(screen.getByText('Email do Usuário')).toBeInTheDocument();
        expect(screen.queryByText('Acesso Administrativo')).not.toBeInTheDocument();
    });

    it('switches to admin tab and renders admin login', () => {
        renderLogin();
        
        fireEvent.click(screen.getByText('Administrador'));
        
        expect(screen.getByText('Acesso Administrativo')).toBeInTheDocument();
        expect(screen.getByText('Email do Admin')).toBeInTheDocument();
    });

    it('handles successful user login', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 1, email: 'user@email.com', nome: 'User' })
        });

        renderLogin();

        fireEvent.change(screen.getByPlaceholderText('usuario@email.com'), { target: { value: 'user@email.com' } });
        fireEvent.change(screen.getByPlaceholderText('********'), { target: { value: '123456' } });

        fireEvent.click(screen.getByText('Entrar'));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({ id: 1, email: 'user@email.com', name: 'User' });
            expect(mockNavigate).toHaveBeenCalledWith('/main');
        });
    });

    it('handles successful admin login', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 99, email: 'admin@email.com', nome: 'Admin' })
        });

        renderLogin();
        
        fireEvent.click(screen.getByText('Administrador'));

        fireEvent.change(screen.getByPlaceholderText('admin'), { target: { value: 'admin@email.com' } });
        fireEvent.change(screen.getByPlaceholderText('********'), { target: { value: 'adminpass' } });

        fireEvent.click(screen.getByText('Entrar'));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({ id: 99, email: 'admin@email.com', name: 'Admin' });
            expect(mockNavigate).toHaveBeenCalledWith('/main');
        });
    });

    it('handles invalid credentials (401)', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 401
        });

        renderLogin();

        fireEvent.change(screen.getByPlaceholderText('usuario@email.com'), { target: { value: 'wrong@email.com' } });
        fireEvent.change(screen.getByPlaceholderText('********'), { target: { value: 'wrong' } });

        fireEvent.click(screen.getByText('Entrar'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Usuário ou senha inválidos!');
        });
    });

    it('handles server error (500)', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500
        });

        renderLogin();

        fireEvent.click(screen.getByText('Entrar'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Erro interno do servidor.');
        });
    });

    it('handles network error (fetch failure)', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        renderLogin();

        fireEvent.click(screen.getByText('Entrar'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Falha ao comunicar com o servidor.');
        });
    });
});
