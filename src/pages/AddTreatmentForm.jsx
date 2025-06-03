import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrivateLayout from '../components/PrivateLayout';

const periodOptions = [
    { value: 'HOUR', label: 'Heure(s)' },
    { value: 'DAY', label: 'Jour(s)' },
    { value: 'WEEK', label: 'Semaine(s)' },
    { value: 'MONTH', label: 'Mois' },
    { value: 'YEAR', label: 'Année(s)' }
];

const AddTreatmentForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        quantity: '',
        periodQuantity: 'DAY',
        duration: '',
        periodDuration: 'DAY',
        interval: '',
        maximum: '',
        periodMaximum: 'WEEK',
        isAlarm: false,
        isTraitment: true,
        isDelete: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/treatments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    quantity: formData.quantity ? parseInt(formData.quantity) : null,
                    duration: formData.duration ? parseInt(formData.duration) : null,
                    maximum: formData.maximum ? parseInt(formData.maximum) : null,
                })
            });

            if (!response.ok) throw new Error('Erreur lors de l\'ajout du traitement');
            
            navigate('/traitements');
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de l\'ajout du traitement');
        }
    };

    return (
        <PrivateLayout>
            <div className="max-w-2xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold text-white mb-8">Ajouter un nouveau traitement</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations de base */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                Nom du médicament *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="dosage" className="block text-sm font-medium text-gray-300 mb-1">
                                Dosage
                            </label>
                            <input
                                type="text"
                                id="dosage"
                                name="dosage"
                                value={formData.dosage}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                placeholder="Ex: 50mg, 1 comprimé"
                            />
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">
                                    Quantité
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            <div className="w-32">
                                <label htmlFor="periodQuantity" className="block text-sm font-medium text-gray-300 mb-1">
                                    Période
                                </label>
                                <select
                                    id="periodQuantity"
                                    name="periodQuantity"
                                    value={formData.periodQuantity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    {periodOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
                                    Durée du traitement
                                </label>
                                <input
                                    type="number"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            <div className="w-32">
                                <label htmlFor="periodDuration" className="block text-sm font-medium text-gray-300 mb-1">
                                    Période
                                </label>
                                <select
                                    id="periodDuration"
                                    name="periodDuration"
                                    value={formData.periodDuration}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    {periodOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="interval" className="block text-sm font-medium text-gray-300 mb-1">
                                Intervalle entre les prises
                            </label>
                            <input
                                type="text"
                                id="interval"
                                name="interval"
                                value={formData.interval}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                placeholder="Ex: Toutes les 6 heures"
                            />
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label htmlFor="maximum" className="block text-sm font-medium text-gray-300 mb-1">
                                    Maximum par période
                                </label>
                                <input
                                    type="number"
                                    id="maximum"
                                    name="maximum"
                                    value={formData.maximum}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            <div className="w-32">
                                <label htmlFor="periodMaximum" className="block text-sm font-medium text-gray-300 mb-1">
                                    Période
                                </label>
                                <select
                                    id="periodMaximum"
                                    name="periodMaximum"
                                    value={formData.periodMaximum}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    {periodOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isAlarm"
                                name="isAlarm"
                                checked={formData.isAlarm}
                                onChange={handleChange}
                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-600 rounded bg-white/10"
                            />
                            <label htmlFor="isAlarm" className="ml-2 block text-sm text-gray-300">
                                Activer les rappels
                            </label>
                        </div>
                    </div>

                    {/* Champ caché pour isTraitment */}
                    <input type="hidden" name="isTraitment" value={true} />

                    <div className="flex justify-end space-x-4 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/treatments')}
                            className="px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-white/10 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </PrivateLayout>
    );
};

export default AddTreatmentForm;
