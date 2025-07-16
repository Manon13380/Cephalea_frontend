import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { FaUserCircle, FaBirthdayCake, FaEnvelope, FaUserMd } from 'react-icons/fa';
import api from '../api/axios';
import PrivateLayout from '../components/PrivateLayout';


const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                setLoading(false);
                setError('Aucun token trouvé.');
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;

                const response = await api.get(`/user/${userId}`);
                setUser(response.data);
                console.log("user", response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des données utilisateur:', err);
                setError('Impossible de charger les informations de l\'utilisateur.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <PrivateLayout>
            <div className="text-white p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Mon Profil</h1>
            {loading && <p className="text-center">Chargement des informations...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {user && (
                <div className="bg-gray-800 bg-opacity-50 rounded-lg shadow-lg p-8 max-w-lg mx-auto">
                    <div className="flex flex-col items-center mb-6">
                        <FaUserCircle className="text-6xl text-teal-400 mb-4" />
                        <h2 className="text-3xl font-bold">{user.firstName} {user.name}</h2>
                        <p className="text-gray-400 flex items-center mt-2">
                            <FaEnvelope className="mr-2" /> {user.email}
                        </p>
                    </div>
                    <div className="border-t border-gray-700 my-6"></div>
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <FaBirthdayCake size={20} className="text-teal-400 mr-4" />
                            <div>
                                <p className="text-gray-400 text-sm">Date de naissance</p>
                                <p className="text-lg">{new Date(user.birthDate).toLocaleDateString('fr-FR')}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <FaUserMd size={20} className="text-teal-400 mr-4" />
                            <div>
                                <p className="text-gray-400 text-sm">Médecin traitant</p>
                                <p className="text-lg">{user.doctor}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <FaUserMd size={20} className="text-teal-400 mr-4" />
                            <div>
                                <p className="text-gray-400 text-sm">Neurologue</p>
                                <p className="text-lg">{user.neurologist}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </PrivateLayout>
    );
};

export default ProfilePage;
