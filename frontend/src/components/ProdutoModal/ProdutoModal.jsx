import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "../Button/Button";
import "./ProdutoModal.css";

export default function ProdutoModal({ onClose, onProductCreated }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !preco) {
      toast.warning("Nome e preço são obrigatórios.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome,
          descricao: descricao,
          preco: parseFloat(preco),
          imagem: imagem || null
        })
      });

      if (response.ok) {
        const newProduct = await response.json();
        toast.success("Produto cadastrado com sucesso!");
        onProductCreated(newProduct);
      } else if (response.status === 400) {
        toast.error("Preencha todos os campos corretamente.");
      } else {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
      }
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      toast.error("Falha ao comunicar com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Cadastrar Produto</h2>
        
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Produto</label>
            <input 
              type="text" 
              placeholder="Ex: Tênis Esportivo" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Preço (R$)</label>
            <input 
              type="number" 
              step="0.01" 
              placeholder="Ex: 150.00" 
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea 
              placeholder="Descreva as características do produto..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>URL da Imagem (Opcional)</label>
            <input 
              type="text" 
              placeholder="https://exemplo.com/foto.jpg" 
              value={imagem}
              onChange={(e) => setImagem(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <Button 
              typeBtn="button" 
              btnFunction={onClose} 
              btnText="Cancelar" 
              variant="White" 
            />
            <Button 
              typeBtn="submit" 
              btnText={isLoading ? "Salvando..." : "Salvar"} 
              variant="Orange" 
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
