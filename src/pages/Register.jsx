import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoCephalea from '../assets/images/Logo_cephalea.png';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import InputField from "../components/InputField";
import Button from "../components/Button";
import api from "../api/axios";
import toastr from "toastr";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    birthDate: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toastr.error("Les mots de passe ne correspondent pas.");
      return;
    }

    // Vérification du format du mot de passe
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%&*-]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toastr.error("Le mot de passe ne respecte pas les critères requis.");
      return;
    }

    const formatDate = (dateStr) => {
      const [year, month, day] = dateStr.split("-");
      return `${day}-${month}-${year}`;
    };

    try {
      console.log("Inscription en cours...");
      const response = await api.post("/auth/signup", {
        name: formData.name,
        firstName: formData.firstName,
        birthDate: formatDate(formData.birthDate),
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      console.log("Inscription réussie :", response.data);
      toastr.success("Inscription réussie !");
      navigate("/");

    } catch (error) {
      if (error.response) {
        console.error("Erreur API :", error.response.data);
        if (error.response.status === 409) {
          // Si l'erreur est un 409, cela signifie qu'il y a un conflit (par exemple, email déjà existant)
          toastr.error("L'email est déjà utilisé. Veuillez en choisir un autre.", "Erreur d'inscription", {
            timeOut: 5000, // Le message sera affiché pendant 5 secondes
          }); } else {
            // Autres erreurs (par exemple 400, 500, etc.)
            console.error("Erreur API :", error.response.data);
            toastr.error("Une erreur s'est produite. Veuillez réessayer.", "Erreur", {
              timeOut: 5000,
            });}
      } else {
        console.error("Erreur :", error.message);
        toastr.error("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-[#368A7B] to-black flex flex-col items-center p-6 overflow-y-auto">
      <div className="w-[90%] max-w-[320px] my-4">
        <div className="flex justify-center mb-4">
          <img src={LogoCephalea} alt="Céphaléa" className="h-16" />
        </div>

        <h2 className="text-white text-xl mb-4 text-center">Inscription</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <InputField
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nom*"
              required
            />
            <InputField
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Prénom*"
              required
            />
            <InputField
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              placeholder="Date de naissance*"
              required
            />
            <InputField
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email*"
              required
            />
            <div className="relative">
              <InputField
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mot de passe*"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white bg-transparent border-none outline-none focus:outline-none"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4 stroke-[2]" />
                ) : (
                  <EyeIcon className="h-4 w-4 stroke-[2]" />
                )}
              </button>
            </div>
            <div className="relative">
              <InputField
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmation du mot de passe*"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white bg-transparent border-none outline-none focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-4 w-4 stroke-[2]" />
                ) : (
                  <EyeIcon className="h-4 w-4 stroke-[2]" />
                )}
              </button>
            </div>
          </div>

          <div className="text-white/80 text-xs flex flex-col items-center mt-2">
            <p className="mb-1">Le mot de passe doit contenir :</p>
            <ul className="list-none text-center space-y-0.5">
              <li>8 caractères minimum</li>
              <li>1 Majuscule</li>
              <li>1 Minuscule</li>
              <li>1 caractère spécial # ? ! @ $ %  & / *-</li>
            </ul>
          </div>

          <Button type="submit" className="mt-3">
            Valider
          </Button>

          <div className="text-center text-white/80 text-sm mt-8">
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] bg-white/30 flex-1"></div>
              <div>
                <p>Vous avez un compte?</p>
                <a href="/" className="hover:text-white block mt-1">
                  Connectez-vous
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

export default Register;
