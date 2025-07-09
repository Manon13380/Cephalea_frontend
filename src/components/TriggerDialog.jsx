import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import toastr from 'toastr';

export const TriggerDialog = ({ isOpen, onClose, onSave, crisisId }) => {
    const [triggers, setTriggers] = useState([]);
    const [selectedTrigger, setSelectedTrigger] = useState('');
    const { get } = useApi();

    useEffect(() => {
        if (isOpen) {
            const fetchTriggers = async () => {
                try {
                    const [allTriggers, crisisDetails] = await Promise.all([
                        get('/triggers'),
                        get(`/crisis/${crisisId}`)
                    ]);

                    const crisisTriggerIds = new Set(crisisDetails.triggers.map(t => t.id));
                    const availableTriggers = allTriggers.filter(t => !crisisTriggerIds.has(t.id));

                    setTriggers(availableTriggers);
                } catch (error) {
                    toastr.error('Erreur lors de la récupération des déclencheurs.');
                    console.error('Erreur lors de la récupération des déclencheurs:', error);
                }
            };
            fetchTriggers();
        }
    }, [isOpen, crisisId, get]);

    const handleSave = () => {
        if (!selectedTrigger) {
            toastr.warning('Veuillez sélectionner un déclencheur.');
            return;
        }
        onSave({ triggerId: selectedTrigger });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-4">Ajouter un déclencheur</h2>
                <select
                    value={selectedTrigger}
                    onChange={e => setSelectedTrigger(e.target.value)}
                    className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                    <option value="" disabled>Sélectionnez un déclencheur</option>
                    {triggers.map(trigger => (
                        <option key={trigger.id} value={trigger.id}>
                            {trigger.name}
                        </option>
                    ))}
                </select>
                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500 transition-colors"
                    >
                        Ajouter
                    </button>
                </div>
            </div>
        </div>
    );
};
