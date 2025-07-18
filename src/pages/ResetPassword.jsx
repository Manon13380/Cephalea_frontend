import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toastr from 'toastr';
import useApi from '../hooks/useApi';
import LogoCephalea from '../assets/images/Logo_cephalea.png';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import InputField from '../components/InputField';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loading, post } = useApi();

    const [token, setToken] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            toastr.error('Token de réinitialisation manquant ou invalide.');
            navigate('/'); // Redirige si pas de token
        }
    }, [searchParams, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toastr.error('Les mots de passe ne correspondent pas.');
            return;
        }
        if (!newPassword) {
            toastr.error('Veuillez saisir un nouveau mot de passe.');
            return;
        }

        try {
            await post('/auth/reset-password', { token, newPassword, confirmPassword });
            toastr.success('Votre mot de passe a été réinitialisé avec succès.');
            navigate('/'); // Redirige vers la page de connexion
        } catch (err) {
            toastr.error(err.response?.data?.message || 'Une erreur est survenue.');
        }
    };

    return (
        <div className="h-screen w-screen bg-gradient-to-b from-[#368A7B] to-black flex flex-col items-center p-6">
            <div className="w-[90%] max-w-[320px] mt-8">
                <div className="flex justify-center mb-8">
                    <img src={LogoCephalea} alt="Céphaléa" className="h-25" />
                </div>
                <h2 className="text-white text-xl mb-6 text-center">Réinitialiser le mot de passe</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Nouveau mot de passe</label>
                        <div className="relative">
                            <InputField
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white bg-transparent border-none outline-none focus:outline-none"
                            >
                               {showNewPassword ? (
                                                 <EyeSlashIcon className="h-4 w-4 stroke-[2]" />
                                               ) : (
                                                 <EyeIcon className="h-4 w-4 stroke-[2]" />
                                               )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Confirmer le mot de passe</label>
                        <div className="relative">
                            <InputField
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                             <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 font-bold text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                    >
                        {loading ? 'Enregistrement...' : 'Réinitialiser'}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <Link to="/" className="text-white/80 text-sm hover:text-white">
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
