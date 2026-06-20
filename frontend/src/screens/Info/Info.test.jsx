import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import Info from './Info';
import { AuthContext } from '../../context/AuthContext';

vi.mock('../../components/CarouselProduct/ProductCarousel', () => ({
    default: () => <div data-testid="mock-carousel">Carousel Mock</div>
}));

describe('Info Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    const renderWithContext = (initialRoute = '/info/1') => {
        return render(
            <AuthContext.Provider value={{ user: null, logout: vi.fn() }}>
                <MemoryRouter initialEntries={[initialRoute]}>
                    <Routes>
                        <Route path="/info/:id" element={<Info />} />
                        <Route path="/info" element={<Info />} />
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        );
    };

    it('renders loading state initially', () => {
        global.fetch.mockImplementationOnce(() => new Promise(() => {})); // Never resolves
        renderWithContext();
        expect(screen.getByText('Carregando produto...')).toBeInTheDocument();
    });

    it('renders not found when id is missing', () => {
        renderWithContext('/info');
        expect(screen.getByText('Produto não encontrado')).toBeInTheDocument();
        expect(screen.getByText('O produto com ID não existe ou foi removido.')).toBeInTheDocument();
    });

    it('renders not found on 404 from server', async () => {
        global.fetch.mockResolvedValueOnce({
            status: 404
        });

        renderWithContext('/info/99');

        await waitFor(() => {
            expect(screen.getByText('Produto não encontrado')).toBeInTheDocument();
            expect(screen.getByText('O produto com ID 99 não existe ou foi removido.')).toBeInTheDocument();
        });
    });

    it('renders error on non-ok status', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500
        });

        renderWithContext('/info/1');

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar produto')).toBeInTheDocument();
            expect(screen.getByText('Falha ao carregar o produto. Tente novamente mais tarde.')).toBeInTheDocument();
        });
    });

    it('renders error on fetch failure', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        renderWithContext('/info/1');

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar produto')).toBeInTheDocument();
        });

        consoleSpy.mockRestore();
    });

    it('renders product correctly on success', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({
                id: 1,
                nome: 'Produto Exemplo',
                descricao: 'Descrição do exemplo',
                preco: 250.5,
                imagem: 'http://img.com/foto.jpg'
            })
        });

        renderWithContext('/info/1');

        await waitFor(() => {
            expect(screen.getByText('Produto Exemplo')).toBeInTheDocument();
            expect(screen.getByText('Descrição do exemplo')).toBeInTheDocument();
            expect(screen.getByText('250,50')).toBeInTheDocument(); // The formatted price without symbol
            expect(screen.getByTestId('mock-carousel')).toBeInTheDocument();
        });
    });

    it('renders product with fallback data when properties are missing', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({
                id: 1
                // missing nome, descricao, preco, imagem
            })
        });

        renderWithContext('/info/1');

        await waitFor(() => {
            expect(screen.getByText('Produto 1')).toBeInTheDocument();
            expect(screen.getByText('Descrição não disponível.')).toBeInTheDocument();
            expect(screen.getByText(/0,00/)).toBeInTheDocument();
        });
    });
});
