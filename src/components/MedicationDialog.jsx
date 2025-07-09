import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import toastr from 'toastr';

const PERIOD_OPTIONS = [
    { value: 'HEURE', label: 'Heure' },
    { value: 'JOUR', label: 'Jour' },
    { value: 'SEMAINE', label: 'Semaine' },
    { value: 'MOIS', label: 'Mois' },
    { value: 'ANNEE', label: 'An' }
];

export const MedicationDialog = ({ isOpen, onClose, onSave, minDate, maxDate, crisisId }) => {
    const { get } = useApi();
    const [mode, setMode] = useState('select'); // 'select' | 'create'
    const [treatments, setTreatments] = useState([]);
    const [selectedTreatmentId, setSelectedTreatmentId] = useState('');
    const [date, setDate] = useState('');
    // Pour création
    // Champs création médicament (reprend AddTreatmentForm)
    const [medName, setMedName] = useState('');
    const [dosage, setDosage] = useState('');
    const [quantity, setQuantity] = useState('');
    const [periodQuantity, setPeriodQuantity] = useState('');
    const [duration, setDuration] = useState('');
    const [periodDuration, setPeriodDuration] = useState('');
    const [interval, setInterval] = useState('');
    const [maximum, setMaximum] = useState('');
    const [periodMaximum, setPeriodMaximum] = useState('');
    const [isAlarm, setIsAlarm] = useState(false);
    const [isTreatment, setIsTreatment] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && mode === 'select') {
            const fetchTreatments = async () => {
                try {
                    const allMeds = await get('/medications');
                    setTreatments((allMeds || []).filter(med => med.isTreatment));
                } catch (e) {
                    toastr.error('Erreur lors du chargement des traitements');
                }
            };
            fetchTreatments();
        }
        if (isOpen) {
            // Date par défaut : maintenant, bornée si besoin
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            setDate(now.toISOString().slice(0,16));
        }
        // Reset
        setSelectedTreatmentId('');
        setMedName('');
        setDosage('');
        setQuantity('');
        setPeriodQuantity('');
        setDuration('');
        setPeriodDuration('');
        setInterval('');
        setMaximum('');
        setPeriodMaximum('');
        setIsAlarm(false);
        setIsTreatment(false);
    }, [isOpen, mode, get]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (mode === 'select') {
                if (!selectedTreatmentId || !date) {
                    toastr.error('Veuillez sélectionner un traitement et une date');
                    setIsLoading(false);
                    return;
                }
                await onSave({ medicationId: selectedTreatmentId, date });
            } else {
                if (!medName || !date) {
                    toastr.error('Veuillez renseigner le nom et la date');
                    setIsLoading(false);
                    return;
                }
                await onSave({
                    name: medName,
                    dosage,
                    quantity,
                    periodQuantity,
                    duration,
                    periodDuration,
                    interval,
                    maximum,
                    periodMaximum,
                    isAlarm,
                    isTreatment,
                    date
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4 p-6 relative">
                
                <h2 className="text-2xl font-bold text-white text-center mb-6">Ajouter un médicament</h2>
                <div className="flex space-x-4 justify-center mb-6">
                    <button
                        className={`px-3 py-1 rounded-md text-sm font-semibold transition-all duration-200 ${mode === 'select' ? 'bg-teal-600 text-white scale-105' : 'bg-gray-700 text-white/60'}`}
                        onClick={() => setMode('select')}
                    >
                        Sélectionner un traitement
                    </button>
                    <button
                        className={`px-3 py-1 rounded-md text-sm font-semibold transition-all duration-200 ${mode === 'create' ? 'bg-teal-600 text-white scale-105' : 'bg-gray-700 text-white/60'}`}
                        onClick={() => setMode('create')}
                    >
                        Créer un médicament
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* Bloc scrollable uniquement pour l’onglet création */}
                    <div className={mode === 'create' ? 'max-h-[60vh] overflow-y-auto pr-2' : ''}>
                    {mode === 'select' ? (
                        <>
                            <label className="block text-white mb-2">Traitement</label>
                            <select
                                className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
                                value={selectedTreatmentId}
                                onChange={e => setSelectedTreatmentId(e.target.value)}
                                required
                            >
                                <option value="">-- Sélectionnez --</option>
                                {treatments.map(med => (
                                    <option key={med.id} value={med.id}>{med.name} {med.dosage ? `(${med.dosage})` : ''}</option>
                                ))}
                            </select>
                        </>
                    ) : (
                        <>
                            {/* Nom du médicament */}
                            <label className="block text-white mb-1">Nom du médicament</label>
                            <input
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                                value={medName}
                                onChange={e => setMedName(e.target.value)}
                                required
                                placeholder="Ex: Doliprane"
                            />
                            {/* Dosage */}
                            <label className="block text-white mb-1">Dosage</label>
                            <input
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                                value={dosage}
                                onChange={e => setDosage(e.target.value)}
                                placeholder="Ex: 1000mg"
                            />
                            {/* Quantité */}
                            <div className="flex gap-2 mb-2">
                                <div className="w-1/2">
                                    <label className="block text-white mb-1">Quantité</label>
                                    <input
                                        className="w-full p-2 rounded bg-gray-700 text-white"
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                        type="number"
                                        min="0"
                                        placeholder="Ex: 2"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-white mb-1">par</label>
                                    <select
                                        className="w-full p-2 rounded bg-gray-700 text-white"
                                        value={periodQuantity}
                                        onChange={e => setPeriodQuantity(e.target.value)}
                                    >
                                        <option value="">--</option>
                                        {PERIOD_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* Durée */}
                            <div className="flex gap-2 mb-2">
                                <div className="w-1/2">
                                    <label className="block text-white mb-1">Durée</label>
                                    <input
                                        className="w-full p-2 rounded bg-gray-700 text-white"
                                        value={duration}
                                        onChange={e => setDuration(e.target.value)}
                                        type="number"
                                        min="0"
                                        placeholder="Ex: 7"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-white mb-1">par</label>
                                    <select
                                        className="w-full p-2 rounded bg-gray-700 text-white"
                                        value={periodDuration}
                                        onChange={e => setPeriodDuration(e.target.value)}
                                    >
                                        <option value="">--</option>
                                        {PERIOD_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* Intervalle */}
                            <label className="block text-white mb-1">Intervalle</label>
                            <input
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                                value={interval}
                                onChange={e => setInterval(e.target.value)}
                                type="number"
                                min="0"
                                placeholder="Ex: 6 (heures entre prises)"
                            />
                            {/* Maximum */}
                            <div className="flex gap-2 mb-2">
                                <div className="w-1/2">
                                    <label className="block text-white mb-1">Maximum</label>
                                    <input
                                        className="w-full p-2 rounded bg-gray-700 text-white"
                                        value={maximum}
                                        onChange={e => setMaximum(e.target.value)}
                                        type="number"
                                        min="0"
                                        placeholder="Ex: 8"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-white mb-1">par</label>
                                    <select
                                        className="w-full p-2 rounded bg-gray-700 text-white"
                                        value={periodMaximum}
                                        onChange={e => setPeriodMaximum(e.target.value)}
                                    >
                                        <option value="">--</option>
                                        {PERIOD_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* Alarme */}
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="isAlarm"
                                    checked={isAlarm}
                                    onChange={e => setIsAlarm(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="isAlarm" className="text-white">Activer les rappels</label>
                            </div>
                            {/* Ajouter à mes traitements */}
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    id="isTreatment"
                                    checked={isTreatment}
                                    onChange={e => setIsTreatment(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="isTreatment" className="text-white">Ajouter à mes traitements</label>
                            </div>
                        </>
                    )}
                    <label className="block text-white mb-2">Date de prise</label>
                    <input
                        type="datetime-local"
                        className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
                        value={date}
                        min={minDate ? minDate.slice(0,16) : undefined}
                        max={maxDate ? maxDate.slice(0,16) : undefined}
                        onChange={e => setDate(e.target.value)}
                        required
                    />
                    </div>{/* fin scrollable */}
                    <div className="flex justify-end gap-4 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-500">Annuler</button>
                        <button type="submit" className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-500" disabled={isLoading}>
                            {isLoading ? 'Enregistrement...' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MedicationDialog;
