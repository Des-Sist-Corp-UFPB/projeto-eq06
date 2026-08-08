import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Chat from './Chat';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ produtoId: '123' })
  };
});

vi.mock('axios', () => ({
  default: {
    post: vi.fn()
  }
}));

describe('Chat Screen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  const renderWithContext = (user) => {
    return render(
      <AuthContext.Provider value={{ user }}>
        <BrowserRouter>
          <Chat />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  it('renders chat screen elements correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    renderWithContext({ id: 1, nome: 'Comprador' });

    expect(screen.getByText('Chat com o vendedor')).toBeInTheDocument();
    expect(screen.getByText('Henrique Santos')).toBeInTheDocument();
  });

  it('fetches and displays messages from the API', async () => {
    const fakeMessages = [
      {
        id: 1,
        remetenteId: 1,
        texto: 'Mensagem de teste',
        enviadaEm: '2026-07-01T08:00:00.000Z'
      },
      {
        id: 2,
        remetenteId: 2,
        texto: 'Resposta do vendedor',
        enviadaEm: '2026-07-01T08:05:00.000Z'
      }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeMessages
    });

    renderWithContext({ id: 1, nome: 'Comprador' });

    await waitFor(() => {
      expect(screen.getByText('Mensagem de teste')).toBeInTheDocument();
      expect(screen.getByText('Resposta do vendedor')).toBeInTheDocument();
    });
  });

  it('sends a new message successfully', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true
      });

    renderWithContext({ id: 1, nome: 'Comprador' });

    const input = screen.getByPlaceholderText('Digite sua mensagem...');
    fireEvent.change(input, { target: { value: 'Olá, ainda tem?' } });

    const sendBtn = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(sendBtn);

    expect(screen.getByText('Olá, ainda tem?')).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/mensagens', expect.objectContaining({
        method: 'POST'
      }));
    });
  });

  it('queries Gemini AI and displays response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    axios.post.mockResolvedValueOnce({
      data: 'Olá! Sou a inteligência artificial do Mercado.'
    });

    renderWithContext({ id: 1, nome: 'Comprador' });

    const input = screen.getByPlaceholderText('Digite sua mensagem...');
    fireEvent.change(input, { target: { value: 'O que você faz?' } });

    const askIABtn = screen.getByRole('button', { name: /perguntar ia/i });
    fireEvent.click(askIABtn);

    expect(screen.getByText('O que você faz?')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Olá! Sou a inteligência artificial do Mercado.')).toBeInTheDocument();
    });
  });

  it('shows error if Gemini AI fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    axios.post.mockRejectedValueOnce(new Error('AI failure'));

    renderWithContext({ id: 1, nome: 'Comprador' });

    const input = screen.getByPlaceholderText('Digite sua mensagem...');
    fireEvent.change(input, { target: { value: 'Falhar' } });

    const askIABtn = screen.getByRole('button', { name: /perguntar ia/i });
    fireEvent.click(askIABtn);

    await waitFor(() => {
      expect(screen.getByText('Desculpe, não consegui responder agora.')).toBeInTheDocument();
    });
  });
});
