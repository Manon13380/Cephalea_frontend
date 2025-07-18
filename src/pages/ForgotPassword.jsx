import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toastr from 'toastr';
import useApi from '../hooks/useApi';
import LogoCephalea from '../assets/images/Logo_cephalea.png';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const { loading, post } = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toastr.error('Veuillez saisir votre adresse e-mail.');
            return;
        }

        try {
            // Endpoint à confirmer côté backend
            await post('/auth/forgot-password', { email });
            toastr.success('Si un compte est associé à cet e-mail, un lien de réinitialisation a été envoyé.');
            setEmail('');
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
                    <h2 className="text-white text-xl mb-6 text-center">Mot de passe oublié</h2>
                    <p className="text-center text-gray-300 mb-6">Saisissez votre e-mail pour recevoir un lien de réinitialisation.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Adresse e-mail</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 mt-1 text-white bg-white/20 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-2 font-bold text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                            >
                                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                            </button>
                        </div>
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

export default ForgotPassword;
