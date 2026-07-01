import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProdutoModal from './ProdutoModal';
import { AuthContext } from '../../context/AuthContext';

// Mock do toast
vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn()
    }
}));

import { toast } from 'react-toastify';

describe('ProdutoModal', () => {
    const mockOnClose = vi.fn();
    const mockOnProductCreated = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    const renderModal = () => {
        return render(
            <AuthContext.Provider value={{ user: { email: 'admin' }, logout: vi.fn() }}>
                <ProdutoModal onClose={mockOnClose} onProductCreated={mockOnProductCreated} />
            </AuthContext.Provider>
        );
    };

    it('renders correctly', () => {
        renderModal();
        expect(screen.getByText('Cadastrar Produto')).toBeInTheDocument();
    });

    it('calls onClose when clicking outside or close button', () => {
        renderModal();
        
        fireEvent.click(screen.getByText('×'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);

        // Click overlay
        const overlay = screen.getByText('Cadastrar Produto').parentElement.parentElement;
        fireEvent.click(overlay);
        expect(mockOnClose).toHaveBeenCalledTimes(2);
    });

    it('shows warning when submitting without required fields', () => {
        const { container } = renderModal();
        
        // Form submit directly
        const form = container.querySelector('form');
        fireEvent.submit(form);
        
        expect(toast.warning).toHaveBeenCalledWith('Nome e preço são obrigatórios.');
    });

    it('submits form successfully', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 1, nome: 'Teste' })
        });

        renderModal();

        fireEvent.change(screen.getByPlaceholderText('Ex: Tênis Esportivo'), { target: { value: 'Produto Teste' } });
        fireEvent.change(screen.getByPlaceholderText('Ex: 150.00'), { target: { value: '100' } });

        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Produto cadastrado com sucesso!');
            expect(mockOnProductCreated).toHaveBeenCalledWith({ id: 1, nome: 'Teste' });
        });
    });

    it('handles server 400 error', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 400
        });

        renderModal();

        fireEvent.change(screen.getByPlaceholderText('Ex: Tênis Esportivo'), { target: { value: 'Produto Teste' } });
        fireEvent.change(screen.getByPlaceholderText('Ex: 150.00'), { target: { value: '100' } });

        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Preencha todos os campos corretamente.');
        });
    });

    it('handles server 500 error', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500
        });

        renderModal();

        fireEvent.change(screen.getByPlaceholderText('Ex: Tênis Esportivo'), { target: { value: 'Produto Teste' } });
        fireEvent.change(screen.getByPlaceholderText('Ex: 150.00'), { target: { value: '100' } });

        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Erro no servidor. Tente novamente mais tarde.');
        });
    });

    it('handles network error', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        renderModal();

        fireEvent.change(screen.getByPlaceholderText('Ex: Tênis Esportivo'), { target: { value: 'Produto Teste' } });
        fireEvent.change(screen.getByPlaceholderText('Ex: 150.00'), { target: { value: '100' } });

        fireEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Falha ao comunicar com o servidor.');
        });
    });
});
