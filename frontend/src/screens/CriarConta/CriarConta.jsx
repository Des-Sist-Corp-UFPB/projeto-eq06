import React, { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CriarConta.css';
import pbxLogo from "../../assets/logo/1211 Sem Título_20260220094915.png";
import Button from '../../components/Button/Button';

const CriarConta = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    const novoUsuario = {
      nome: nome,
      email: email,
      cpf: cpf,
      senha: senha
    };

    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoUsuario)
      });

      if (response.ok) {
        alert("Conta criada com sucesso!");
        navigate("/login");
      } else if (response.status === 400) {
        const erroMsg = await response.text();
        alert(erroMsg || "Verifique os dados preenchidos.");
      } else {
        alert("Erro no servidor. Tente novamente mais tarde.");
      }
    } catch (err) {
      console.error("Erro ao criar conta:", err);
      alert("Falha ao comunicar com o servidor.");
    }
  };

  return (
    <div className="container-pagina">
      <main className="wrapper-conteudo">
        <div className="card-registro">
          <div className="logo-container">
            <img className="pbx-logo" src={pbxLogo} alt="Logo" />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grupo">
              <label className="label-input">Nome completo</label>
              <input 
                type="text" 
                required
                placeholder="fulano de tal" 
                className="input-field" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="form-grupo">
              <label className="label-input">Endereço de email</label>
              <input 
                type="email" 
                required
                placeholder="email@gmail.com" 
                className="input-field" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-grupo">
              <label className="label-input">CPF</label>
              <input 
                type="text" 
                required
                placeholder="000.000.000-00" 
                className="input-field" 
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>

            <div className="form-grupo">
              <label className="label-input">Senha</label>
              <div className="input-senha-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="********" 
                  className="input-field" 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <button 
                  type="button" 
                  className="btn-toggle-senha"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <div className="form-grupo">
              <label className="label-input">Confirme a senha</label>
              <div className="input-senha-wrapper">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required
                  placeholder="********" 
                  className="input-field" 
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
                <button 
                  type="button" 
                  className="btn-toggle-senha"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <div className="container-btn-submit">
              <Button typeBtn="submit" btnText={"Criar conta"} variant={"Orange"}/>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CriarConta;
