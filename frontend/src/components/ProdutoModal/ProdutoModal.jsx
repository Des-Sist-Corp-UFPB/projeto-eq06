import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import Button from "../Button/Button";
import "./ProdutoModal.css";

export default function ProdutoModal({ onClose, onProductCreated }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagemFile, setImagemFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !preco) {
      toast.warning("Nome e preço são obrigatórios.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("produto", new Blob([JSON.stringify({
        nome: nome,
        descricao: descricao,
        preco: parseFloat(preco)
      })], { type: "application/json" }));
      
      if (imagemFile) {
        formData.append("imagem", imagemFile);
      }

      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 
            // Omitindo Content-Type para o navegador setar multipart/form-data corretamente
            'X-User-Email': user?.email || 'anonymous'
        },
        body: formData
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
            <label>Imagem do Produto (Opcional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setImagemFile(e.target.files[0])}
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
