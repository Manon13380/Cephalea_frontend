import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { FaPills } from 'react-icons/fa';
import PrivateLayout from '../components/PrivateLayout';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

const TreatmentsPage = () => {
    const navigate = useNavigate();
    const [medications, setMedications] = useState([]);
    const { loading, error, get } = useApi();

    useEffect(() => {
        const fetchMedications = async () => {
            try {
                const data = await get('/medications');
                setMedications(data);
            } catch (err) {
                console.error('Erreur:', err);
                toastr.error("Une erreur est survenue lors de la récupération des médicaments");
            }
        };

        fetchMedications();
    }, [get]);

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
            <div className="max-w-4xl mx-auto py-8 px-4"> 
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
                                className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{medication.name}</h3>
                                        {medication.dosage && (
                                            <p className="text-gray-300">Dosage: {medication.dosage}</p>
                                        )}
                                        {medication.quantity && (
                                            <p className="text-gray-300">
                                                {medication.quantity} {medication.periodQuantity?.toLowerCase()}
                                            </p>
                                        )}
                                    </div>
                                    <button 
                                        className="text-gray-400 hover:text-teal-400 transition-colors"
                                        onClick={() => {/* Gérer le clic sur le bouton */}}
                                    >
                                        <FaPills size={24} />
                                    </button>
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
