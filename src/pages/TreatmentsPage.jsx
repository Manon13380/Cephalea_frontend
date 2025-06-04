import React, { useState, useEffect } from 'react';
import { FiPlus, FiMaximize2, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { FaPills, FaHourglass, FaCalendarAlt } from 'react-icons/fa';
import PrivateLayout from '../components/PrivateLayout';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { toast } from 'react-toastify';
import DeleteDialog from '../components/DeleteDialog';



const TreatmentsPage = () => {
    const navigate = useNavigate();
    const [medications, setMedications] = useState([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedMedicationId, setSelectedMedicationId] = useState(null);
    const [selectedMedicationName, setSelectedMedicationName] = useState('');
    const { loading, error, get, remove } = useApi();

    const handleDelete = async (id, medicationName) => {
        setSelectedMedicationId(id);
        setSelectedMedicationName(medicationName);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await remove(`/medications/${selectedMedicationId}`);
            const updatedMedications = medications.filter(m => m.id !== selectedMedicationId);
            setMedications(updatedMedications);
            toast.success('Médicament supprimé avec succès');
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error('Erreur lors de la suppression :', error);
            toast.error('Une erreur est survenue lors de la suppression');
            setIsDeleteDialogOpen(false);
        }
    };

    const handleEdit = (id) => {
        const medication = medications.find(m => m.id === id);
        if (medication) {
            navigate('/add-treatment', { state: { ...medication, isEdit: true } });
        }
    };

    useEffect(() => {
        const fetchMedications = async () => {
            try {
                const data = await get('/medications');
                setMedications(data);
            } catch (err) {
                console.error('Erreur:', err);
                toast.error("Une erreur est survenue lors de la récupération des médicaments");
            }
        };

        fetchMedications();
    }, []);

    const ICONS = {
        dosage: <FaPills className="w-4 h-4" />,
        quantity: <FaPills className="w-4 h-4" />,
        duration: <FaCalendarAlt className="w-4 h-4" />,
        interval: <FaHourglass className="w-4 h-4" />,
        maximum: <FiMaximize2 className="w-4 h-4" />
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

    if (error) {
        return (
            <PrivateLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-red-400">Erreur lors du chargement des médicaments</div>
                </div>
            </PrivateLayout>
        );
    }

    return (
        <PrivateLayout>
            <div className="max-w-4xl mx-auto py-8 px-4"> 
                <DeleteDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={confirmDelete}
                    medicationName={selectedMedicationName}
                />
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4">Mes traitements</h1>
                    <button 
                        onClick={() => navigate("/add-treatment")}
                        className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg space-x-2 transition-colors"
                    >
                        <FiPlus />
                        <span>Ajouter un traitement</span>
                    </button>
                </div>

                {medications.length > 0 ? (
                    <div className="grid gap-4">
                        {medications.map((medication) => (
                            <div 
                                key={medication.id} 
                                className="bg-white/5 p-6 rounded-xl border border-white/10 relative"
                            >
                                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-2 sm:gap-4">
                                    <button 
                                        onClick={() => handleEdit(medication.id)}
                                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110"
                                        title="Modifier"
                                    >
                                        <FiEdit3 className="w-5 h-5 text-white/70 hover:text-white" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(medication.id, medication.name)}
                                        className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110"
                                        title="Supprimer"
                                    >
                                        <FiTrash2 className="w-5 h-5 text-white/70 hover:text-white" />
                                    </button>
                                </div>
                                <div className="space-y-2 mt-6 sm:mt-0">
                                    <h3 className="text-xl font-semibold text-white">{medication.name}</h3>
                                    <div className="flex flex-wrap gap-4 text-gray-300">
                                        {medication.dosage && (
                                            <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg">
                                                <div className="flex items-center gap-1">
                                                    {ICONS.dosage}
                                                    <span className="text-sm">Dosage:</span>
                                                </div>
                                                <span className="font-medium">{medication.dosage}</span>
                                            </div>
                                        )}
                                        {medication.quantity && (
                                            <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg">
                                                <div className="flex items-center gap-1">
                                                    {ICONS.quantity}
                                                    <span className="text-sm">Quantité:</span>
                                                </div>
                                                <span className="font-medium">{medication.quantity}</span>
                                                <span className="text-sm">/{medication.periodQuantity.toLowerCase()}</span>
                                            </div>
                                        )}
                                        
                                        {medication.duration && (
                                            <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg">
                                                <div className="flex items-center gap-1">
                                                    {ICONS.duration}
                                                    <span className="text-sm">Durée:</span>
                                                </div>
                                                <span className="font-medium">{medication.duration}</span>
                                                <span className="text-sm">{medication.periodDuration.toLowerCase()}</span>
                                            </div>
                                        )}
                                        {medication.interval && (
                                            <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg">
                                                <div className="flex items-center gap-1">
                                                    {ICONS.interval}
                                                    <span className="text-sm">Intervalle:</span>
                                                </div>
                                                <span className="font-medium">{medication.interval}</span>
                                                <span className="text-sm">heures</span>
                                            </div>
                                        )}
                                        {medication.maximum && (
                                            <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg">
                                                <div className="flex items-center gap-1">
                                                    {ICONS.maximum}
                                                    <span className="text-sm">Max:</span>
                                                </div>
                                                <span className="font-medium">{medication.maximum}</span>
                                                <span className="text-sm">/{medication.periodMaximum.toLowerCase()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white/5 rounded-lg">
                        <FaPills size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-xl text-gray-300">Aucun traitement enregistré</p>
                        <p className="text-gray-400 mt-2">Commencez par ajouter votre premier traitement</p>
                    </div>
                )}
            </div>
        </PrivateLayout>
    );
};

export default TreatmentsPage;
