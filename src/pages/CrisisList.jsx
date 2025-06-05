import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import PrivateLayout from '../components/PrivateLayout';
import DeleteDialog from '../components/DeleteDialog';
import toastr from 'toastr';
import { useApi } from '../hooks/useApi';

const CrisisList = () => {
    const [crises, setCrises] = useState([]);
    const { loading, error, get, remove } = useApi();
    const navigate = useNavigate();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCrisisId, setSelectedCrisisId] = useState(null);
    const [selectedCrisisInfo, setSelectedCrisisInfo] = useState('');
    const currentYear = new Date().getFullYear().toString();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
    const [openSections, setOpenSections] = useState({});

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

    const groupCrisesByYearAndMonth = (crisesToGroup) => {
        return crisesToGroup.reduce((acc, crise) => {
            const date = new Date(crise.startDate);
            const year = date.getFullYear().toString();
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Mois de 01 à 12

            if (!acc[year]) {
                acc[year] = {};
            }
            if (!acc[year][month]) {
                acc[year][month] = [];
            }
            acc[year][month].push(crise);
            return acc;
        }, {});
    };

  

    useEffect(() => {
        if (crises.length > 0) {
            const grouped = groupCrisesByYearAndMonth(crises);
            const initialOpenState = {};
            if (grouped[currentYear] && grouped[currentYear][currentMonth]) {
                if (!initialOpenState[currentYear]) {
                    initialOpenState[currentYear] = {};
                }
                initialOpenState[currentYear][currentMonth] = true;
            }
            setOpenSections(initialOpenState);
        }
    }, [crises, currentYear, currentMonth]);

    const toggleSection = (year, month) => {
        setOpenSections(prevOpenSections => {
            const yearSections = prevOpenSections[year] || {};
            const newYearSections = { ...yearSections, [month]: !yearSections[month] };
            return {
                ...prevOpenSections,
                [year]: newYearSections,
            };
        });
    };

    const groupedCrises = groupCrisesByYearAndMonth(crises);
    const sortedYears = Object.keys(groupedCrises).sort((a, b) => parseInt(b) - parseInt(a));

    const handleDeleteCrisis = (crisisId, crisisDate) => {
        setSelectedCrisisId(crisisId);
        const formattedDate = formatDate(crisisDate).split(' ')[0]; 
        setSelectedCrisisInfo(`la crise du ${formattedDate}`);
        setIsDeleteDialogOpen(true);
    };

    const confirmActualDelete = async () => {
        if (!selectedCrisisId) return;
        try {
            await remove(`/crisis/${selectedCrisisId}`);
            toastr.success("Crise supprimée avec succès !");
            setCrises(prevCrises => prevCrises.filter(c => c.id !== selectedCrisisId));
            setIsDeleteDialogOpen(false);
            setSelectedCrisisId(null);
            setSelectedCrisisInfo('');
        } catch (err) {
            console.error("Erreur lors de la suppression de la crise :", err);
            toastr.error(err.response?.data?.message || "Une erreur est survenue lors de la suppression.");
            setIsDeleteDialogOpen(false);
        }
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
                <div className="text-center text-red-500 py-8">
                    Erreur lors du chargement des crises. Veuillez réessayer.
                </div>
            </PrivateLayout>
        );
    }

    return (
        <PrivateLayout>
            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmActualDelete}
                info={selectedCrisisInfo} 
            />
            <div className="w-full max-w-4xl mx-auto py-8">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">Historique des crises</h1>

                {crises.length === 0 && !loading ? (
                    <p className="text-white/60 text-center">Aucune crise enregistrée</p>
                ) : (
                    sortedYears.map(year => (
                        <div key={year} className="mb-6">
                            <h2 className="text-3xl font-semibold text-teal-300 mt-8 mb-5 pb-2 border-b border-slate-700">{year}</h2>
                            {Object.keys(groupedCrises[year]).sort((a, b) => parseInt(b) - parseInt(a)).map(month => {
                                const crisesInMonth = groupedCrises[year][month];
                                const monthDate = new Date(year, parseInt(month) - 1);
                                const monthName = monthDate.toLocaleString('fr-FR', { month: 'long' });

                                return (
                                    
                                    <div key={`${year}-${month}`} className="mb-4">
                                        <button
                                            onClick={() => toggleSection(year, month)}
                                            className={`w-full flex justify-between items-center text-left text-slate-100 bg-slate-700 hover:bg-slate-600 shadow-md px-5 py-4 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${openSections[year]?.[month] ? 'rounded-t-lg' : 'rounded-lg'}`}
                                        >
                                            <span><span className="text-lg font-medium">{monthName} {year}</span><span className="text-sm text-slate-300 ml-2">({crisesInMonth.length} crise{crisesInMonth.length > 1 ? 's' : ''})</span></span>
                                            <span className="text-teal-300 text-xl">{openSections[year]?.[month] ? '▲' : '▼'}</span>
                                        </button>
                                        {openSections[year]?.[month] && (
                                            <div className="bg-slate-700/30 rounded-b-lg p-4 space-y-4 shadow-inner">
                                                {crisesInMonth.map((crise) => (
                                                    <div
                                                        key={crise.id}
                                                        className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors flex items-center justify-between"
                                                    >
                                                        <div 
                                                            className="flex-grow cursor-pointer pr-4" 
                                                            onClick={() => navigate(`/crisis/${crise.id}`)} 
                                                        >
                                                            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                                                                <div className={`h-16 w-16 rounded-full ${getIntensityColor(crise.intensities.sort((a, b) => new Date(a.date) - new Date(b.date))[0].number)} flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0`}>
                                                                    {crise.intensities && crise.intensities.length > 0 && (
                                                                        <span className="text-2xl font-bold text-white">
                                                                            {crise.intensities.sort((a, b) => new Date(a.date) - new Date(b.date))[0].number}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 w-full">
                                                                    <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-3">
                                                                        <p className="text-white text-lg font-medium">
                                                                            {formatDate(crise.startDate)}
                                                                        </p>
                                                                        {crise.intensities && crise.intensities.length > 0 && (
                                                                            <p className="text-white/60 text-sm mt-1 sm:mt-0">
                                                                                Intensité : {crise.intensities.sort((a, b) => new Date(a.date) - new Date(b.date))[0].number}/10
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
                                                        <div className="flex-shrink-0">
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); 
                                                                    handleDeleteCrisis(crise.id, crise.startDate); 
                                                                }}
                                                                className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110"
                                                                title="Supprimer" 
                                                            >
                                                                <FiTrash2 className="w-5 h-5 text-white/70 hover:text-white" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))
                )}
            </div>
        </PrivateLayout>
    );
};

export default CrisisList;
