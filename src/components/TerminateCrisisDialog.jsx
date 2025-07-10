import React, { useState, useEffect } from 'react';

const TerminateCrisisDialog = ({ isOpen, onClose, onConfirm, crisisInfo, crisisStartDate }) => {
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (isOpen) {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for local timezone for datetime-local
            setEndDate(now.toISOString().slice(0, 16));
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (!endDate) {
            alert("Veuillez sélectionner une date de fin."); // Simple validation
            return;
        }
        const selectedEndDate = new Date(endDate);
        const startDate = new Date(crisisStartDate);

        if (selectedEndDate < startDate) {
            alert("La date de fin ne peut pas être antérieure à la date de début de la crise.");
            return;
        }
        onConfirm(endDate);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Terminer la crise</h2>
                <form onSubmit={e => { e.preventDefault(); handleConfirm(); }}>
                    <div className="mb-6">
                        <label htmlFor="endDate" className="block text-white/70 text-sm font-bold mb-2 text-left">
                            Date et heure de fin
                        </label>
                        <input
                            type="datetime-local"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            min={crisisStartDate ? new Date(new Date(crisisStartDate).getTime() - new Date(crisisStartDate).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-white bg-gray-600 hover:bg-gray-500 transition-colors">
                            Annuler
                        </button>
                        <button type="submit" className="px-4 py-2 rounded-lg text-white bg-teal-600 hover:bg-teal-500 transition-colors">
                            Confirmer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TerminateCrisisDialog;