import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Checkout from './Checkout';

describe('Checkout Component', () => {
    it('renders step 1 by default', () => {
        render(<Checkout />);
        expect(screen.getByText('Confirme seu e-mail')).toBeInTheDocument();
        expect(screen.getByText('Confirme seu nome completo')).toBeInTheDocument();
        expect(screen.getByText('Confirme o endereço')).toBeInTheDocument();
    });

    it('moves to step 2 when clicking confirm on step 1', () => {
        render(<Checkout />);
        
        fireEvent.click(screen.getByText('Confirmar'));
        
        expect(screen.getByText('Digite o código de segurança')).toBeInTheDocument();
        expect(screen.getByText('O código foi enviado para seu e-mail')).toBeInTheDocument();
        expect(screen.queryByText('Confirme seu e-mail')).not.toBeInTheDocument();
    });

    it('moves to step 3 when clicking confirm on step 2', () => {
        render(<Checkout />);
        
        // Step 1 -> 2
        fireEvent.click(screen.getByText('Confirmar'));
        
        // Step 2 -> 3
        fireEvent.click(screen.getByText('Confirmar'));
        
        expect(screen.getByText('Sua compra foi realizada com sucesso')).toBeInTheDocument();
        expect(screen.queryByText('Digite o código de segurança')).not.toBeInTheDocument();
    });

    it('returns to step 1 when clicking confirm on step 3', () => {
        render(<Checkout />);
        
        // Step 1 -> 2
        fireEvent.click(screen.getByText('Confirmar'));
        // Step 2 -> 3
        fireEvent.click(screen.getByText('Confirmar'));
        
        // Step 3 -> 1
        const confirmButtons = screen.getAllByText('Confirmar');
        // O primeiro botão é o ativo "coral"
        fireEvent.click(confirmButtons[0]);
        
        expect(screen.getByText('Confirme seu e-mail')).toBeInTheDocument();
    });
});
