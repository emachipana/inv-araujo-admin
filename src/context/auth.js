import { createContext, useContext, useEffect, useState } from "react";
import apiFetch from "../services/apiFetch";
import { TOKEN_NAME } from "../config";
import toast from "react-hot-toast";
import { errorParser } from "../helpers/errorParser";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem(TOKEN_NAME);
        if(!token) return setIsLoading(false);

        const user = await apiFetch("users/profile/info");
        setUser(user.data);
        setIsLoading(false);
      }catch(error) {
        const message = error.message;
        if(message.toLowerCase().includes("token expirado")) localStorage.removeItem(TOKEN_NAME);
        setIsLoading(false);
        if(message) setTimeout(() => toast.error(errorParser(message)), 500);
      }
    }

    fetch();
  }, []);

  const login = async (credentials, origin) => {
    const response = await apiFetch("auth/login", { body: credentials })
    const { token, user } = response.data;
    if(origin === "admin" && user.role !== "ADMINISTRADOR") throw new Error("No tienes los permisos necesarios");
    localStorage.setItem(TOKEN_NAME, token);
    setUser(user);

    return user;
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_NAME);
    setUser(null);
  }

  const updateUser = async (id, body) => {
    const updatedUser = await apiFetch(`users/${id}`, { body, method: "PUT" });
    setUser(updatedUser.data);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        setUser,
        setIsLoading,
        login,
        logout,
        updateUser
      }}
    >
      { children }
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
