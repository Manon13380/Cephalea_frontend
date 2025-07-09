import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PrivateLayout from '../components/PrivateLayout';
import api from "../api/axios";
import { useApi } from '../hooks/useApi';
import TerminateCrisisDialog from '../components/TerminateCrisisDialog';
import IntensityDialog from '../components/IntensityDialog.jsx';
import DeleteDialog from '../components/DeleteDialog';
import { ReliefDialog } from '../components/ReliefDialog';
import { ActivityDialog } from '../components/ActivityDialog';
import toastr from 'toastr';
import { FiCheckSquare, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

const CrisisDetails = () => {
    const [isReliefDialogOpen, setIsReliefDialogOpen] = useState(false);
    // ...
    const [crisis, setCrisis] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);

    const { get, post, update, remove, loading: apiLoading, error: apiError } = useApi();

    const [isAddIntensityModalOpen, setIsAddIntensityModalOpen] = useState(false);
    const [isEditIntensityModalOpen, setIsEditIntensityModalOpen] = useState(false);
    const [isDeleteIntensityModalOpen, setIsDeleteIntensityModalOpen] = useState(false);
    const [selectedIntensity, setSelectedIntensity] = useState(null);

    const [isDeleteReliefModalOpen, setIsDeleteReliefModalOpen] = useState(false);
        const [selectedRelief, setSelectedRelief] = useState(null);

    const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [isDeleteActivityModalOpen, setIsDeleteActivityModalOpen] = useState(false);

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

    const handleOpenTerminateModal = () => {
        setIsTerminateModalOpen(true);
    };

    const handleTerminateCrisis = async (endDate) => {
        if (!endDate) {
            toastr.error('Veuillez sélectionner une date de fin.');
            return;
        }
        try {
            const updatedCrisis = await update(`/crisis/${id}`, { endDate });
            setCrisis(prevCrisis => ({ ...prevCrisis, endDate: updatedCrisis.endDate }));
            setIsTerminateModalOpen(false);
            toastr.success('Crise terminée avec succès !');
        } catch (error) {
            console.error("Erreur lors de la terminaison de la crise:", error);
            toastr.error(updateError || 'Erreur lors de la mise à jour de la crise.');
        }
    };

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

    const handleAddIntensity = async (newIntensity) => {
        try {
            const result = await post(`/intensities?id=${id}`, newIntensity);
            setCrisis(prev => ({ ...prev, intensities: [...prev.intensities, result] }));
            toastr.success('Intensité ajoutée avec succès.');
            setIsAddIntensityModalOpen(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'intensité:", error);
            toastr.error(apiError || "Erreur lors de l'ajout de l'intensité.");
        }
    };

    const handleEditIntensity = async (updatedIntensity) => {
        try {
            const result = await update(`/intensities/${selectedIntensity.id}`, updatedIntensity);
            setCrisis(prev => ({
                ...prev,
                intensities: prev.intensities.map(i => i.id === selectedIntensity.id ? result : i)
            }));
            toastr.success('Intensité modifiée avec succès.');
            setIsEditIntensityModalOpen(false);
            setSelectedIntensity(null);
        } catch (error) {
            console.error("Erreur lors de la modification de l'intensité:", error);
            toastr.error(apiError || "Erreur lors de la modification de l'intensité.");
        }
    };

    const handleDeleteIntensity = async () => {
        try {
            await remove(`/intensities/${selectedIntensity.id}`);
            setCrisis(prev => ({
                ...prev,
                intensities: prev.intensities.filter(i => i.id !== selectedIntensity.id)
            }));
            toastr.success('Intensité supprimée avec succès.');
            setIsDeleteIntensityModalOpen(false);
            setSelectedIntensity(null);
        } catch (error) {
            console.error("Erreur lors de la suppression de l'intensité:", error);
            toastr.error(apiError || "Erreur lors de la suppression de l'intensité.");
        }
    };

    const handleDeleteRelief = async () => {
        if (!selectedRelief) return;
        try {
            await remove(`/crisis/${id}/soulagements/${selectedRelief.id}`);
            setCrisis(prev => ({
                ...
                prev,
                soulagements: prev.soulagements.filter(s => s.id !== selectedRelief.id)
            }));
            toastr.success('Soulagement supprimé avec succès.');
            setIsDeleteReliefModalOpen(false);
            setSelectedRelief(null);
        } catch (error) {
            console.error("Erreur lors de la suppression du soulagement:", error);
            toastr.error("Erreur lors de la suppression du soulagement.");
        }
    };

    const handleSaveRelief = async (reliefData) => {
        try {
            const newSoulagement = await post(`/crisis/${id}/soulagements/${reliefData.reliefId}`);
            setCrisis(prevCrisis => ({
                ...prevCrisis,
                soulagements: [...prevCrisis.soulagements, newSoulagement]
            }));
            toastr.success('Soulagement ajouté avec succès.');
            setIsReliefDialogOpen(false);
        } catch (error) {
            toastr.error("Erreur lors de l'ajout du soulagement.");
                        console.error("Erreur lors de l'ajout du soulagement:", error);
        }
    };

    const handleSaveActivity = async (activityData) => {
        try {
            const newActivity = await post(`/crisis/${id}/activities/${activityData.activityId}`);
            setCrisis(prevCrisis => ({
                ...prevCrisis,
                activities: [...prevCrisis.activities, newActivity]
            }));
            toastr.success('Activité ajoutée avec succès.');
            setIsActivityDialogOpen(false);
        } catch (error) {
            toastr.error("Erreur lors de l'ajout de l'activité.");
            console.error("Erreur lors de l'ajout de l'activité:", error);
        }
    };

    const handleDeleteActivity = async () => {
        if (!selectedActivity) return;
        try {
            await remove(`/crisis/${id}/activities/${selectedActivity.id}`);
            setCrisis(prev => ({ ...prev, activities: prev.activities.filter(a => a.id !== selectedActivity.id) }));
            toastr.success('Activité supprimée avec succès.');
            setIsDeleteActivityModalOpen(false);
            setSelectedActivity(null);
        } catch (error) {
            console.error("Erreur lors de la suppression de l'activité:", error);
            toastr.error("Erreur lors de la suppression de l'activité.");
        }
    };

    if (!crisis) {
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
                                    <p className={crisis.endDate ? "text-white/60" : "text-yellow-400 font-semibold"}>
                                        {crisis.endDate ? `Terminée le ${formatDate(crisis.endDate)}` : "En cours"}
                                        {crisis.endDate ? (
                                            <></>
                                        ) : (
                                            <button
                                                onClick={handleOpenTerminateModal}
                                                className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 ml-3"
                                                title="Terminer cette crise"
                                            >
                                                <FiCheckSquare className="w-5 h-5 text-white/70 hover:text-white" />
                                            </button>
                                        )}
                                        
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 rounded-lg p-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center order-2 sm:order-1 mb-2">
                                    <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5M8 8v8m-4-5v5M4 12h16" />
                                    </svg>
                                    Évolution de l'intensité
                                </h2>
                                <button 
                                    onClick={() => setIsAddIntensityModalOpen(true)}
                                    className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 order-1 sm:order-2 self-end sm:self-center mt-0 mb-2 sm:mb-0"
                                    title="Ajouter une mesure d'intensité"
                                >
                                    <FiPlus className="w-5 h-5 text-white/70 hover:text-white" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {crisis.intensities && crisis.intensities.length > 0 ? (
                                    <>
                                        {[...crisis.intensities]
                                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                                            .map((intensity, index) => (
                                                <div key={intensity.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-white/5`}>
                                                    <div className='flex items-center gap-x-4'>
                                                        <div className={`w-10 h-10 rounded-full ${getIntensityColor(intensity.number)} flex items-center justify-center flex-shrink-0`}>
                                                            <span className="text-white font-bold text-lg">{intensity.number}</span>
                                                        </div>
                                                        <span className="text-white">{formatDate(intensity.date)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-x-3 mt-2 sm:mt-0 sm:justify-start">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedIntensity(intensity);
                                                                setIsEditIntensityModalOpen(true);
                                                            }}
                                                            className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110"
                                                            title="Modifier"
                                                        >
                                                            <FiEdit className="w-4 h-4 text-white/70 group-hover:text-white" />
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedIntensity(intensity);
                                                                setIsDeleteIntensityModalOpen(true);
                                                            }}
                                                            className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110"
                                                            title="Supprimer"
                                                        >
                                                            <FiTrash2 className="w-4 h-4 text-white/70 group-hover:text-white" />
                                                        </button>
                                                    </div>
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
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center order-2 sm:order-1 mb-2">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Soulagements
                                </h2>
                                <button
    onClick={() => setIsReliefDialogOpen(true)}
    className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 order-1 sm:order-2 self-end sm:self-center mt-0 mb-2 sm:mb-0"
    title="Ajouter un soulagement"
>
    <svg className="w-5 h-5 text-white/70 hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
    </svg>
</button>
                            </div>
                            <div className="space-y-3">
                                {crisis.soulagements && crisis.soulagements.length > 0 ? (
                                    crisis.soulagements.map((soulagement) => (
                                        <div key={soulagement.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                            <span className="text-white">{soulagement.name}</span>
                                            <button 
                                                onClick={() => {
                                                    setSelectedRelief(soulagement);
                                                    setIsDeleteReliefModalOpen(true);
                                                }}
                                                className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110"
                                                title="Supprimer"
                                            >
                                                <FiTrash2 className="w-4 h-4 text-white/70 group-hover:text-white" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-white/60 text-center py-4">
                                        Aucun soulagement enregistré
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Médicaments */}
                        <div className="bg-white/5 rounded-lg p-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center order-2 sm:order-1 mb-2">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                                    </svg>
                                    Médicaments pris
                                </h2>
                                <button className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 order-1 sm:order-2 self-end sm:self-center mt-0 mb-2 sm:mb-0" title="Ajouter un médicament">
                                    <svg className="w-5 h-5 text-white/70 hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                </button>
                            </div>
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
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center order-2 sm:order-1 mb-2">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Activités impactées
                                </h2>
                                <button onClick={() => setIsActivityDialogOpen(true)} className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 order-1 sm:order-2 self-end sm:self-center mt-0 mb-2 sm:mb-0" title="Ajouter une activité">
                                    <FiPlus className="w-5 h-5 text-white/70 hover:text-white" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {crisis.activities && crisis.activities.length > 0 ? (
                                    crisis.activities.map((activity) => (
                                        <div key={activity.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                            <span className="text-white">{activity.name}</span>
                                            <button
                                                onClick={() => { setSelectedActivity(activity); setIsDeleteActivityModalOpen(true); }}
                                                className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110"
                                                title="Supprimer"
                                            >
                                                <FiTrash2 className="w-4 h-4 text-white/70 group-hover:text-white" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-white/60 text-center py-4">
                                        Aucune activité impactée
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Déclencheurs */}
                        <div className="bg-white/5 rounded-lg p-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center order-2 sm:order-1 mb-2">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                    Déclencheurs
                                </h2>
                                <button className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 order-1 sm:order-2 self-end sm:self-center mt-0 mb-2 sm:mb-0" title="Ajouter un déclencheur">
                                    <svg className="w-5 h-5 text-white/70 hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                </button>
                            </div>
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
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center order-2 sm:order-1 mb-2">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                                </svg>
                                Commentaire
                            </h2>
                            <button className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 order-1 sm:order-2 self-end sm:self-center mt-0 mb-2 sm:mb-0" title="Modifier le commentaire">
                                <svg className="w-5 h-5 text-white/70 hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path>
                                </svg>
                            </button>
                        </div>
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
            {/* MODALES */}
            {crisis && (
                <>
                    <TerminateCrisisDialog
                        isOpen={isTerminateModalOpen}
                        onClose={() => setIsTerminateModalOpen(false)}
                        onTerminate={handleTerminateCrisis}
                        crisisId={id}
                        crisisStartDate={crisis.startDate}
                    />
                    <ReliefDialog
                        isOpen={isReliefDialogOpen}
                        onClose={() => setIsReliefDialogOpen(false)}
                        onSave={handleSaveRelief}
                        crisisId={id}
                    />
                    <DeleteDialog
                        isOpen={isDeleteReliefModalOpen}
                        onClose={() => setIsDeleteReliefModalOpen(false)}
                        onConfirm={handleDeleteRelief}
                        title="Supprimer le soulagement"
                                                message={`Êtes-vous sûr de vouloir supprimer le soulagement "${selectedRelief?.name}" ?`}
                    />

                    <ActivityDialog
                        isOpen={isActivityDialogOpen}
                        onClose={() => setIsActivityDialogOpen(false)}
                        onSave={handleSaveActivity}
                        crisisId={id}
                    />

                    <DeleteDialog
                        isOpen={isDeleteActivityModalOpen}
                        onClose={() => setIsDeleteActivityModalOpen(false)}
                        onConfirm={handleDeleteActivity}
                        title="Supprimer l'activité"
                        message={`Êtes-vous sûr de vouloir supprimer l'activité "${selectedActivity?.name}" ?`}
                    />
                    {isAddIntensityModalOpen && (
                        <IntensityDialog
                            isOpen={isAddIntensityModalOpen}
                            onClose={() => setIsAddIntensityModalOpen(false)}
                            onSubmit={handleAddIntensity}
                            crisisStartDate={crisis.startDate}
                            crisisEndDate={crisis.endDate}
                            mode="add"
                        />
                    )}

                    {isEditIntensityModalOpen && selectedIntensity && (
                        <IntensityDialog
                            isOpen={isEditIntensityModalOpen}
                            onClose={() => {
                                setIsEditIntensityModalOpen(false);
                                setSelectedIntensity(null);
                            }}
                            onSubmit={handleEditIntensity}
                            intensity={selectedIntensity}
                            crisisStartDate={crisis.startDate}
                            crisisEndDate={crisis.endDate}
                            mode="edit"
                        />
                    )}

                    {isDeleteIntensityModalOpen && selectedIntensity && (
                        <DeleteDialog
                            isOpen={isDeleteIntensityModalOpen}
                            onClose={() => {
                                setIsDeleteIntensityModalOpen(false);
                                setSelectedIntensity(null);
                            }}
                            onConfirm={handleDeleteIntensity}
                            title="Supprimer l'intensité"
                            message={`Êtes-vous sûr de vouloir supprimer cette mesure d'intensité du ${formatDate(selectedIntensity.date)} ?`}
                        />
                    )}
                </>
            )}
        </PrivateLayout>
    );
};

export default CrisisDetails;
