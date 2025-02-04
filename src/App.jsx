import React, { useState } from "react";
import axios from "axios";
import HomePage from "./components/HomePage";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      // Realizar la solicitud al servidor para validar las credenciales
      const response = await axios.post("https://farmacia-virtual.onrender.com/api/login", {
        email,
        password,
      });

      if (response.status === 200) {
        onLogin();
      }
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#f7f7f7]">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold border-b-2 border-[#821e30] text-center text-[#821e30] mb-6">Iniciar Sesión</h2>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2 text-lg">Ingresa tu usuario</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-500 rounded-md p-3 text-gray-700 focus:ring-[#821e30] focus:border-[#821e30] transition duration-200 ease-in-out"
            placeholder="Ingresa tu correo electrónico"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2 text-lg">Clave de Acceso</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-500 rounded-md p-3 text-gray-700 focus:ring-[#821e30] focus:border-[#821e30] transition duration-200 ease-in-out"
            placeholder="Ingresa tu clave"
          />
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-[#821e30] text-white px-6 py-3 rounded-lg hover:bg-[#a72b35] focus:outline-none focus:ring-2 focus:ring-[#821e30] focus:ring-opacity-50 transition duration-200"
        >
          Acceder
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <div>
      {isAuthenticated ? <HomePage /> : <Login onLogin={handleLogin} />}
    </div>
  );
};

export default App;
