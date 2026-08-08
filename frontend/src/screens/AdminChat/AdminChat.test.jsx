import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AdminChat from './AdminChat';
import { AuthContext } from '../../context/AuthContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('AdminChat Screen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    // Mock scrollIntoView which is not present in JSDOM
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  const renderWithContext = (user) => {
    return render(
      <AuthContext.Provider value={{ user }}>
        <BrowserRouter>
          <AdminChat />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  it('renders admin chat screen for admin user', () => {
    renderWithContext({ email: 'admin' });
    expect(screen.getByText('Assistente de Gerência')).toBeInTheDocument();
    expect(screen.getByText('Olá! Sou o assistente virtual do administrador. Posso informar a quantidade de produtos ou o valor total do estoque.')).toBeInTheDocument();
  });

  it('redirects to main page for non-admin user', () => {
    renderWithContext({ email: 'user@gmail.com' });
    expect(mockNavigate).toHaveBeenCalledWith('/main');
  });

  it('sends message and displays response from API', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'Temos 10 produtos cadastrados.' })
    });

    renderWithContext({ email: 'admin' });

    const input = screen.getByPlaceholderText('Pergunte sobre produtos ou valor total...');
    fireEvent.change(input, { target: { value: 'Quantos produtos existem?' } });
    
    const sendButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(sendButton);

    expect(screen.getByText('Quantos produtos existem?')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Temos 10 produtos cadastrados.')).toBeInTheDocument();
    });
  });

  it('shows error message if API fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API failure'));

    renderWithContext({ email: 'admin' });

    const input = screen.getByPlaceholderText('Pergunte sobre produtos ou valor total...');
    fireEvent.change(input, { target: { value: 'Valor do estoque?' } });
    
    const sendButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Desculpe, ocorreu um erro ao conectar com o servidor.')).toBeInTheDocument();
    });
  });

  it('navigates back when Voltar button is clicked', () => {
    renderWithContext({ email: 'admin' });
    const backBtn = screen.getByRole('button', { name: /voltar/i });
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
