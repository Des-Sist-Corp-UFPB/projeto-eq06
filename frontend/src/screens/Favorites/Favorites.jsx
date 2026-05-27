import React from 'react';
import './Favorites.css';
import { FiSearch, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';
import LogoPBX from '../../assets/logo/1211 Sem Título_20260220094915.png';
import Header from '../../components/Header/Header';

const Favorites = () => {
  const favoritos = [
    { id: 1, nome: "Camisa Polo - Cores", preco: 50.00, qtd: 2, total: 100.00 },
    { id: 2, nome: "Camisa Polo - Cores", preco: 50.00, qtd: 2, total: 100.00 },
    { id: 3, nome: "Camisa Polo - Cores", preco: 50.00, qtd: 2, total: 100.00 },
    { id: 4, nome: "Camisa Polo - Cores", preco: 50.00, qtd: 2, total: 100.00 },
  ];

  return (
    <div className="fav-container">
      <Header />
      {/* HEADER */}
      {/* <header className="fav-header">
        <div className="header-limit">
          <div className="logo-area">
            <img src={LogoPBX} alt="Logo PBX" />
          </div>
          <div className="search-box">
            <input type="text" placeholder="Buscar produtos, casas..." />
            <FiSearch className="search-btn-icon" />
          </div>
          <div className="nav-icons">
            <div className="icon-circle active"><FiHeart /></div>
            <FiShoppingCart className="nav-icon" />
            <div className="profile-avatar"><FiUser /></div>
          </div>
        </div>
      </header> */}
      <main className="fav-content">
        <h1 className="main-title">Favoritos</h1>

        <div className="fav-grid">
          <div className="column-labels">
            <span className="label-produtos">Produtos</span>
            <span className="label-precos">Preços</span>
          </div>

          <div className="items-list">
            {favoritos.map((item) => (
              <div key={item.id} className="fav-item">
                <div className="item-info">
                  <div className="item-image">
                    <img src="https://images.unsplash.com/photo-1671438118097-479e63198629?q=80&w=877&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt={item.nome} />
                  </div>
                  <div className="item-details">
                    <h3>{item.nome}</h3>
                    <div className="price-qty">
                      <span className="unit-price">R$ {item.preco.toFixed(2).replace('.', ',')}</span>
                      <span className="quantity">x {String(item.qtd).padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
                <div className="item-total">
                  <span>R$ {item.total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            ))}
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