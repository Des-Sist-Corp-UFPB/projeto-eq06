import React from 'react';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './CartDrawer.css';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeItem, clearCart, loading } = useCart();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const totalItens = cart?.quantidadeTotal || 0;

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <>
            <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>
                        🛒 Meu Carrinho
                        {totalItens > 0 && <span>{totalItens} {totalItens === 1 ? 'item' : 'itens'}</span>}
                    </h2>
                    <button className="close-btn" onClick={() => setIsCartOpen(false)}>
                        <FiX size={20} />
                    </button>
                </div>

                <div className="cart-content">
                    {loading && !cart ? (
                        <div className="cart-empty">
                            <p>Carregando carrinho...</p>
                        </div>
                    ) : cart?.itens?.length > 0 ? (
                        <ul className="cart-items">
                            {cart.itens.map(item => (
                                <li key={item.produtoId} className="cart-item">
                                    <img src={item.imagemProduto || 'https://via.placeholder.com/70'} alt={item.nomeProduto} className="item-img" />
                                    <div className="item-info">
                                        <h4 className="item-name">{item.nomeProduto}</h4>
                                        <p className="item-price">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.precoProduto)}
                                        </p>
                                        <div className="item-actions">
                                            <div className="quantity-controls">
                                                <button onClick={() => updateQuantity(item.produtoId, item.quantidade - 1)}>
                                                    <FiMinus size={13} />
                                                </button>
                                                <span>{item.quantidade}</span>
                                                <button onClick={() => updateQuantity(item.produtoId, item.quantidade + 1)}>
                                                    <FiPlus size={13} />
                                                </button>
                                            </div>
                                            <button className="remove-btn" onClick={() => removeItem(item.produtoId)} title="Remover item">
                                                <FiTrash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="cart-empty">
                            <FiShoppingCart size={52} />
                            <p>Seu carrinho está vazio.</p>
                            <button className="continue-btn" onClick={() => setIsCartOpen(false)}>
                                Explorar produtos
                            </button>
                        </div>
                    )}
                </div>

                {cart?.itens?.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Total</span>
                            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cart.total)}</span>
                        </div>
                        <div className="cart-footer-buttons">
                            <button className="clear-cart-btn" onClick={clearCart}>Limpar</button>
                            <button className="checkout-btn" onClick={handleCheckout}>Finalizar Compra</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
