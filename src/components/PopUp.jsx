import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

const PopUp = ({ firstName, onClose }) => {
    const [ongoingCrisis, setOngoingCrisis] = useState(null);
    const [isLoadingCrises, setIsLoadingCrises] = useState(true);
    const { get, loading: apiLoading, error: apiError } = useApi();

    useEffect(() => {
        const fetchOngoingCrisis = async () => {
            try {
                const allCrises = await get('/crisis');
                if (allCrises && Array.isArray(allCrises)) {
                    const sortedOngoingCrises = allCrises
                        .filter(crisis => !crisis.endDate)
                        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

                    if (sortedOngoingCrises.length > 0) {
                        setOngoingCrisis(sortedOngoingCrises[0]);
                    }
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des crises pour le popup:", err);
            } finally {
                setIsLoadingCrises(false);
            }
        };

        fetchOngoingCrisis();
    }, [get]);

    if (isLoadingCrises || apiLoading) {
        return (
            <div id="popup" className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-teal-500 text-gray-300 px-6 py-4 rounded-t-lg shadow-lg transition-all duration-500 z-50 w-[100%] max-w-[1024px] h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (ongoingCrisis && !apiError) {
        const crisisDate = new Date(ongoingCrisis.startDate).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        return (
            <div id="popup" className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-teal-500 text-gray-300 px-6 py-4 rounded-t-lg shadow-lg transition-all duration-500 z-50 w-[100%] max-w-[1024px] h-[300px]">
                <p className='text-4xl font-bold text-center'>Bonjour <span className="font-italiana text-3xl font-normal">{firstName}</span></p>
                <p className='mt-5 text-lg text-center'>Une crise de migraine est en cours depuis le {crisisDate}.</p>
                <div className="flex flex-col space-y-3 mt-6 items-center">
                    <Link 
                        to={`/crisis/${ongoingCrisis.id}`} 
                        onClick={onClose} 
                        className="border-none hover:border-none bg-gray-800 text-white focus:outline-none px-5 py-2.5 rounded-md w-auto text-sm text-center"
                    >
                        Gérer la crise en cours
                    </Link>
                    <button 
                        onClick={onClose}
                        className="border-none hover:border-none bg-gray-800 text-white focus:outline-none px-5 py-2.5 rounded-md w-auto text-sm mt-1 mb-6"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        );
    }

  
    return (
        <div id="popup" className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-teal-500 text-gray-300 px-6 py-4 rounded-t-lg shadow-lg transition-all duration-500 z-50 w-[100%] max-w-[1024px] h-[300px]">
            <p className='text-4xl font-bold text-center'>Bonjour <span className="font-italiana text-3xl font-normal">{firstName}</span></p>
            <p className='mt-5 text-center'>Souhaites-tu enregistrer une <br /> nouvelle crise de migraine ?</p>
            <div className="flex flex-col space-y-4 mt-6 items-center">
                <Link 
                    to="/crisis-form" 
                    onClick={onClose} 
                    className="border-none hover:border-none bg-gray-800 text-white focus:outline-none px-4 py-2 rounded w-[100px] text-center"
                >
                    Oui
                </Link>
                <button 
                    onClick={onClose}
                    className="border-none hover:border-none bg-gray-800 text-white focus:outline-none px-4 py-2 rounded w-[100px]"
                >
                    Non
                </button>
            </div>
        </div>
    );
};

export default PopUp;