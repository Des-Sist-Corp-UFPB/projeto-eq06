import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Audit from './Audit';
import { AuthContext } from '../../context/AuthContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Audit Screen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  const renderWithContext = (user) => {
    return render(
      <AuthContext.Provider value={{ user }}>
        <BrowserRouter>
          <Audit />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  it('redirects to /main if user is not admin', () => {
    renderWithContext({ email: 'normal-user' });
    expect(mockNavigate).toHaveBeenCalledWith('/main');
  });

  it('renders loading state initially for admin', () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: [] })
    });

    renderWithContext({ email: 'admin' });
    expect(screen.getByText('Carregando logs...')).toBeInTheDocument();
  });

  it('renders logs in table when API returns successfully', async () => {
    const fakeLogs = [
      {
        id: 1,
        criadoEm: '2026-07-01T08:00:00.000Z',
        acao: 'USER_LOGIN_SUCCESS',
        usuario: 'admin',
        ipAddress: '127.0.0.1',
        detalhes: 'Login efetuado com sucesso'
      }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: fakeLogs })
    });

    renderWithContext({ email: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('USER_LOGIN_SUCCESS')).toBeInTheDocument();
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('127.0.0.1')).toBeInTheDocument();
      expect(screen.getByText('Login efetuado com sucesso')).toBeInTheDocument();
    });
  });

  it('renders empty table message when no logs are returned', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: [] })
    });

    renderWithContext({ email: 'admin' });

    await waitFor(() => {
      expect(screen.getByText('Nenhum log encontrado.')).toBeInTheDocument();
    });
  });
});
