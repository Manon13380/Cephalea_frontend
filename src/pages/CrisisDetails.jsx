import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PrivateLayout from '../components/PrivateLayout';
import api from "../api/axios";
import { useApi } from '../hooks/useApi';
import TerminateCrisisDialog from '../components/TerminateCrisisDialog';
import IntensityDialog from '../components/IntensityDialog.jsx';
import DeleteDialog from '../components/DeleteDialog';
import { ReliefDialog } from '../components/ReliefDialog';
import MedicationDialog from '../components/MedicationDialog';
import { ActivityDialog } from '../components/ActivityDialog';
import { TriggerDialog } from '../components/TriggerDialog';
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
    const [isEditStartDateModalOpen, setIsEditStartDateModalOpen] = useState(false);

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

    const [isTriggerDialogOpen, setIsTriggerDialogOpen] = useState(false);
    const [selectedTrigger, setSelectedTrigger] = useState(null);
    const [isDeleteTriggerModalOpen, setIsDeleteTriggerModalOpen] = useState(false);
    // Ajout pour le dialog médicament
        const [isMedicationDialogOpen, setIsMedicationDialogOpen] = useState(false);
    const [editingMedication, setEditingMedication] = useState(null);
    const [isDeleteMedicationModalOpen, setIsDeleteMedicationModalOpen] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);

    const [isEditingComment, setIsEditingComment] = useState(false);
    const [commentText, setCommentText] = useState('');

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

        const handleUpdateStartDate = async (newStartDate) => {
        try {
            const updatedCrisis = await update(`/crisis/${id}`, { startDate: newStartDate });
            setCrisis(prev => ({ ...prev, startDate: updatedCrisis.startDate }));
            setIsEditStartDateModalOpen(false);
            toastr.success('Date de début de la crise modifiée avec succès !');
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la date de début:", error);
            toastr.error('Erreur lors de la modification de la date de début.');
        }
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
            const newRelief = await post(`/crisis/${id}/soulagements/${reliefData.reliefId}`);

            setCrisis(prev => ({
                ...prev,
                soulagements: [...prev.soulagements, newRelief]
            }));
            toastr.success('Soulagement ajouté avec succès.');
            setIsReliefDialogOpen(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout du soulagement:", error);
            toastr.error(apiError || "Erreur lors de l'ajout du soulagement.");
        }
    };

    const handleSaveMedication = async (medicationData) => {
        try {
            if (editingMedication) {
                // Cas 1: On est en mode édition ET on crée un nouveau médicament à la volée.
                if (medicationData.name) {
                    const { dateTimeIntake, ...newMedicationData } = medicationData;
                    const newMedication = await post('/medications', newMedicationData);
                    
                    const updatedCrisisMed = await update(`/crisis/${id}/crisisMedications/${editingMedication.id}?medicationId=${newMedication.id}`, {
                        dateTimeIntake: dateTimeIntake,
                    });

                    setCrisis(prev => ({
                        ...prev,
                        crisisMedication: prev.crisisMedication.map(med =>
                            med.id === editingMedication.id ? updatedCrisisMed : med
                        )
                    }));
                    toastr.success('Nouveau traitement créé et prise mise à jour !');
                } else {
                // Cas 2: On est en mode édition et on modifie simplement la prise (date ou sélection d'un autre trt existant).
                    const updatedCrisisMed = await update(`/crisis/${id}/crisisMedications/${editingMedication.id}?medicationId=${medicationData.medicationId}`, {
                        dateTimeIntake: medicationData.dateTimeIntake,
                    });

                    setCrisis(prev => ({
                        ...prev,
                        crisisMedication: prev.crisisMedication.map(med =>
                            med.id === editingMedication.id ? updatedCrisisMed : med
                        )
                    }));
                    toastr.success('Prise de médicament modifiée avec succès.');
                }
            } else if (medicationData.name) {
                // Mode création: on crée un nouveau médicament puis on le lie à la crise
                const { dateTimeIntake, ...newMedicationData } = medicationData;
                const newMedication = await post('/medications', newMedicationData);
                const linkedMedication = await post(`/crisis/${id}/crisisMedications?medicationId=${newMedication.id}`, { dateTimeIntake });
                
                const flatMedication = {
                    medication: linkedMedication.medication,
                    id: linkedMedication.id,
                    dateTimeIntake: linkedMedication.dateTimeIntake
                };
                setCrisis(prev => ({ ...prev, crisisMedication: [...(prev.crisisMedication || []), flatMedication] }));
                toastr.success('Médicament créé et ajouté avec succès.');

            } else {
                // Mode ajout: on lie un médicament existant à la crise
                const linkedMedication = await post(`/crisis/${id}/crisisMedications?medicationId=${medicationData.medicationId}`, { 
                    dateTimeIntake: medicationData.dateTimeIntake 
                });
                const flatMedication = {
                    medication: linkedMedication.medication,
                    id: linkedMedication.id,
                    dateTimeIntake: linkedMedication.dateTimeIntake
                };
                setCrisis(prev => ({ ...prev, crisisMedication: [...(prev.crisisMedication || []), flatMedication] }));
                toastr.success('Médicament ajouté avec succès.');
            }
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du médicament:", error);
            toastr.error("Erreur lors de la sauvegarde du médicament.");
        } finally {
            setIsMedicationDialogOpen(false);
            setEditingMedication(null);
        }
    };

        const handleEditMedication = (medication) => {
        setEditingMedication(medication);
        setIsMedicationDialogOpen(true);
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

    const handleConfirmDeleteMedication = async () => {
        if (!selectedMedication) return;
        try {
            await remove(`/crisisMedications/${selectedMedication.id}`);
            setCrisis(prev => ({
                ...prev,
                crisisMedication: prev.crisisMedication.filter(med => med.id !== selectedMedication.id)
            }));
            toastr.success('Médicament supprimé avec succès.');
        } catch (error) {
            toastr.error("Erreur lors de la suppression du médicament.");
        } finally {
            setIsDeleteMedicationModalOpen(false);
            setSelectedMedication(null);
        }
    };

    const handleSaveTrigger = async (triggerData) => {
        try {
            const newTrigger = await post(`/crisis/${id}/triggers/${triggerData.triggerId}`);
            setCrisis(prevCrisis => ({
                ...prevCrisis,
                triggers: [...prevCrisis.triggers, newTrigger]
            }));
            toastr.success('Déclencheur ajouté avec succès.');
            setIsTriggerDialogOpen(false);
        } catch (error) {
            toastr.error("Erreur lors de l'ajout du déclencheur.");
            console.error("Erreur lors de l'ajout du déclencheur:", error);
        }
    };

    const handleDeleteTrigger = async () => {
        if (!selectedTrigger) return;
        try {
            await remove(`/crisis/${id}/triggers/${selectedTrigger.id}`);
            setCrisis(prev => ({ ...prev, triggers: prev.triggers.filter(t => t.id !== selectedTrigger.id) }));
            toastr.success('Déclencheur supprimé avec succès.');
            setIsDeleteTriggerModalOpen(false);
            setSelectedTrigger(null);
        } catch (error) {
            console.error("Erreur lors de la suppression du déclencheur:", error);
            toastr.error("Erreur lors de la suppression du déclencheur.");
        }
    };

    const handleEditCommentClick = () => {
        setCommentText(crisis.comment || '');
        setIsEditingComment(true);
    };

    const handleCancelComment = () => {
        setIsEditingComment(false);
    };

    const handleSaveComment = async () => {
        try {
            const updatedCrisis = await update(`/crisis/${id}`, { comment: commentText });
            setCrisis(prevCrisis => ({ ...prevCrisis, comment: updatedCrisis.comment }));
            setIsEditingComment(false);
            toastr.success('Commentaire mis à jour avec succès.');
        } catch (error) {
            toastr.error('Erreur lors de la mise à jour du commentaire.');
            console.error('Erreur lors de la mise à jour du commentaire:', error);
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
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                            {/* Left part: Intensity + Title/Subtitle */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                <div className={`h-20 w-20 rounded-full ${getIntensityColor([...crisis.intensities].sort((a, b) => new Date(a.date) - new Date(b.date))[0].number)} flex items-center justify-center flex-shrink-0`}>
                                    <span className="text-3xl font-bold text-white">
                                        {[...crisis.intensities].sort((a, b) => new Date(a.date) - new Date(b.date))[0].number}
                                    </span>
                                </div>
                                <div className="text-center sm:text-left">
                                    <h1 className="text-3xl font-bold text-white">
                                        Crise du {formatDate(crisis.startDate)}
                                    </h1>
                                    <p className={crisis.endDate ? "text-white/60" : "text-yellow-400 font-semibold flex items-center"}>
                                        {crisis.endDate ? `Terminée le ${formatDate(crisis.endDate)}` : "En cours"}
                                        {!crisis.endDate && (
                                            <button
                                                onClick={handleOpenTerminateModal}
                                                className="flex items-center gap-2 bg-custom-green text-white hover:brightness-90 font-semibold py-1 px-3 rounded-lg transition-all duration-200 ml-3"
                                                title="Terminer cette crise"
                                            >
                                                <FiCheckSquare className="w-5 h-5" />
                                                <span>Terminer</span>
                                            </button>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Right part: Edit button */}
                            <div>
                                <button onClick={() => setIsEditStartDateModalOpen(true)} className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110" title="Modifier la date de début">
                                    <FiEdit className="w-5 h-5 text-white/70 group-hover:text-white" />
                                </button>
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
                                    [...crisis.intensities]
                                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                                        .map((intensity) => (
                                            <div key={intensity.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/10 p-3 rounded-lg">
                                                <div className="flex items-center gap-x-4 flex-1">
                                                    <div className={`w-10 h-10 rounded-full ${getIntensityColor(intensity.number)} flex items-center justify-center flex-shrink-0`}>
                                                        <span className="text-white font-bold text-lg">{intensity.number}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-semibold">Intensité de {intensity.number}/10</span>
                                                        <span className="text-white/70 text-sm">{formatDate(intensity.date)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end sm:justify-center items-center gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l sm:pl-4 border-white/10">
                                                    <button onClick={() => { setSelectedIntensity(intensity); setIsEditIntensityModalOpen(true); }} className="group p-2 hover:bg-white/20 rounded-full transition-all duration-200" title="Modifier">
                                                        <FiEdit className="w-4 h-4 text-white/70 group-hover:text-white" />
                                                    </button>
                                                    <button 
                                                        onClick={() => { setSelectedIntensity(intensity); setIsDeleteIntensityModalOpen(true); }}
                                                        className="group p-2 hover:bg-white/20 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title={crisis.intensities.length <= 1 ? "Impossible de supprimer la dernière intensité" : "Supprimer"}
                                                        disabled={crisis.intensities.length <= 1}
                                                    >
                                                        <FiTrash2 className="w-4 h-4 text-white/70 group-hover:text-white" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Soulagements
                                </h2>
                                <button
                                    onClick={() => setIsReliefDialogOpen(true)}
                                    className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 order-1 sm:order-2 self-end sm:self-center mt-0 mb-2 sm:mb-0"
                                    title="Ajouter un soulagement"
                                >
                                    <svg className="w-5 h-5 text-white/70 hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                                    </svg>
                                    Médicaments pris
                                </h2>
                                <button onClick={() => setIsMedicationDialogOpen(true)} className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 order-1 sm:order-2 self-end sm:self-center mt-0 mb-2 sm:mb-0" title="Ajouter un médicament">
                                    <svg className="w-5 h-5 text-white/70 hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex flex-col gap-3">
                                {crisis.crisisMedication && crisis.crisisMedication.length > 0 ? (
                                    crisis.crisisMedication.map((med, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/10 p-3 rounded-lg">
                                            <div className="flex items-center gap-x-4 flex-1">
                                                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-bold text-lg">💊</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-semibold">{med.medication.name}{med.medication.dosage ? ` (${med.medication.dosage})` : ''}</span>
                                                    <span className="text-white/70 text-sm">{med.dateTimeIntake ? formatDate(med.dateTimeIntake) : ''}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-end sm:justify-center items-center gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l sm:pl-4 border-white/10">
                                                <button onClick={() => handleEditMedication(med)} className="group p-2 hover:bg-white/20 rounded-full transition-all duration-200" title="Modifier">
                                                    <FiEdit className="w-4 h-4 text-white/70 group-hover:text-white" />
                                                </button>
                                                <button onClick={() => {
                                                    setSelectedMedication(med);
                                                    setIsDeleteMedicationModalOpen(true);
                                                }} className="group p-2 hover:bg-white/20 rounded-full transition-all duration-200" title="Supprimer">
                                                    <FiTrash2 className="w-4 h-4 text-white/70 group-hover:text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-white/60 text-center py-4">
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                    Déclencheurs
                                </h2>
                                <button onClick={() => setIsTriggerDialogOpen(true)} className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 order-1 sm:order-2 self-end sm:self-center mt-0 mb-2 sm:mb-0" title="Ajouter un déclencheur">
                                    <FiPlus className="w-5 h-5 text-white/70 hover:text-white" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {crisis.triggers && crisis.triggers.length > 0 ? (
                                    crisis.triggers.map((trigger) => (
                                        <div key={trigger.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                            <span className="text-white">{trigger.name}</span>
                                            <button
                                                onClick={() => { setSelectedTrigger(trigger); setIsDeleteTriggerModalOpen(true); }}
                                                className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110"
                                                title="Supprimer"
                                            >
                                                <FiTrash2 className="w-4 h-4 text-white/70 group-hover:text-white" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-white/60 text-center py-4">
                                        Aucun déclencheur
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Commentaire */}
                    <div className="bg-white/5 rounded-lg p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center order-2 sm:order-1">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                                </svg>
                                Commentaire
                            </h2>
                            {!isEditingComment && (
                                <button onClick={handleEditCommentClick} className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 order-1 sm:order-2 self-end sm:self-center" title="Modifier le commentaire">
                                    <FiEdit className="w-5 h-5 text-white/70 hover:text-white" />
                                </button>
                            )}
                        </div>
                        {isEditingComment ? (
                            <div>
                                <textarea
                                    className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    rows="4"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Ajoutez votre commentaire ici..."
                                ></textarea>
                                <div className="flex justify-end space-x-4 mt-4">
                                    <button onClick={handleCancelComment} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors">
                                        Annuler
                                    </button>
                                    <button onClick={handleSaveComment} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500 transition-colors">
                                        Enregistrer
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white/10 p-4 rounded-lg min-h-[100px] cursor-pointer hover:bg-white/20" onClick={handleEditCommentClick}>
                                {crisis.comment ? (
                                    <p className="text-white whitespace-pre-wrap">{crisis.comment}</p>
                                ) : (
                                    <p className="text-white/60">Aucun commentaire</p>
                                )}
                            </div>
                        )}
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
                                        <MedicationDialog
                        isOpen={isMedicationDialogOpen}
                        onClose={() => {
                            setIsMedicationDialogOpen(false);
                            setEditingMedication(null);
                        }}
                        onSave={handleSaveMedication}
                        minDate={crisis.startDate}
                        maxDate={crisis.endDate}
                        crisisId={id}
                        initialData={editingMedication}
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

                    <TriggerDialog
                        isOpen={isTriggerDialogOpen}
                        onClose={() => setIsTriggerDialogOpen(false)}
                        onSave={handleSaveTrigger}
                        crisisId={id}
                    />

                    <DeleteDialog
                        isOpen={isDeleteTriggerModalOpen}
                        onClose={() => setIsDeleteTriggerModalOpen(false)}
                        onConfirm={handleDeleteTrigger}
                        title="Supprimer le déclencheur"
                        message={`Êtes-vous sûr de vouloir supprimer le déclencheur "${selectedTrigger?.name}" ?`}
                    />
                    {isDeleteMedicationModalOpen && selectedMedication && (
                        <DeleteDialog
                            isOpen={isDeleteMedicationModalOpen}
                            onClose={() => {
                                setIsDeleteMedicationModalOpen(false);
                                setSelectedMedication(null);
                            }}
                            onConfirm={handleConfirmDeleteMedication}
                            title="Supprimer le médicament"
                            message={`Êtes-vous sûr de vouloir supprimer le médicament ${selectedMedication.medication.name} ?`}
                        />
                    )}
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

                                        <TerminateCrisisDialog
                        isOpen={isTerminateModalOpen}
                        onClose={() => setIsTerminateModalOpen(false)}
                        onConfirm={handleTerminateCrisis}
                        mode="terminate"
                        dialogTitle="Terminer la crise"
                        dateLabel="Date et heure de fin"
                        initialDateISO={new Date().toISOString()}
                        minConstraintDateISO={crisis.startDate}
                    />

                    {isEditStartDateModalOpen && (
                        <TerminateCrisisDialog
                            isOpen={isEditStartDateModalOpen}
                            onClose={() => setIsEditStartDateModalOpen(false)}
                            onConfirm={handleUpdateStartDate}
                            mode="editStartDate" // Important: on spécifie le mode
                            dialogTitle="Modifier la date de début"
                            dateLabel="Nouvelle date et heure de début"
                            initialDateISO={crisis.startDate}
                            maxConstraintDateISO={crisis.endDate} // La date de début ne peut pas dépasser la date de fin
                        />
                    )}
                </>
            )}
        </PrivateLayout>
    );
};

export default CrisisDetails;
