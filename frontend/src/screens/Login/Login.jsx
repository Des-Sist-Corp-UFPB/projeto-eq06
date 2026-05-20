import { useState } from "react";
import "./login.css";
import pbxLogo from "../../assets/logo/1211 Sem Título_20260220094915.png";
import Button from "../../components/Button/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <div className="container">
      <div className="logo">
        <img className="pbx-logo" src={pbxLogo} alt="" />
      </div>

      <div className="card">
        <form method="post" action="/login">
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

          <Button typeBtn="submit" btnText={"Entrar"} variant={"Orange"}/>
        </form>
      </div>

      <p className="forgot">Esqueceu sua senha?</p>
    </div>
  );
}
