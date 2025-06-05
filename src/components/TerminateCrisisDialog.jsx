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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[#368A7B] rounded-lg p-6 w-full max-w-md shadow-xl">
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">{crisisInfo}</h3>
                    <div className="my-4">
                        <label htmlFor="endDate" className="block text-sm font-medium text-white/90 mb-1">
                            Date et heure de fin :
                        </label>
                        <input
                            type="datetime-local"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border border-slate-500 rounded-md bg-slate-700 text-white focus:ring-teal-400 focus:border-teal-400"
                            min={crisisStartDate ? new Date(new Date(crisisStartDate).getTime() - new Date(crisisStartDate).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                        />
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors"
                        >
                            Confirmer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminateCrisisDialog;