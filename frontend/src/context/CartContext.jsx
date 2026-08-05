import { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart(null);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/carrinho', {
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user.id
                }
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (error) {
            console.error('Erro ao buscar carrinho:', error);
        }
    };

    const addItem = async (produtoId, quantidade = 1) => {
        if (!user) {
            alert('Você precisa estar logado para adicionar itens ao carrinho.');
            return;
        }
        
        setLoading(true);
        try {
            const res = await fetch('/api/carrinho/itens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user.id
                },
                body: JSON.stringify({ produtoId, quantidade })
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data);
                setIsCartOpen(true);
            }
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (produtoId, quantidade) => {
        try {
            const res = await fetch(`/api/carrinho/itens/${produtoId}?quantidade=${quantidade}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user.id
                }
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
        }
    };

    const removeItem = async (produtoId) => {
        try {
            const res = await fetch(`/api/carrinho/itens/${produtoId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user.id
                }
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (error) {
            console.error('Erro ao remover item:', error);
        }
    };

    const clearCart = async () => {
        try {
            const res = await fetch('/api/carrinho', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user.id
                }
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (error) {
            console.error('Erro ao limpar carrinho:', error);
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            isCartOpen,
            setIsCartOpen,
            addItem,
            updateQuantity,
            removeItem,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
