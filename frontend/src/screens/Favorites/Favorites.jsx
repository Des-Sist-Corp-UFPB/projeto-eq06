import React, { useState, useEffect, useContext } from 'react';
import './Favorites.css';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import Header from '../../components/Header/Header';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from "react-toastify";

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = () => {
    fetch(`/api/usuarios/${user.id}/favoritos`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFavoritos(data);
      })
      .catch(err => console.error("Erro ao buscar favoritos:", err));
  };

  const handleRemoveFavorite = async (produtoId) => {
    try {
      const res = await fetch(`/api/usuarios/${user.id}/favoritos/${produtoId}`, { method: 'DELETE' });
      if (res.ok) {
        setFavoritos(prev => prev.filter(p => p.id !== produtoId));
        toast.success("Removido dos favoritos");
      }
    } catch (e) {
      toast.error("Erro ao remover favorito");
    }
  };

  return (
    <div className="fav-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <main className="fav-content">
        <h1 className="main-title">Meus Favoritos</h1>

        <div className="fav-grid">
          <div className="column-labels">
            <span className="label-produtos">Produtos</span>
            <span className="label-precos">Ações</span>
          </div>

          <div className="items-list">
            {favoritos.length === 0 ? (
              <p style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>Você ainda não tem nenhum produto favoritado.</p>
            ) : (
              favoritos.map((item) => (
                <div key={item.id} className="fav-item">
                  <div className="item-info">
                    <div className="item-image">
                      <img src={item.imagem || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"} alt={item.title || item.nome} />
                    </div>
                    <div className="item-details">
                      <h3>{item.title || item.nome}</h3>
                      <div className="price-qty">
                        <span className="unit-price">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price || item.preco || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="item-total" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '15px' }}>
                    <button 
                      onClick={() => handleRemoveFavorite(item.id)} 
                      style={{ background: 'none', border: 'none', color: '#ee7b5b', cursor: 'pointer', fontSize: '20px' }}
                      title="Remover dos favoritos"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <button className="btn-continue">
          <FiShoppingCart /> Continuar comprando
        </button>
      </main>
    </div>
  );
};

export default Favorites;