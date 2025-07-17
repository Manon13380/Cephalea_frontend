import React, { useState } from 'react';
import toastr from 'toastr';

const ChangePasswordModal = ({ isOpen, onClose, onConfirm }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (newPassword !== confirmPassword) {
            setError('Les nouveaux mots de passe ne correspondent pas.');
            toastr.error('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
            toastr.error('Le nouveau mot de passe doit contenir au moins 6 caractères.');
            return;
        }
        setError('');
        onConfirm({ oldPassword, newPassword, confirmPassword });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Changer le mot de passe</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Ancien mot de passe</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Nouveau mot de passe</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Confirmer le nouveau mot de passe</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none">
                        Annuler
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none">
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
