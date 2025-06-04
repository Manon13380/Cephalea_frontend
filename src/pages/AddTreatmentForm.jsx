import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import PrivateLayout from '../components/PrivateLayout';
import { useApi } from '../hooks/useApi';
import toastr from 'toastr';

const PERIOD_OPTIONS = [
    { value: 'HEURE', label: 'Heure' },
    { value: 'JOUR', label: 'Jour' },
    { value: 'SEMAINE', label: 'Semaine' },
    { value: 'MOIS', label: 'Mois' },
    { value: 'ANNEE', label: 'An' }
];

const AddTreatmentForm = () => {
    const navigate = useNavigate();
    const { post, loading } = useApi();
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        quantity: '',
        periodQuantity: null,
        duration: '',
        periodDuration: null,
        interval: '',
        maximum: '',
        periodMaximum: null,
        isAlarm: false,
        isTreatment: true,
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
            await post('/medications', formData);
            toastr.success('Traitement ajouté avec succès');
            navigate('/treatments');
        } catch (error) {
            console.error('Erreur lors de l\'ajout du traitement :', error);
            toastr.error(error.message || 'Une erreur est survenue lors de l\'ajout du traitement');
        }
    };

    return (
        <PrivateLayout>
            <div className="max-w-4xl mx-auto py-6 px-2 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Ajouter un traitement</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white/5 rounded-lg p-6 shadow">
                        <div className="space-y-6">
                            {/* Nom du médicament */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                                    Nom du médicament *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/30 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Ex: Doliprane"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Dosage */}
                                <div>
                                    <label htmlFor="dosage" className="block text-sm font-medium text-white/80 mb-1">
                                        Dosage
                                    </label>
                                    <input
                                        type="text"
                                        id="dosage"
                                        name="dosage"
                                        value={formData.dosage}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/30 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Ex: 1000mg"
                                    />
                                </div>

                                {/* Quantité */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label htmlFor="quantity" className="block text-sm font-medium text-white/80 mb-1">
                                            Quantité
                                        </label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            name="quantity"
                                            min="1"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/30 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="1"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="periodQuantity" className="block text-sm font-medium text-white/80 mb-1">
                                            par
                                        </label>
                                        <select
                                            id="periodQuantity"
                                            name="periodQuantity"
                                            value={formData.periodQuantity}
                                            onChange={handleChange}
                                            className="w-full px-1 sm:px-4 py-2 text-sm bg-white/10 border border-white/10 rounded-md text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        >
                                            {PERIOD_OPTIONS.map(option => (
                                                <option className="text-black" key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Durée */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label htmlFor="duration" className="block text-sm font-medium text-white/80 mb-1">
                                            Durée
                                        </label>
                                        <input
                                            type="number"
                                            id="duration"
                                            name="duration"
                                            min="1"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/30 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="1"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="periodDuration" className="block text-sm font-medium text-white/80 mb-1">
                                            par
                                        </label>
                                        <select
                                            id="periodDuration"
                                            name="periodDuration"
                                            value={formData.periodDuration}
                                            onChange={handleChange}
                                            className="w-full px-1 sm:px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-md text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        >
                                            {PERIOD_OPTIONS.map(option => (
                                                <option className="text-black" key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Intervalle */}
                                <div>
                                    <label htmlFor="interval" className="block text-sm font-medium text-white/80 mb-1">
                                        Intervalle entre les prises (heures)
                                    </label>
                                    <input
                                        type="number"
                                        id="interval"
                                        name="interval"
                                        min="1"
                                        value={formData.interval}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/30 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Ex: 6"
                                    />
                                </div>

                                {/* Maximum par période */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label htmlFor="maximum" className="block text-sm font-medium text-white/80 mb-1">
                                            Maximum
                                        </label>
                                        <input
                                            type="number"
                                            id="maximum"
                                            name="maximum"
                                            min="1"
                                            value={formData.maximum}
                                            onChange={handleChange}
                                            className="w-full px-1 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/30 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="1"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="periodMaximum" className="block text-sm font-medium text-white/80 mb-1">
                                            par
                                        </label>
                                        <select
                                            id="periodMaximum"
                                            name="periodMaximum"
                                            value={formData.periodMaximum}
                                            onChange={handleChange}
                                            className="w-full px-1 sm:px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-md placeholder-white/30  focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        >
                                            {PERIOD_OPTIONS.map(option => (
                                                <option className="text-black" key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Alarme */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isAlarm"
                                        name="isAlarm"
                                        checked={formData.isAlarm}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-teal-500 rounded border-white/20 bg-white/5 focus:ring-teal-500"
                                    />
                                    <label htmlFor="isAlarm" className="ml-2 block text-sm text-white/80">
                                        Activer les rappels
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/treatments')}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
                        >
                            <FiArrowLeft className="h-5 w-5" />
                            <span>Annuler</span>
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 rounded-md text-white flex items-center justify-center space-x-2 ${
                                loading
                                    ? 'bg-teal-500/50 cursor-not-allowed'
                                    : 'bg-teal-500 hover:bg-teal-600 transition-colors'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Enregistrement...</span>
                                </>
                            ) : (
                                <>
                                    <FiSave className="h-5 w-5" />
                                    <span>Enregistrer</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </PrivateLayout>
    );
};

export default AddTreatmentForm;
