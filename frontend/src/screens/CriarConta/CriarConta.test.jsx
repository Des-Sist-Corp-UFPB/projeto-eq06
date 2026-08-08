import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CriarConta from './CriarConta';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('CriarConta Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        global.alert = vi.fn();
    });

    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <CriarConta />
            </BrowserRouter>
        );
    };

    it('renders the form correctly', () => {
        renderComponent();
        expect(screen.getByText('Nome completo')).toBeInTheDocument();
        expect(screen.getByText('Endereço de email')).toBeInTheDocument();
        expect(screen.getByText('CPF')).toBeInTheDocument();
        expect(screen.getByText('Senha')).toBeInTheDocument();
        expect(screen.getByText('Confirme a senha')).toBeInTheDocument();
    });

    it('shows alert when passwords do not match', () => {
        const { container } = renderComponent();

        fireEvent.change(screen.getByPlaceholderText('fulano de tal'), { target: { value: 'Teste' } });
        fireEvent.change(screen.getByPlaceholderText('email@gmail.com'), { target: { value: 'teste@teste.com' } });
        fireEvent.change(screen.getByPlaceholderText('000.000.000-00'), { target: { value: '111.111.111-11' } });
        
        // As senhas estão diferentes
        const passwordInputs = screen.getAllByPlaceholderText('********');
        fireEvent.change(passwordInputs[0], { target: { value: '123456' } });
        fireEvent.change(passwordInputs[1], { target: { value: 'abcdef' } });

        const form = container.querySelector('form');
        fireEvent.submit(form);

        expect(global.alert).toHaveBeenCalledWith('As senhas não coincidem!');
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('shows alert when email is already registered', () => {
        localStorage.setItem('users_list', JSON.stringify([{ email: 'teste@teste.com' }]));
        const { container } = renderComponent();

        fireEvent.change(screen.getByPlaceholderText('fulano de tal'), { target: { value: 'Teste' } });
        fireEvent.change(screen.getByPlaceholderText('email@gmail.com'), { target: { value: 'teste@teste.com' } });
        fireEvent.change(screen.getByPlaceholderText('000.000.000-00'), { target: { value: '111.111.111-11' } });
        
        const passwordInputs = screen.getAllByPlaceholderText('********');
        fireEvent.change(passwordInputs[0], { target: { value: '123456' } });
        fireEvent.change(passwordInputs[1], { target: { value: '123456' } });

        const form = container.querySelector('form');
        fireEvent.submit(form);

        expect(global.alert).toHaveBeenCalledWith('Este email já está cadastrado!');
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('creates account successfully and navigates to login', () => {
        const { container } = renderComponent();

        fireEvent.change(screen.getByPlaceholderText('fulano de tal'), { target: { value: 'Teste Novo' } });
        fireEvent.change(screen.getByPlaceholderText('email@gmail.com'), { target: { value: 'novo@teste.com' } });
        fireEvent.change(screen.getByPlaceholderText('000.000.000-00'), { target: { value: '111.111.111-11' } });
        
        const passwordInputs = screen.getAllByPlaceholderText('********');
        fireEvent.change(passwordInputs[0], { target: { value: '123456' } });
        fireEvent.change(passwordInputs[1], { target: { value: '123456' } });

        const form = container.querySelector('form');
        fireEvent.submit(form);

        expect(global.alert).toHaveBeenCalledWith('Conta criada com sucesso!');
        expect(mockNavigate).toHaveBeenCalledWith('/login');

        const usersList = JSON.parse(localStorage.getItem('users_list'));
        expect(usersList.length).toBe(1);
        expect(usersList[0].email).toBe('novo@teste.com');
    });

    it('toggles password visibility', () => {
        renderComponent();
        
        const toggleButtons = screen.getAllByRole('button').filter(b => b.className === 'btn-toggle-senha');
        const passwordInputs = screen.getAllByPlaceholderText('********');
        
        // Initial state
        expect(passwordInputs[0]).toHaveAttribute('type', 'password');
        expect(passwordInputs[1]).toHaveAttribute('type', 'password');

        // Click toggle
        fireEvent.click(toggleButtons[0]);
        fireEvent.click(toggleButtons[1]);

        expect(passwordInputs[0]).toHaveAttribute('type', 'text');
        expect(passwordInputs[1]).toHaveAttribute('type', 'text');

        // Click again
        fireEvent.click(toggleButtons[0]);
        fireEvent.click(toggleButtons[1]);

        expect(passwordInputs[0]).toHaveAttribute('type', 'password');
        expect(passwordInputs[1]).toHaveAttribute('type', 'password');
    });
});
