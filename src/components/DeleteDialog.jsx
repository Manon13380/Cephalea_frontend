const DeleteDialog = ({ isOpen, onClose, onConfirm, medicationName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[black] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#368A7B] rounded-lg p-6 w-96 max-w-md">
                <div className="text-center">
                    <div className="text-xl font-semibold text-white mb-4">Êtes-vous sûr de supprimer le {medicationName}?</div>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onConfirm}
                            className="bg-blue-400 hover:bg-blue-600  text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Supprimer
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteDialog;