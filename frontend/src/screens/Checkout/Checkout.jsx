import React, { useState } from 'react';
import './Checkout.css';
import LogoPBX from '../../assets/logo/1211 Sem Título_20260220095240.png';

const Checkout = () => {
  const [etapa, setEtapa] = useState(1);

  return (
    <div className="checkout-screen">
      <div className="checkout-header">
        <img src={LogoPBX} alt="Logo PBX" className="checkout-logo" />
      </div>

      <div className="checkout-container">
        {etapa === 1 && (
          <div className="checkout-card">
            <div className="input-group">
              <label>Confirme seu e-mail</label>
              <input type="email" placeholder="e-mail@gmail.com" />
            </div>
            <div className="input-group">
              <label>Confirme seu nome completo</label>
              <input type="text" placeholder="Nome" />
            </div>
            <div className="input-group">
              <label>Confirme o endereço</label>
              <input type="text" placeholder="Rua, local, nº" />
            </div>
            <button className="btn-confirmar" onClick={() => setEtapa(2)}>
              Confirmar
            </button>
          </div>
        )}

        {etapa === 2 && (
          <div className="checkout-card">
            <div className="input-group">
              <label>Digite o código de segurança</label>
              <input type="text" placeholder="1234" maxLength="4" />
              <p className="helper-text">O código foi enviado para seu e-mail</p>
            </div>
            <button className="btn-confirmar" onClick={() => setEtapa(3)}>
              Confirmar
            </button>
          </div>
        )}

        {etapa === 3 && (
          <div className="success-overlay">
            <div className="success-gray-card">
              <div className="success-white-card">
                <p className="success-text">Sua compra foi realizada com sucesso</p>
                <button className="btn-confirmar-success coral" onClick={() => setEtapa(1)}>
                  Confirmar
                </button>
              </div>

              <button className="btn-confirmar-success brown outside-button" disabled>
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div> 
    </div>
  );
};

export default Checkout;