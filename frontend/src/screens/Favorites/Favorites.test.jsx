import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Favorites from './Favorites';
import { AuthContext } from '../../context/AuthContext';

vi.mock('react-toastify', () => ({
    ToastContainer: () => <div data-testid="toast-container" />,
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}));
import { toast } from 'react-toastify';

describe('Favorites Component', () => {
    const mockUser = { id: 1, name: 'User' };

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    const renderWithContext = (user = mockUser) => {
        return render(
            <AuthContext.Provider value={{ user, logout: vi.fn() }}>
                <BrowserRouter>
                    <Favorites />
                </BrowserRouter>
            </AuthContext.Provider>
        );
    };

    it('renders empty state initially', () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => []
        });

        renderWithContext();

        expect(screen.getByText('Meus Favoritos')).toBeInTheDocument();
        expect(screen.getByText('Você ainda não tem nenhum produto favoritado.')).toBeInTheDocument();
    });

    it('fetches and renders favorites', async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => [
                { id: 10, nome: 'Produto Fav', preco: 50.0, imagem: 'img.png' }
            ]
        });

        renderWithContext();

        await waitFor(() => {
            expect(screen.getByText('Produto Fav')).toBeInTheDocument();
            expect(screen.getByText('R$ 50,00')).toBeInTheDocument();
            expect(screen.getByAltText('Produto Fav')).toHaveAttribute('src', 'img.png');
        });
    });

    it('removes favorite successfully', async () => {
        global.fetch
            .mockResolvedValueOnce({
                json: async () => [{ id: 10, nome: 'Produto Fav', preco: 50.0 }]
            })
            .mockResolvedValueOnce({
                ok: true
            });

        renderWithContext();

        await waitFor(() => {
            expect(screen.getByText('Produto Fav')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTitle('Remover dos favoritos'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/usuarios/1/favoritos/10', { method: 'DELETE' });
            expect(toast.success).toHaveBeenCalledWith('Removido dos favoritos');
            expect(screen.queryByText('Produto Fav')).not.toBeInTheDocument();
        });
    });

    it('shows error toast when remove fails', async () => {
        global.fetch
            .mockResolvedValueOnce({
                json: async () => [{ id: 10, nome: 'Produto Fav', preco: 50.0 }]
            })
            .mockRejectedValueOnce(new Error('Failed'));

        renderWithContext();

        await waitFor(() => {
            expect(screen.getByText('Produto Fav')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTitle('Remover dos favoritos'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Erro ao remover favorito');
        });
    });

    it('handles fetch favorites error', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        renderWithContext();

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Erro ao buscar favoritos:', expect.any(Error));
        });
        
        consoleSpy.mockRestore();
    });
});
