import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoCephalea from '../assets/images/Logo_cephalea.png';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import InputField from "../components/InputField";
import Button from "../components/Button";
import api from "../api/axios";
import toastr from "toastr";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const Authentication = async(e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      sessionStorage.setItem("token", response.data);
      sessionStorage.setItem('justConnected', 'true');
      navigate("/home");

  
    } catch (error) {
      if (error.response) {
        // Erreur de l'API (4xx ou 5xx)
        console.error("Erreur API :", error.response.data);
        if (error.response.status === 401) {
          // Erreur de mauvais identifiants
          toastr.error("Nom d'utilisateur ou mot de passe incorrect.");
        } else {
          toastr.error("Une erreur est survenue. Veuillez réessayer.");
        }
      } else if (error.request) {
        // Pas de réponse
        console.error("Pas de réponse du serveur :", error.request);
      } else {
        // Autre erreur
        console.error("Erreur :", error.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-[#368A7B] to-black flex flex-col items-center p-6">
      <div className="w-[90%] max-w-[320px] mt-8">
        <div className="flex justify-center mb-8">
          <img src={LogoCephalea} alt="Céphaléa" className="h-25" />
        </div>

        <h2 className="text-white text-xl mb-6 text-center">Se connecter</h2>

        <form onSubmit={Authentication} className="space-y-4">
          <div className="space-y-3">
            <InputField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
            />
            <div className="relative">
              <InputField
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="mot de passe"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white bg-transparent border-none outline-none focus:outline-none"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4 stroke-[2]" />
                ) : (
                  <EyeIcon className="h-4 w-4 stroke-[2]" />
                )}
              </button>
            </div>
          </div>

          <div className="text-center">
            <Link to="/forgot-password" className="text-white/80 text-sm hover:text-white">
              mot de passe oublié ?
            </Link>
          </div>

          <Button
            type="submit"
          >
            Connexion
          </Button>

          <div className="text-center text-white/80 text-sm mt-8">
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] bg-white/30 flex-1"></div>
              <div>
                <p>Vous n'avez pas de compte?</p>
                <a href="/register" className="hover:text-white block mt-1">
                  Inscrivez-vous
                </a>
              </div>
              <div className="h-[1px] bg-white/30 flex-1"></div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
