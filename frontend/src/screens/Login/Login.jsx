import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./login.css";
import pbxLogo from "../../assets/logo/1211 Sem Título_20260220094915.png";
import Button from "../../components/Button/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, senha: senha })
      });

      if (response.ok) {
        const userData = await response.json();
        // Login aprovado pelo backend
        login({ email: userData.email, name: userData.nome });
        navigate("/main");
      } else if (response.status === 401) {
        toast.error("Usuário ou senha inválidos!");
      } else {
        toast.error("Erro interno do servidor.");
      }
    } catch (err) {
      console.error("Erro ao autenticar:", err);
      toast.error("Falha ao comunicar com o servidor.");
    }
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="logo">
        <img className="pbx-logo" src={pbxLogo} alt="" />
      </div>

      <div className="card">
        <div className="login-form">
          <label>Nome de usuário ou email</label>
          <input
            type="text"
            name="username"
            placeholder="admin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Senha</label>
          <div className="password-field">
            <input
              type="password"
              name="password"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <Button typeBtn="button" btnFunction={handleLogin} btnText={"Entrar"} variant={"Orange"}/>
        </div>
      </div>

      <p className="forgot">Esqueceu sua senha?</p>
    </div>
  );
}
