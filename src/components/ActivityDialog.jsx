import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import toastr from 'toastr';

export const ActivityDialog = ({ isOpen, onClose, onSave, crisisId }) => {
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState('');
    const { get } = useApi();

    useEffect(() => {
        if (isOpen) {
            const fetchActivities = async () => {
                try {
                    // Fetch all activities and the current crisis details in parallel
                    const [allActivities, crisisDetails] = await Promise.all([
                        get('/activities'),
                        get(`/crisis/${crisisId}`)
                    ]);

                    // Get IDs of activities already linked to the crisis
                    const crisisActivityIds = new Set(crisisDetails.activities.map(a => a.id));

                    // Filter out activities that are already added
                    const availableActivities = allActivities.filter(a => !crisisActivityIds.has(a.id));

                    setActivities(availableActivities);
                } catch (error) {
                    toastr.error('Erreur lors de la récupération des activités.');
                    console.error('Erreur lors de la récupération des activités:', error);
                }
            };
            fetchActivities();
        }
    }, [isOpen, crisisId, get]);

    const handleSave = () => {
        if (!selectedActivity) {
            toastr.warning('Veuillez sélectionner une activité.');
            return;
        }
        onSave({ activityId: selectedActivity });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-4">Ajouter une activité</h2>
                <select
                    value={selectedActivity}
                    onChange={e => setSelectedActivity(e.target.value)}
                    className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                    <option value="" disabled>Sélectionnez une activité</option>
                    {activities.map(activity => (
                        <option key={activity.id} value={activity.id}>
                            {activity.name}
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
