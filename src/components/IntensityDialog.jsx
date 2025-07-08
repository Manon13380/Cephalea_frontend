import React, { useState, useEffect } from 'react';

const IntensityDialog = ({ isOpen, onClose, onSubmit, intensity, crisisStartDate, crisisEndDate, mode }) => {
    const [date, setDate] = useState('');
    const [number, setNumber] = useState(5);

    useEffect(() => {
        if (mode === 'edit' && intensity) {
            const now = new Date(intensity.date);
            const tzOffset = now.getTimezoneOffset() * 60000;
            const localDate = new Date(now.getTime() - tzOffset);
            setDate(localDate.toISOString().slice(0, 16));
            setNumber(intensity.number);
        } else {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for local timezone for datetime-local
            setDate(now.toISOString().slice(0, 16));
            setNumber(5);
        }
    }, [isOpen, mode, intensity]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ date, number: parseInt(number, 10) });
    };

    const minDate = crisisStartDate;
    const maxDate = crisisEndDate ? crisisEndDate : "";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-6">{mode === 'edit' ? 'Modifier' : 'Ajouter'} une intensité</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="date" className="block text-white/70 text-sm font-bold mb-2">Date et Heure</label>
                        <input
                            type="datetime-local"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={minDate}
                            max={maxDate}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="number" className="block text-white/70 text-sm font-bold mb-2">Intensité: {number}</label>
                        <input
                            type="range"
                            id="number"
                            min="0"
                            max="10"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-white bg-gray-600 hover:bg-gray-500 transition-colors">
                            Annuler
                        </button>
                        <button type="submit" className="px-4 py-2 rounded-lg text-white bg-teal-600 hover:bg-teal-500 transition-colors">
                            {mode === 'edit' ? 'Enregistrer' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IntensityDialog;
