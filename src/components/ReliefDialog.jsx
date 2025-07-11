import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { toast } from 'react-toastify';

export const ReliefDialog = ({ 
    isOpen, 
    onClose, 
    onSave, 
    crisisId,
    initialData = null 
}) => {
    const { get, post, put } = useApi();
    const [reliefs, setReliefs] = useState([]);
    const [selectedReliefId, setSelectedReliefId] = useState('');
    const [date, setDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = !!initialData;

    useEffect(() => {
        const fetchReliefs = async () => {
            try {
                const [allReliefs, crisisDetails] = await Promise.all([
                    get('/soulagements'),
                    get(`/crisis/${crisisId}`)
                ]);

                const crisisReliefIds = new Set(crisisDetails.soulagements.map(s => s.id));
                const availableReliefs = allReliefs.filter(r => !crisisReliefIds.has(r.id));

                setReliefs(availableReliefs);
            } catch (error) {
                console.error('Erreur lors du chargement des soulagements:', error);
                toast.error('Erreur lors du chargement des types de soulagement');
            }
        };

        if (isOpen) {
            fetchReliefs();
            if (initialData) {
                setSelectedReliefId(initialData.reliefTypeId || '');
                setDate(initialData.date ? initialData.date.split('.')[0] : '');
            } else {
                setSelectedReliefId('');
                setDate(new Date().toISOString().slice(0, 16));
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedReliefId || typeof selectedReliefId !== 'string' || selectedReliefId.trim() === '') {
            toast.error('Veuillez sélectionner un type de soulagement');
            return;
        }

        const reliefData = {
            reliefId: selectedReliefId
        };

        try {
            setIsLoading(true);
            await onSave(reliefData);
            onClose();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du soulagement:', error);
            toast.error('Erreur lors de la sauvegarde du soulagement');
        } finally {
            setIsLoading(false);
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-6">{isEditMode ? 'Modifier' : 'Ajouter'} un soulagement</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="reliefData" className="block text-white/70 text-sm font-bold mb-2">Type de soulagement *</label>
                        <select
                            id="reliefData"
                            value={selectedReliefId}
                            onChange={(e) => setSelectedReliefId(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            disabled={isLoading}
                            required
                        >
                            <option value="">Sélectionnez un type de soulagement</option>
                            {reliefs.map(relief => (
                                <option key={relief.id} value={relief.id}>{relief.name}</option>
                            ))}
                        </select>
                    </div>
                   
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-white bg-gray-600 hover:bg-gray-500 transition-colors" disabled={isLoading}>
                            Annuler
                        </button>
                        <button type="submit" className="px-4 py-2 rounded-lg text-white bg-teal-600 hover:bg-teal-500 transition-colors" disabled={isLoading}>
                            {isLoading ? 'Enregistrement...' : (isEditMode ? 'Enregistrer' : 'Ajouter')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
