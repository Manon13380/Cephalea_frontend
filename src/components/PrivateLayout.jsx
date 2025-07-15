import React, { useState, useRef, useEffect } from 'react';
import { FiSettings, FiZap, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { FaHome, FaPills, FaCalendarAlt, FaListUl } from 'react-icons/fa';
import LogoCephalea from '../assets/images/Logo_cephalea.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PrivateLayout = ({ children, showPopup}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // Supprimer le token du sessionStorage
        sessionStorage.removeItem('token');
        // Rediriger vers la page de connexion
        navigate('/');
    };
    
    return (
        <div className="min-h-screen w-screen bg-gradient-to-b from-[#368A7B] to-black flex flex-col">
            {/* Overlay */}
            {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-[#4A4A4A] opacity-50 z-40" />
            )}
            
            {/* Header - Fixed height */}
            <header className="h-24 px-4">
                <div className="w-[90%] max-w-[1024px] mx-auto flex justify-between items-center h-full">
                    <img src={LogoCephalea} alt="Céphaléa" className="h-16" />
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center space-x-1 bg-transparent border-none outline-none text-gray-400 hover:text-gray-200 focus:outline-none transition-colors"
                        >
                        <FiSettings size={24} />
                            <FiChevronDown size={16} className={`transition-transform ${isMenuOpen ? 'transform rotate-180' : ''}`} />
                        </button>
                        
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#2A2A2A] rounded-md shadow-lg py-1 z-50">
                                <button
                                    onClick={handleLogout}
                                    className="block px-4 py-2 text-gray-300 hover:text-[#368A7B] hover:bg-[#3A3A3A] hover:border-none bg-transparent flex items-center space-x-2 no-underline w-full text-left"
                                >
                                    <FiLogOut size={16} />
                                    <span>Déconnexion</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main content - Flexible height */}
            <main className="flex-1 px-4 overflow-y-auto pb-24">
                <div className="w-[90%] max-w-[1024px] mx-auto">
                    {children}
                </div>
            </main>

            <footer className='w-full pt-10 pb-4 mt-auto'>
                <div className="flex justify-between items-center max-w-6xl mx-auto cursor-pointer fixed bottom-0 left-1/2 transform -translate-x-1/2 sm:gap-10">
                    {/* Icônes de gauche */}
                    <div className="flex sm:gap-10">
                        <Link to="/home">
                            <button className={`bg-transparent border-none outline-none ${location.pathname === '/home' ? 'text-white' : 'text-teal-400'} hover:text-teal-300 cursor-pointer focus:outline-none`}>
                                <FaHome size={24} />
                            </button>
                        </Link>
                        <Link to="/treatments">
                            <button className={`bg-transparent border-none outline-none ${location.pathname === '/treatments' ? 'text-white' : 'text-teal-400'} hover:text-teal-300 cursor-pointer focus:outline-none`}>
                                <FaPills size={24} />
                            </button>
                        </Link>
                    </div>

                    {/* Icône centrale */}
                    <div className="flex justify-center items-center flex-grow">
                        <Link to="/crisis-form">
                            <button className={`bg-gradient-to-r from-teal-400 rounded-full p-3 hover:border-none border-none focus:outline-none ${location.pathname === '/crisis-form' ? 'ring-2 ring-white' : ''}`}>
                                <FiZap size={32} color="white" />
                            </button>
                        </Link>
                    </div>

                    {/* Icônes de droite */}
                    <div className="flex sm:gap-10">
                                                <Link to="/calendar">
                            <button className={`bg-transparent border-none outline-none ${location.pathname === '/calendar' ? 'text-white' : 'text-teal-400'} hover:text-teal-300 cursor-pointer focus:outline-none`}>
                                <FaCalendarAlt size={24} />
                            </button>
                        </Link>
                        <Link to="/crisis-list">
                            <button className={`bg-transparent border-none outline-none ${location.pathname === '/crisis-list' ? 'text-white' : 'text-teal-400'} hover:text-teal-300 cursor-pointer focus:outline-none`}>
                                <FaListUl size={24} />
                            </button>
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PrivateLayout;
