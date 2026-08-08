import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Seed um usuário padrão para teste se a lista estiver vazia
    const users = localStorage.getItem("users_list");
    if (!users) {
      const defaultUsers = [
        {
          name: "Administrador",
          email: "admin@gmail.com",
          cpf: "000.000.000-00",
          password: "admin"
        }
      ];
      localStorage.setItem("users_list", JSON.stringify(defaultUsers));
    }

    const savedUser = localStorage.getItem("user_logged");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user_logged", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user_logged");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
