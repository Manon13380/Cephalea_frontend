import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PrivateLayout from '../components/PrivateLayout';
import api from "../api/axios";
import toastr from 'toastr';

const CrisisDetails = () => {
    const [crisis, setCrisis] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const fetchCrisisDetails = async () => {
            try {
                const response = await api.get(`/crisis/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setCrisis(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des détails de la crise :", error);
                toastr.error("Une erreur est survenue lors de la récupération des détails de la crise");
                navigate('/crises');
            }
        };

        fetchCrisisDetails();
    }, [id, token, navigate]);

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

    if (!crisis) {
        return (
            <PrivateLayout>
                <div className="w-full max-w-4xl mx-auto py-8">
                    <div className="text-white text-center">Chargement...</div>
                </div>
            </PrivateLayout>
        );
    }

    return (
        <PrivateLayout>
            <div className="w-full max-w-4xl mx-auto py-8 px-4">
                <div className="flex justify-center sm:justify-start mb-6">
                    <button 
                        onClick={() => navigate('/crisis-list')}
                        className="text-white/60 hover:text-white flex items-center space-x-2 transition-colors px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Retour à la liste</span>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Header avec l'intensité actuelle */}
                    <div className="bg-white/5 rounded-lg p-6">
                        <div className="flex flex-col items-center sm:items-start sm:flex-row sm:justify-between gap-4">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                <div className={`h-20 w-20 rounded-full ${getIntensityColor([...crisis.intensities].sort((a, b) => new Date(a.date) - new Date(b.date))[0].number)} flex items-center justify-center flex-shrink-0`}>
                                    <span className="text-3xl font-bold text-white">
                                    {[...crisis.intensities].sort((a, b) => new Date(a.date) - new Date(b.date))[0].number}
                                    </span>
                                </div>
                                <div className="text-center sm:text-left">
                                    <h1 className="text-2xl font-bold text-white">Crise du {formatDate(crisis.startDate)}</h1>
                                    <p className="text-white/60">
                                        {crisis.endDate ? `Terminée le ${formatDate(crisis.endDate)}` : "En cours"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-center sm:justify-end gap-4 w-full sm:w-auto">
                                {crisis.crisisMedication?.length > 0 && (
                                    <div className="px-4 py-2 bg-teal-500/20 rounded-full whitespace-nowrap">
                                        <span className="text-teal-300">Médicaments pris</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Grille d'informations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Évolution de l'intensité */}
                        <div className="bg-white/5 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5M8 8v8m-4-5v5M4 12h16" />
                                </svg>
                                Évolution de l'intensité
                            </h2>
                            <div className="space-y-3">
                                {crisis.intensities && crisis.intensities.length > 0 ? (
                                    <>
                                        {[...crisis.intensities]
                                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                                        .map((intensity, index) => (
                                        <div key={intensity.id} 
                                                className={`flex items-center justify-between p-3 rounded-lg ${getIntensityColor(intensity.number)}/10`}
                                        >
                                            <span className="text-white">{formatDate(intensity.date)}</span>
                                            <span className="text-white font-bold">{intensity.number}/10</span>
                                        </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="text-white/60 text-center py-4">
                                        Aucune évolution d'intensité enregistrée
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Soulagement */}
                        <div className="bg-white/5 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Soulagement
                            </h2>
                            <div className={`p-3 rounded-lg  'bg-green-500/10'  'bg-white/5'`}>
                            {crisis.soulagements && crisis.soulagements.length > 0 ? (
                                    crisis.soulagements.map((soulagement, index) => (
                                        <div key={index} className="bg-white/10 p-3 rounded-lg">
                                            <span className="text-white">{soulagement.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-white/60 text-center py-4 col-span-2">
                                        Aucun soulagement enregistré
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Médicaments */}
                        <div className="bg-white/5 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                Médicaments pris
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 justify-items-center sm:justify-items-stretch">
                                {crisis.crisisMedication && crisis.crisisMedication.length > 0 ? (
                                    crisis.crisisMedication.map((med, index) => (
                                        <div key={index} className="bg-white/10 p-3 rounded-lg">
                                            <span className="text-white">{med.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-white/60 text-center py-4 col-span-2">
                                        Aucun médicament pris
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Activités impactées */}
                        <div className="bg-white/5 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Activités impactées
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {crisis.activities && crisis.activities.length > 0 ? (
                                    crisis.activities.map((activity, index) => (
                                        <div key={index} className="bg-white/10 p-3 rounded-lg">
                                            <span className="text-white">{activity}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-white/60 text-center py-4 col-span-2">
                                        Aucune activité impactée
                                    </div>
                                )}
                            </div>
                        </div>

                            {/* Déclencheurs */}
                            <div className="bg-white/5 rounded-lg p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Déclencheurs
                                </h2>
                            <div className="space-y-2">
                                    {crisis.triggers && crisis.triggers.length > 0 ? (
                                        crisis.triggers.map((trigger, index) => (
                                            <div key={index} className="bg-white/10 p-3 rounded-lg">
                                                <span className="text-white">{trigger}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-white/60 text-center py-4">
                                            Aucun déclencheur identifié
                                        </div>
                                    )}
                                </div>
                            </div>
                    </div>

                            {/* Commentaire */}
                            <div className="bg-white/5 rounded-lg p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    Commentaire
                                </h2>
                        <div className="bg-white/10 p-4 rounded-lg">
                                    {crisis.comment ? (
                                        <p className="text-white whitespace-pre-wrap">{crisis.comment}</p>
                                    ) : (
                                        <p className="text-white/60 text-center">Aucun commentaire</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
        </PrivateLayout>
    );
};

export default CrisisDetails;
