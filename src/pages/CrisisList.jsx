import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PrivateLayout from '../components/PrivateLayout';
import api from "../api/axios";
import toastr from 'toastr';
import { useApi } from '../hooks/useApi';

const CrisisList = () => {
    const [crises, setCrises] = useState([]);
    const { loading, error, get } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCrises = async () => {
            try {
                const response = await get('/crisis');
                const sortedCrises = response.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
                setCrises(sortedCrises);
            } catch (error) {
                console.error("Erreur lors de la récupération des crises :", error);
                toastr.error("Une erreur est survenue lors de la récupération des crises");
            }
        };

        fetchCrises();
    }, [get]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getIntensityColor = (intensity) => {
        if (intensity <= 3) return 'bg-teal-500';
        if (intensity <= 6) return 'bg-orange-500';
        return 'bg-red-500';
    };

     if (loading) {
            return (
                <PrivateLayout>
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                </PrivateLayout>
            );
        }
    

    return (
        <PrivateLayout>
            <div className="w-full max-w-4xl mx-auto py-8">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">Historique des crises</h1>

                <div className="space-y-4">
                    {crises.length === 0 ? (
                        <p className="text-white/60 text-center">Aucune crise enregistrée</p>
                    ) : (
                        crises.map((crise, index) => (
                            <div
                                key={index}
                                className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors cursor-pointer"
                                onClick={() => navigate(`/crisis/${crise.id}`)}
                            >
                                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                                    <div className={`h-16 w-16 rounded-full ${getIntensityColor([...crise.intensities].sort((a, b) => new Date(a.date) - new Date(b.date))[0].number)} flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0`}>
                                        {
                                            crise.intensities && crise.intensities.length > 0 && (
                                                <span className="text-2xl font-bold text-white">
                                                    {[...crise.intensities].sort((a, b) => new Date(a.date) - new Date(b.date))[0].number}
                                                </span>
                                            )
                                        }
                                    </div>
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-3">
                                            <p className="text-white text-lg font-medium">
                                                {formatDate(crise.startDate)}
                                            </p>
                                            {crise.intensities && crise.intensities.length > 0 && (
                                                <p className="text-white/60 text-sm mt-1 sm:mt-0">
                                                    Intensité : {[...crise.intensities].sort((a, b) => new Date(a.date) - new Date(b.date))[0].number}/10
                                                </p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-8 sm:gap-y-2 text-sm">
                                            <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
                                                <span className="text-white/60">Médicaments :</span>
                                                <span className="text-white font-medium">{crise.crisisMedications && crise.crisisMedications.length > 0 ? 'Oui' : 'Non'}</span>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
                                                <span className="text-white/60">Soulagement :</span>
                                                <span className="text-white font-medium">{crise.relief ? 'Oui' : 'Non'}</span>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
                                                <span className="text-white/60">Activités impactées :</span>
                                                <span className="text-white font-medium">{crise.impactedActivities && crise.impactedActivities.length > 0 ? 'Oui' : 'Non'}</span>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
                                                <span className="text-white/60">Déclencheurs définis :</span>
                                                <span className="text-white font-medium">{crise.triggers && crise.triggers.length > 0 ? 'Oui' : 'Non'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PrivateLayout>
    );
};

export default CrisisList;
