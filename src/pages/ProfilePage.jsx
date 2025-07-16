import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaUserCircle, FaBirthdayCake, FaEnvelope, FaUserMd, FaPencilAlt, FaSave, FaTrash } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { toast } from 'react-toastify';
import PrivateLayout from '../components/PrivateLayout';
import useApi from '../hooks/useApi';
import DeleteDialog from '../components/DeleteDialog';



const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { loading, error, get, update, remove } = useApi();
    const navigate = useNavigate();

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split("-");
        return `${day}-${month}-${year}`;
      };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                toast.error('Aucun token trouvé.');
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;
                console.log('Fetching data for userId:', userId);
                const data = await get(`/user/${userId}`);
                setUser(data);
                setEditedUser(data);
            } catch (err) {
                toast.error('Impossible de charger les informations de l\'utilisateur.');
            }
        };

        fetchUserData();
    }, [get]);

    const handleEditToggle = () => {
        if (isEditing) {
            setEditedUser(user); // Reset changes on cancel
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleSave = async () => {
        try {
            // Exclude password and role from the data sent to the server for security best practices
            const { password, role, ...dataToUpdate } = editedUser;

            const dataToSend = {
                ...dataToUpdate,
                birthDate: formatDate(dataToUpdate.birthDate),
            };

            const response = await update(`/user/${user.id}`, dataToSend);
            setUser(response);
            setEditedUser(response); // Keep editedUser in sync
            setIsEditing(false);
        } catch (err) {
            toast.error('Impossible de sauvegarder les modifications.');
        }
    };

    const handleDelete = () => {
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await remove(`/user/${user.id}`);
            toast.success('Votre compte a été supprimé avec succès.');
            sessionStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            toast.error('Impossible de supprimer le compte.');
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    if (loading) {
        return (
            <PrivateLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
            </PrivateLayout>
        );
    }

    if (error) {
        return (
            <PrivateLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="text-red-400">Erreur lors du chargement du profil</div>
                </div>
            </PrivateLayout>
        );
    }

    if (!user) {
        return null; // Ne rien afficher si l'utilisateur n'est pas encore chargé et qu'il n'y a pas d'erreur
    }

    return (
        <PrivateLayout>
            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                info="votre compte"
            />
            <div className="text-white p-4 md:p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Mon Profil</h1>
                {user && (
                    <div className="relative bg-white/5  rounded-lg shadow-lg p-4 sm:p-8 max-w-lg mx-auto">
                        {!isEditing ? (
                            <>
                                <div className="absolute top-2 right-2 md:top-4 md:right-4 flex space-x-2">
                                    <button onClick={handleEditToggle} className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-full transition-colors">
                                        <FaPencilAlt className="w-5 h-5 text-white" />
                                    </button>
                                                                        <button onClick={handleDelete} className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-full transition-colors">
                                        <FaTrash className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                                <div className="flex flex-col items-center mb-6">
                                    <FaUserCircle className="text-5xl md:text-6xl text-teal-400 mb-4" />
                                    <h2 className="text-2xl md:text-3xl font-bold text-center">{user.firstName} {user.name}</h2>
                                    <p className="text-gray-400 flex items-center mt-2 text-xs md:text-sm">
                                        <FaEnvelope className="mr-2" /> {user.email}
                                    </p>
                                </div>
                                <div className="border-t border-gray-700 my-6"></div>
                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <FaBirthdayCake className="w-6 h-6 text-teal-400 mr-4 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold">Date de naissance</p>
                                            <p className="text-gray-400">{new Date(user.birthDate).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <FaUserMd className="w-6 h-6 text-teal-400 mr-4 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold">Médecin traitant</p>
                                            <p className="text-gray-400">{user.doctor || 'Non renseigné'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <FaUserMd className="w-6 h-6 text-teal-400 mr-4 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold">Neurologue</p>
                                            <p className="text-gray-400">{user.neurologist || 'Non renseigné'}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-center mb-4">Modifier le profil</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">Prénom</label>
                                        <input type="text" name="firstName" value={editedUser.firstName} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">Nom</label>
                                        <input type="text" name="name" value={editedUser.name} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Email</label>
                                    <input type="email" name="email" value={editedUser.email} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Date de naissance</label>
                                    <input type="date" name="birthDate" value={editedUser.birthDate ? editedUser.birthDate.split('T')[0] : ''} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Médecin traitant</label>
                                    <input type="text" name="doctor" value={editedUser.doctor} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Neurologue</label>
                                    <input type="text" name="neurologist" value={editedUser.neurologist} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 mt-6 space-y-2 sm:space-y-0">
                                    <button onClick={handleEditToggle} className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                        <MdCancel className="mr-2" /> Annuler
                                    </button>
                                    <button onClick={handleSave} className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                        <FaSave className="mr-2" /> Sauvegarder
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PrivateLayout>
    );
};

export default ProfilePage;
