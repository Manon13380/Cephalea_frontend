import React, { useState, useEffect } from 'react';

const TerminateCrisisDialog = ({
    isOpen,
    onClose,
    onConfirm,
    mode = 'terminate', // 'terminate' | 'editStartDate'
    dialogTitle = 'Terminer la crise',
    dateLabel = 'Date et heure de fin',
    initialDateISO,
    minConstraintDateISO,
    maxConstraintDateISO
}) => {
    const [endDate, setEndDate] = useState('');

        useEffect(() => {
        if (isOpen) {
            let initialDate;
            if (initialDateISO) {
                initialDate = new Date(initialDateISO);
            } else {
                initialDate = new Date(); // Fallback to now if no initial date is provided
            }
            initialDate.setMinutes(initialDate.getMinutes() - initialDate.getTimezoneOffset());
            setEndDate(initialDate.toISOString().slice(0, 16));
        }
    }, [isOpen, initialDateISO]);

    const handleConfirm = () => {
        if (!endDate) {
            alert("Veuillez sélectionner une date de fin."); // Simple validation
            return;
        }
                if (minConstraintDateISO) {
            const minDate = new Date(minConstraintDateISO);
            if (new Date(endDate) < minDate) {
                alert(`La date ne peut pas être antérieure au ${new Date(minConstraintDateISO).toLocaleString()}.`);
                return;
            }
        }

        if (maxConstraintDateISO) {
            const maxDate = new Date(maxConstraintDateISO);
            if (new Date(endDate) > maxDate) {
                alert(`La date ne peut pas être postérieure au ${new Date(maxConstraintDateISO).toLocaleString()}.`);
                return;
            }
        }
        onConfirm(endDate);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                                <h2 className="text-2xl font-bold text-white mb-6 text-center">{dialogTitle}</h2>
                <form onSubmit={e => { e.preventDefault(); handleConfirm(); }}>
                    <div className="mb-6">
                                                <label htmlFor="endDate" className="block text-white/70 text-sm font-bold mb-2 text-left">
                            {dateLabel}
                        </label>
                        <input
                            type="datetime-local"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                        min={minConstraintDateISO ? new Date(new Date(minConstraintDateISO).getTime() - new Date(minConstraintDateISO).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                            max={maxConstraintDateISO ? new Date(new Date(maxConstraintDateISO).getTime() - new Date(maxConstraintDateISO).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
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